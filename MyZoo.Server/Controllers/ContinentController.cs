using Microsoft.AspNetCore.Mvc;
using MyZoo.Data;

namespace MyZoo.Server.Controllers
{
    [Route("api/continent")]
    [ApiController]
    public class ContinentController : Controller
    {
        private readonly ZooContext _context;
        public ContinentController(ZooContext context)
        {
            _context = context;
        }

        [HttpGet("get-continents")]
        public IActionResult GetContinents()
        {
            try
            {
                var continents = _context.Continents.ToList();
                return Ok(continents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving continents.", error = ex.Message });
            }
        }
    }
}
