using Microsoft.AspNetCore.Mvc;
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
        public JsonResult GetUserData(string username)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 404 };
            }

            return new JsonResult(new { currentDate = user.CurrentDate.ToString("yyyy-MMM"), capital = user.Capital, visitors = user.Visitors })
            { StatusCode = 200 };
        }

        [HttpPost("message")]
        public IActionResult MessageGenerate([FromBody] string message)
        {
            if (!string.IsNullOrWhiteSpace(message))
            {
                MessageStorage.AddMessage(message);
            }

            return Ok();
        }

        [HttpGet("get-messages")]
        public IActionResult GetMessages()
        {
            return Ok(new { messages = MessageStorage.Messages.ToList() });
        }

        [HttpPost("next-turn")]
        public JsonResult NextTurn()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 401 };

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 404 };

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var animalIds = zooAnimals.Select(a => a.AnimalId).ToList();
            var animals = _context.Animals.Where(a => animalIds.Contains(a.Id)).ToList();

            UpdateAnimalAges(warehouseAnimals);
            UpdateAnimalAges(zooAnimals);

            user.ZooAnimals = JsonSerializer.Serialize(zooAnimals);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);
            _context.Users.Update(user);
            _context.SaveChanges();

            int totalAttraction = animals.Sum(a => a.AttractionRating);
            user.Visitors = CalculateVisitors(totalAttraction, zooAnimals.Count);

            user.Capital += user.Visitors * user.TicketPrices;

            ProcessFeedingCosts(user);

            HandleReproduction(user);

            user.CurrentDate = user.CurrentDate.AddMonths(1);
            _context.Users.Update(user);
            _context.SaveChanges();

            return new JsonResult(new { newDate = user.CurrentDate.ToString("yyyy-MMM"), newCapital = user.Capital, newVisitors = user.Visitors,
            newZooAnimals = zooAnimals}) { StatusCode = 200};
        }

        private void UpdateAnimalAges(List<MyAnimalModel> animals)
        {
            for (int i = animals.Count - 1; i >= 0; i--)
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

                if (animal.CurrentAge == 0 && dbAnimal.Gender == 2)
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
                    string adultAnimalMessage = "The little " + species.Species + " grew up.";
                    MessageGenerate(adultAnimalMessage);

                    animals.RemoveAt(i);
                    animals.Add(myAdultAnimal);
                }
                else if (animal.CurrentAge == 0 && dbAnimal.Gender != 2)
                {
                    if(dbAnimal.Gender == 1)
                    {
                        string deadAnimalMessage = "The " + species.Species + " died, because he was too old.";
                        MessageGenerate(deadAnimalMessage);
                    }

                    if (dbAnimal.Gender == 0)
                    {
                        string deadAnimalMessage = "The " + species.Species + " died, because she was too old.";
                        MessageGenerate(deadAnimalMessage);
                    }
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
                >= 10 and < 25 => rnd.Next(1, 5),
                >= 25 and < 75 => rnd.Next(2, 6),
                _ => rnd.Next(2, 7),
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
                    if (dbAnimal.Gender == 1)
                    {
                        string deadAnimalMessage = "The " + species.Species + " died, because it didn't get feed.";
                        MessageGenerate(deadAnimalMessage);
                    }

                    if (dbAnimal.Gender == 0)
                    {
                        string deadAnimalMessage = "The " + species.Species + " died, because it didn't get feed.";
                        MessageGenerate(deadAnimalMessage);
                    }

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

                                var species = _context.AnimalSpecies.FirstOrDefault(s => s.Id == actualFemaleAnimal.AnimalSpeciesId);

                                string babyMessage = "Congratulations on the birth of a " + species.Species + " baby.";
                                MessageGenerate(babyMessage);

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

        [HttpPost("reset-game")]
        public JsonResult ResetGame()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 401 };

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 404 };

            user.Capital = 5000;
            user.WarehouseAnimals = JsonSerializer.Serialize(new List<MyAnimalModel>());
            user.ZooAnimals = JsonSerializer.Serialize(new List<MyAnimalModel>());
            user.TicketPrices = 0;
            user.Visitors = 0;
            user.CurrentDate = new DateTime(2025, 1, 1);

            _context.Users.Update(user);
            _context.SaveChanges();

            return new JsonResult(new { message = "Game successfully reset.", newUserdata = user }) { StatusCode = 200 };
        }
    }
}
