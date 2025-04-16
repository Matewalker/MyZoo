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
            var userId = HttpContext.Session.GetInt32("UserId");

            if (string.IsNullOrEmpty(username) || userId == null)
            {
                return Unauthorized(new { message = "User is not logged in." });
            }

            return Ok(new { username, userId });
        }
    }
}
