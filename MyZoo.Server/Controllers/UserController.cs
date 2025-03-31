using Microsoft.AspNetCore.Mvc;

namespace MyZoo.Server.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
