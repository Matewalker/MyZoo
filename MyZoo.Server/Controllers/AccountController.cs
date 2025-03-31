using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyZoo.Data;
using MyZoo.Server.Models;
using Microsoft.AspNetCore.Http;

namespace MyZoo.Server.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly ZooContext _context;
        private readonly PasswordHasher<UserModel> _passwordHasher;

        public AccountController(ZooContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<UserModel>();
        }

        // REGISZTRÁCIÓ
        [HttpPost("register")]
        public JsonResult Register([FromBody] UserModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.PasswordHash))
            {
                return new JsonResult(new { message = "Érvénytelen adatok!" }) { StatusCode = 400 };
            }

            if (_context.Users.Any(u => u.Username == model.Username))
            {
                return new JsonResult(new { message = "A felhasználónév már létezik!" }) { StatusCode = 400 };
            }

            var hashedPassword = _passwordHasher.HashPassword(model, model.PasswordHash);
            var newUser = new UserModel
            {
                Username = model.Username,
                PasswordHash = hashedPassword,
                Capital = 5000,
                TicketPrices = 0,
                CurrentDate = new DateTime(2025, 1, 1),
                Visitors = 0
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return new JsonResult(new { message = "Sikeres regisztráció!" }) { StatusCode = 200 };
        }

        // BEJELENTKEZÉS
        [HttpPost("login")]
        public JsonResult Login([FromBody] UserModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username);

            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.PasswordHash) != PasswordVerificationResult.Success)
            {
                return new JsonResult(new { message = "Hibás felhasználónév vagy jelszó!" }) { StatusCode = 400 };
            }

            // Session beállítása bejelentkezéskor
            HttpContext.Session.SetString("Username", user.Username);
            HttpContext.Session.SetInt32("UserId", user.Id);

            return new JsonResult(new { message = "Sikeres bejelentkezés!" }) { StatusCode = 200 };
        }

        // KIJELETKEZÉS
        [HttpPost("logout")]
        public JsonResult Logout()
        {
            // 📌 Session törlése kijelentkezéskor
            HttpContext.Session.Remove("Username");
            HttpContext.Session.Remove("UserId");

            return new JsonResult(new { message = "Sikeres kijelentkezés!" }) { StatusCode = 200 };
        }

        // FELHASZNÁLÓ LEKÉRÉSE A SESSIOBÓL
        [HttpGet("me")]
        public JsonResult GetUser()
        {
            var username = HttpContext.Session.GetString("Username");
            var userId = HttpContext.Session.GetInt32("UserId");

            if (string.IsNullOrEmpty(username) || userId == null)
            {
                return new JsonResult(new { message = "Nincs bejelentkezve felhasználó!" }) { StatusCode = 401 };
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return new JsonResult(new { message = "Felhasználó nem található!" }) { StatusCode = 404 };

            return new JsonResult(new { user.Username, user.Capital, user.TicketPrices, user.CurrentDate }) { StatusCode = 200 };
        }
    }
}
