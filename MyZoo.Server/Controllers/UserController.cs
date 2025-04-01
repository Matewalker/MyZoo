using Microsoft.AspNetCore.Mvc;
using MyZoo.Data;

namespace MyZoo.Server.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly ZooContext _context;

        public UserController(ZooContext context)
        {
            _context = context;
        }

        [HttpGet("get-username")]
        public IActionResult GetUsername()
        {
            var username = HttpContext.Session.GetString("Username");

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized(new { success = false, message = "Felhasználó nincs bejelentkezve." });
            }

            return Ok(new { username });
        }
    }
}
