using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyZoo.Data;
using MyZoo.Server.Models;

namespace MyZoo.Server.Controllers
{
    [Route("api/animal")]
    [ApiController]
    public class AnimalController : Controller
    {    
        private readonly ZooContext _context;
        public AnimalController(ZooContext context)
        {
            _context = context;
        }

        [HttpGet("get-animals")]
        public JsonResult GetAnimals(string continent = null)
        {
            try
            {
                IQueryable<Animals> query = _context.Animals
                .Include(a => a.AnimalSpecies)
                .Where(a => a.Gender != 2)
                .OrderBy(a => a.AnimalSpecies.Species);

                if (!string.IsNullOrEmpty(continent))
                {
                    query = query.Where(a => a.AnimalSpecies.AnimalContinents
                        .Any(ac => ac.Continent.Name == continent));
                }

                var animals = query.ToList();

                return new JsonResult(animals) { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                return new JsonResult(new { message = "An error occurred while retrieving animals.", error = ex.Message }) { StatusCode = 500 };
            }
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
                return NotFound();

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
    }
}
