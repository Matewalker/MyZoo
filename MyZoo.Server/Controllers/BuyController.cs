using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyZoo.Data;
using MyZoo.Server.Models;
using System.Text.Json;

namespace MyZoo.Server.Controllers
{
    [Route("api/buy")]
    [ApiController]
    public class BuyController : Controller
    {
        private readonly ZooContext _context;

        public BuyController(ZooContext context)
        {
            _context = context;
        }

        //Állat vásárlás
        [HttpPost("buy-animal")]
        public JsonResult AnimalBuy([FromBody] int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId != null)
            {
                var user = _context.Users.FirstOrDefault(u => u.Id == userId);

                if (user != null)
                {
                    var animals = _context.Animals.FirstOrDefault(c => c.Id == id);
                    if (animals == null)
                    {
                        return new JsonResult(new { message = "Not found", capital = user.Capital }) { StatusCode = 404 };
                    }

                    if (user.Capital < animals.Value)
                    {
                        return new JsonResult(new { message = "You don't have enough capital!", capital = user.Capital }) { StatusCode = 400 };
                    }

                    user.Capital -= animals.Value;

                    _context.Users.Update(user);
                    AddAnimalToWarehouse(userId.Value, id);

                    return new JsonResult(new { message = $"You have successfully purchased!", capital = user.Capital }) { StatusCode = 200 };
                }
                else
                {
                    return new JsonResult(new { message = "User not found!" }) { StatusCode = 404 };
                }
            }
            else
            {
                return new JsonResult(new { message = "User ID not found!" }) { StatusCode = 401 };
            }
        }

        [HttpPost("add-to-warehouse")]
        public IActionResult AddAnimalToWarehouse(int userId, int animalId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound("User not found!");

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var zooAnimals = user.ZooAnimals != null
               ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
               : new List<MyAnimalModel>();

            var animal = _context.Animals.FirstOrDefault(a => a.Id == animalId);
            if (animal == null) return NotFound("The animal is not found.");

            Random rnd = new Random();

            int newAnimalAge = animal.AgePeriod/2 + rnd.Next(1, animal.AgePeriod/2 - 1);

            var newAnimal = new MyAnimalModel
            {
                Id = zooAnimals.Concat(warehouseAnimals).Any() ? zooAnimals.Concat(warehouseAnimals).Max(a => a.Id) + 1 : 1,
                AnimalId = animalId,
                CurrentAge = newAnimalAge,
                CanReproduce = true
            };

            warehouseAnimals.Add(newAnimal);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            _context.SaveChanges();
            return Ok("The animal added to the warehouse.");
        }

        [HttpPost("remove-from-warehouse")]
        public JsonResult RemoveAnimalFromWarehouse([FromBody] int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return new JsonResult(new { message = "User is not logged in." }) { StatusCode = 401 };


            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 404 };

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var animalToRemove = warehouseAnimals.FirstOrDefault(a => a.Id == id);
            if (animalToRemove == null)
                return new JsonResult(new { message = "The animal is not in the warehouse." }) { StatusCode = 404 };

            var animal = _context.Animals.FirstOrDefault(a => a.Id == animalToRemove.AnimalId);
            if (animal != null)
            {
                //Ha egy evig tud elni akkor megkapjuk a tizedet az ertekenek
                if(animalToRemove.CurrentAge > 11)
                {
                    user.Capital += animal.Value / 10;
                }
            }

            warehouseAnimals.Remove(animalToRemove);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();

            return new JsonResult(new { message = "Animal successfully sold!", newCapital = user.Capital }) { StatusCode = 200 };
        }

        [HttpPost("add-to-zoo")]
        public JsonResult AddAnimalToZoo([FromBody] int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return new JsonResult(new { message = "User is not logged in." }) { StatusCode = 401 };

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 404 };

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var animalToMove = warehouseAnimals.FirstOrDefault(a => a.Id == id);
            if (animalToMove == null)
                return new JsonResult(new { message = "The animal is not in the warehouse." }) { StatusCode = 404 };

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            zooAnimals.Add(animalToMove);
            user.ZooAnimals = JsonSerializer.Serialize(zooAnimals);

            warehouseAnimals.Remove(animalToMove);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();

            return new JsonResult(new { message = "The animal has been successfully added to the zoo!" }) { StatusCode = 200 };
        }

        [HttpPost("remove-from-zoo")]
        public JsonResult RemoveAnimalFromZoo([FromBody] int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return new JsonResult(new { message = "User is not logged in." }) { StatusCode = 401 };

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 404 };

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            var animalToRemove = zooAnimals.FirstOrDefault(a => a.Id == id);
            if (animalToRemove == null)
                return new JsonResult(new { message = "The animal is not in the zoo." }) { StatusCode = 404 };

            warehouseAnimals.Add(animalToRemove);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            zooAnimals.Remove(animalToRemove);
            user.ZooAnimals = JsonSerializer.Serialize(zooAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();

            return new JsonResult(new { message = "Animal add to warehouse!" }) { StatusCode = 200 };
        }
    }
}
