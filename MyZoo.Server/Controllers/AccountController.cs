using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyZoo.Data;
using MyZoo.Server.Models;

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

        [HttpPost("register")]
        public JsonResult Register([FromBody] UserModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.PasswordHash))
                return new JsonResult(new { message = "Invalid data!" }) { StatusCode = 400 };

            if (_context.Users.Any(u => u.Username == model.Username))
                return new JsonResult(new { message = "Username already exists!" }) { StatusCode = 400 };

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

            return new JsonResult(new { message = "Successful registration!" }) { StatusCode = 200 };
        }

        [HttpPost("login")]
        public JsonResult Login([FromBody] UserModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username);

            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.PasswordHash) != PasswordVerificationResult.Success)
                return new JsonResult(new { message = "Incorrect username or password!" }) { StatusCode = 400 };

            HttpContext.Session.SetString("Username", user.Username);
            HttpContext.Session.SetInt32("UserId", user.Id);

            return new JsonResult(new { message = "Successful login!" }) { StatusCode = 200 };
        }

        [HttpPost("logout")]
        public JsonResult Logout()
        {
            HttpContext.Session.Clear();
            MessageStorage.Messages.Clear();

            return new JsonResult(new { message = "Successful login!" }) { StatusCode = 200 };
        }
    }
}
