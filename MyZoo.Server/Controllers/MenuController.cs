using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyZoo.Data;
using MyZoo.Server.Models;
using System.Text.Json;

namespace MyZoo.Server.Controllers
{
    [Route("api/menu")]
    [ApiController]
    public class MenuController : Controller
    {
        private readonly ZooContext _context;

        public MenuController(ZooContext context)
        {
            _context = context;
        }

        [HttpGet("user-data/{username}")]
        public IActionResult GetUserData(string username)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                return NotFound(new { success = false, message = "Felhasználó nem található." });
            }

            return Ok(new
            {
                success = true,
                currentDate = user.CurrentDate.ToString("yyyy-MMM"),
                capital = user.Capital,
                visitors = user.Visitors
            });
        }

        [HttpPost("next-turn")]
        public IActionResult NextTurn()
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

            // JSON deszerializálás
            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            // Az összes állat ID lekérése
            var animalIds = zooAnimals.Select(a => a.AnimalId).ToList();
            var animals = _context.Animals.Where(a => animalIds.Contains(a.Id)).ToList();

            // Állatok életkorának frissítése
            UpdateAnimalAges(user, warehouseAnimals);
            UpdateAnimalAges(user, zooAnimals);

            user.ZooAnimals = JsonSerializer.Serialize(zooAnimals);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);
            _context.Users.Update(user);
            _context.SaveChanges();

            // Látogatók számának frissítése
            int totalAttraction = animals.Sum(a => a.AttractionRating);
            user.Visitors = CalculateVisitors(totalAttraction, zooAnimals.Count);

            // Etetési költségek levonása
            ProcessFeedingCosts(user);

            HandleReproduction(user);

            // Pénz frissítése jegyekből
            user.Capital += user.Visitors * user.TicketPrices;

            user.CurrentDate = user.CurrentDate.AddMonths(1);
            _context.Users.Update(user);
            _context.SaveChanges();

            return Json(new { success = true, newDate = user.CurrentDate.ToString("yyyy-MMM"), newCapital = user.Capital, newVisitors = user.Visitors });
        }

        private void UpdateAnimalAges(UserModel user, List<MyAnimalModel> animals)
        {
            for (int i = animals.Count - 1; i >= 0; i--)  // Hátrafelé iterálás a biztonságos törléshez
            {
                var animal = animals[i];
                var dbAnimal = _context.Animals.FirstOrDefault(a => a.Id == animal.AnimalId);
                if (dbAnimal == null) continue;

                var species = _context.AnimalSpecies.FirstOrDefault(s => s.Id == dbAnimal.AnimalSpeciesId);
                if (species == null) continue;

                Random rnd = new Random();

                if (animal.CurrentAge > 0)
                {
                    animal.CurrentAge--;
                }
                // Ha most válik felnőtté
                else if (animal.CurrentAge == 0 && dbAnimal.Gender == 2)
                {
                    int randomGender = rnd.Next(0, 2);
                    var adultAnimal = _context.Animals.FirstOrDefault(a => a.Gender == randomGender && a.AnimalSpeciesId == species.Id);

                    var myAdultAnimal = new MyAnimalModel
                    {
                        Id = animal.Id,
                        AnimalId = adultAnimal.Id,
                        CurrentAge = adultAnimal.AgePeriod,
                        CanReproduce = true
                    };
                    // Átalakul felnőtt állattá
                    animals.RemoveAt(i);
                    animals.Add(myAdultAnimal);
                }
                else if (animal.CurrentAge == 0 && dbAnimal.Gender != 2)
                {
                    animals.RemoveAt(i);
                }
            }
        }

        private int CalculateVisitors(int totalAttraction, int zooAnimalCount)
        {
            Random rnd = new Random();

            int multiplier = zooAnimalCount switch
            {
                < 10 => rnd.Next(1, 4),
                >= 10 and < 25 => rnd.Next(4, 8),
                >= 25 and < 75 => rnd.Next(8, 11),
                _ => rnd.Next(11, 15),
            };

            return totalAttraction * multiplier;
        }

        private void ProcessFeedingCosts(UserModel user)
        {
            var zooAnimals = user.ZooAnimals != null
            ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
            : new List<MyAnimalModel>();

            for (int i = zooAnimals.Count - 1; i >= 0; i--)
            {
                var animal = zooAnimals[i];
                var dbAnimal = _context.Animals.FirstOrDefault(a => a.Id == animal.AnimalId);
                if (dbAnimal == null) continue;

                var species = _context.AnimalSpecies.FirstOrDefault(s => s.Id == dbAnimal.AnimalSpeciesId);
                if (species == null) continue;

                var whichFeed = _context.AnimalFeeds.FirstOrDefault(f => f.AnimalSpeciesId == species.Id);
                if (whichFeed == null) continue;

                var feed = _context.Feed.FirstOrDefault(f => f.Id == whichFeed.FeedId);
                if (feed == null) continue;

                int feedingCost = dbAnimal.FeedingPeriod * feed.Price;

                if (user.Capital >= feedingCost)
                {
                    user.Capital -= feedingCost;
                }
                else
                {
                    zooAnimals.RemoveAt(i);
                }
            }

            user.ZooAnimals = JsonSerializer.Serialize(zooAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();
        }

        private void HandleReproduction(UserModel user)
        {
            var zooAnimals = user.ZooAnimals != null
            ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
            : new List<MyAnimalModel>();

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            Random rnd = new Random();

            for (int i = zooAnimals.Count - 1; i >= 0; i--)
            {
                var actualFemaleAnimal = _context.Animals.FirstOrDefault(a => a.Id == zooAnimals[i].AnimalId);

                if (actualFemaleAnimal.Gender == 0)
                {
                    for (int j = zooAnimals.Count - 1; j >= 0; j--)
                    {
                        var actualMaleAnimal = _context.Animals.FirstOrDefault(a => a.Id == zooAnimals[j].AnimalId);

                        if (actualMaleAnimal.Gender == 1 && actualFemaleAnimal.AnimalSpeciesId == actualMaleAnimal.AnimalSpeciesId)
                        {
                            var babyAnimal = _context.Animals.FirstOrDefault(b => b.Gender == 2 && b.AnimalSpeciesId == actualFemaleAnimal.AnimalSpeciesId);

                            if (zooAnimals[i].CanReproduce == true && rnd.NextDouble() < 0.3)
                            {
                                var myBaby = new MyAnimalModel
                                {
                                    Id = zooAnimals.Concat(warehouseAnimals).Any() ? zooAnimals.Concat(warehouseAnimals).Max(a => a.Id) + 1 : 1,
                                    AnimalId = babyAnimal.Id,
                                    CurrentAge = babyAnimal.AgePeriod,
                                    CanReproduce = false
                                };
                                zooAnimals[i].CanReproduce = false;

                                zooAnimals.Add(myBaby);
                            }
                        }
                    }
                }
                user.ZooAnimals = JsonSerializer.Serialize(zooAnimals);
                _context.Users.Update(user);
                _context.SaveChanges();
            }
        }
    }
}
