using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyZoo.Data;
using MyZoo.Server.Models;
using System.Text.Json;

namespace MyZoo.Server.Controllers
{
    [Route("api/zoo")]
    [ApiController]
    public class ZooController : Controller
    {
        private readonly ZooContext _context;

        public ZooController(ZooContext context)
        {
            _context = context;
        }

        [HttpGet("warehouse-animals")]
        public JsonResult GetWarehouseAnimals()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return Json(new { message = "Felhasználó nincs bejelentkezve.", status = "Unauthorized" });

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return Json(new { message = "Felhasználó nem található.", status = "NotFound" });

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var animalIds = warehouseAnimals.Select(a => a.AnimalId).ToList();
            var animals = _context.Animals.Where(a => animalIds.Contains(a.Id)).Include(a => a.AnimalSpecies).ToList();

            var combinedAnimals = warehouseAnimals
            .Join(animals,
              wa => wa.AnimalId,
              a => a.Id,
              (wa, a) => new
              {
                  WarehouseAnimalId = wa.Id,
                  AnimalId = a.Id,
                  a.Image,
                  a.Gender,
                  a.Value,
                  AnimalSpecies = _context.AnimalSpecies.FirstOrDefault(s => s.Id == a.AnimalSpeciesId)
              }).ToList();

            return Json(new { status = "Success", animals = combinedAnimals });
        }

        [HttpGet("get-zoo-animals")]
        public JsonResult GetZooAnimals()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return Json(new { message = "Felhasználó nincs bejelentkezve.", status = "Unauthorized" });

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return Json(new { message = "Felhasználó nem található.", status = "NotFound" });

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            var animalIds = zooAnimals.Select(a => a.AnimalId).ToList();
            var animals = _context.Animals.Where(a => animalIds.Contains(a.Id)).Include(a => a.AnimalSpecies).ToList();

            var combinedAnimals = zooAnimals
            .Join(animals,
              za => za.AnimalId,
              a => a.Id,
              (za, a) => new
              {
                  WarehouseAnimalId = za.Id,
                  AnimalId = a.Id,
                  a.Image,
                  a.Gender,
                  a.AttractionRating,
                  CanReproduce = za.CanReproduce,
                  CurrentAge = za.CurrentAge,
                  AnimalSpecies = _context.AnimalSpecies.FirstOrDefault(s => s.Id == a.AnimalSpeciesId)
              }).ToList();

            return Json(new { status = "Success", animals = combinedAnimals, ticketPrice = user.TicketPrices });
        }

        [HttpGet("get-animal-data/{id}")]
        public async Task<ActionResult<AnimalData>> GetAnimalData(int id)
        {
            var animal = _context.Animals.FirstOrDefault(a => a.Id == id);

            var species = _context.AnimalSpecies.FirstOrDefault(s => s.Id == animal.AnimalSpeciesId);

            var whichFeed = _context.AnimalFeeds.FirstOrDefault(f => f.AnimalSpeciesId == species.Id);

            var feed = _context.Feed.FirstOrDefault(f => f.Id == whichFeed.FeedId);

            var whichContinents = _context.AnimalContinents.Where(ac => ac.AnimalSpeciesId == species.Id).ToList();

            var continentIds = whichContinents.Select(wc => wc.ContinentId).ToList();

            var continents = _context.Continents.Where(c => continentIds.Contains(c.Id)).ToList();

            if (animal == null || species == null || whichFeed == null || feed == null || whichContinents == null || continentIds == null || continents == null)
            {
                return NotFound();
            }

            var animalData = new AnimalData
            {
                Id = animal.Id,
                Gender = animal.Gender,
                Image = animal.Image,
                FeedingPeriod = animal.FeedingPeriod,
                AgePeriod = animal.AgePeriod,
                Value = animal.Value,
                AttractionRating = animal.AttractionRating,
                Species = species.Species,
                Feed = feed.FeedName,
                Continents = continents.Select(c => c.Name).ToList()
            };

            return Ok(animalData);
        }

        [HttpGet("continents")]
        public IActionResult GetContinents()
        {
            try
            {
                var continents = _context.Continents.ToList();
                return Ok(continents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt a kontinensek lekérésekor.", error = ex.Message });
            }
        }

        [HttpPost("set-ticket-prices")]
        public IActionResult SetTicketPrices([FromBody] int ticketPrice)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized("Felhasználó nincs bejelentkezve.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
            {
                return NotFound("Felhasználó nem található.");
            }

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            int animalCount = zooAnimals.Count;

            if (animalCount < 3 && ticketPrice > 5)
            {
                ticketPrice = 5;
            }
            else if (animalCount < 10 && ticketPrice > 8)
            {
                ticketPrice = 8;
            }
            else if (animalCount < 25 && ticketPrice > 15)
            {
                ticketPrice = 15;
            }
            else if (animalCount < 40 && ticketPrice > 25)
            {
                ticketPrice = 25;
            }
            else if (ticketPrice > 150)
            {
                ticketPrice = 150;
            }

            // Jegyárak beállítása
            user.TicketPrices = ticketPrice;

            _context.Users.Update(user);
            _context.SaveChanges();

            return Ok(new { message = "Jegyár sikeresen beállítva.", newPrice = ticketPrice });
        }
    }
}
