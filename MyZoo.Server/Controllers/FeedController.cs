using Microsoft.AspNetCore.Mvc;
using MyZoo.Data;
using MyZoo.Server.Models;
using System.Text.Json;

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
        public JsonResult GetFeeds([FromQuery] bool isFiltered = false)
        {
            try
            {
                if (isFiltered)
                {
                    var userId = HttpContext.Session.GetInt32("UserId");
                    if (userId == null)
                        return new JsonResult(new { message = "User is not logged in.", status = "Unauthorized" }) { StatusCode = 401 };

                    var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
                    if (user == null)
                        return new JsonResult(new { message = "User not found!", status = "NotFound" }) { StatusCode = 404 };

                    var zooAnimals = user.ZooAnimals != null
                    ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                    : new List<MyAnimalModel>();

                    var allowedFeedIds = new HashSet<int>();

                    foreach (var animal in zooAnimals)
                    {
                        var dbAnimal = _context.Animals.FirstOrDefault(a => a.Id == animal.AnimalId);
                        if (dbAnimal == null) continue;

                        var species = _context.AnimalSpecies.FirstOrDefault(s => s.Id == dbAnimal.AnimalSpeciesId);
                        if (species == null) continue;

                        var animalFeed = _context.AnimalFeeds.FirstOrDefault(f => f.AnimalSpeciesId == species.Id);
                        if (animalFeed == null) continue;

                        allowedFeedIds.Add(animalFeed.FeedId);
                    }

                    var feeds = _context.Feed.Where(f => allowedFeedIds.Contains(f.Id)).ToList();

                    return new JsonResult( new { message = "Food retrieval successful.", newFeeds = feeds, status = "Success" }) { StatusCode = 200 };
                }
                else
                {
                    var feeds = _context.Feed.ToList();
                    return new JsonResult(new { message = "Food retrieval successful.", newFeeds = feeds, status = "Success" }) { StatusCode = 200 };
                }
            }
            catch
            {
                return new JsonResult(new { message = "An error occurred while retrieving feed.", status = "Error" }) { StatusCode = 500 };
            }
        }
    }
}
