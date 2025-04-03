using Microsoft.AspNetCore.Mvc;
using MyZoo.Data;
using System.Collections.Generic;

namespace MyZoo.Server.Controllers
{
    [Route("api/feed")]
    [ApiController]
    public class FeedController : Controller
    {
        private readonly ZooContext _context;

        public FeedController(ZooContext context)
        {
            _context = context;
        }

        [HttpGet("get-feed")]
        public IActionResult GetFeeds()
        {
            try
            {
                var feeds = _context.Feed.ToList();

                return Ok(feeds);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt az állatok lekérésekor.", error = ex.Message });
            }
        }
    }
}
