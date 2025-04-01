using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyZoo.Data;
using MyZoo.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;

namespace MyZoo.Server.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
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
        public IActionResult Logout()
        {
            // Session törlése kijelentkezéskor
            HttpContext.Session.Remove("Username");
            HttpContext.Session.Remove("UserId");

            return Ok(new { message = "Sikeres kijelentkezés!" });
        }

        // FELHASZNÁLÓ LEKÉRÉSE A SESSIOBÓL
        [HttpGet("me")]
        public IActionResult GetUser()
        {
            var username = HttpContext.Session.GetString("Username");
            var userId = HttpContext.Session.GetInt32("UserId");

            if (string.IsNullOrEmpty(username) || userId == null)
            {
                return Unauthorized(new { message = "Nincs bejelentkezve felhasználó!" });
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound(new { message = "Felhasználó nem található!" });

            return Ok(new { user.Username, user.Capital, user.TicketPrices, user.CurrentDate });
        }
    }
}
