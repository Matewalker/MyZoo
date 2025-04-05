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

        [HttpGet("get-animals")]
        public IActionResult GetAnimals(string continent = null)
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

                return Ok(animals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Hiba történt az állatok lekérésekor.", error = ex.Message });
            }
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
                        return Json(new { success = false, message = "Nem található", capital = user.Capital });
                    }

                    if (user.Capital < animals.Value)
                    {
                        return Json(new { success = false, message = "Nincs elég tőkéd!", capital = user.Capital });
                    }

                    user.Capital -= animals.Value;

                    _context.Users.Update(user);
                    AddAnimalToWarehouse(userId.Value, id);

                    return Json(new { success = true, message = $"Sikeresen megvetted: {id}", capital = user.Capital });
                }
                else
                {
                    return Json(new { success = false, message = "Felhasználó nem található!" });
                }
            }
            else
            {
                return Json(new { success = false, message = "Felhasználó ID nem található!" });
            }
        }

        [HttpPost("add-to-warehouse")]
        public IActionResult AddAnimalToWarehouse(int userId, int animalId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound("Felhasználó nem található.");

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var zooAnimals = user.ZooAnimals != null
               ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
               : new List<MyAnimalModel>();

            var animal = _context.Animals.FirstOrDefault(a => a.Id == animalId);
            if (animal == null) return NotFound("Az állat nem található.");

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
            return Ok($"Állat (Id: {animalId}) hozzáadva a raktárhoz.");
        }

        [HttpPost("remove-from-warehouse")]
        public JsonResult RemoveAnimalToWarehouse([FromBody] int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Json(new { success = false, message = "Felhasználó nincs bejelentkezve." });
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
            {
                return Json(new { success = false, message = "Felhasználó nem található." });
            }

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var animalToRemove = warehouseAnimals.FirstOrDefault(a => a.Id == id);
            if (animalToRemove == null)
            {
                return Json(new { success = false, message = "Az állat nem található a raktárban." });
            }

            var animal = _context.Animals.FirstOrDefault(a => a.Id == animalToRemove.AnimalId);
            if (animal != null)
            {
                //Ha egy evig tud elni akkor megkapjuk a tizedet
                if(animalToRemove.CurrentAge > 11)
                {
                    user.Capital += animal.Value / 10;
                }
            }

            warehouseAnimals.Remove(animalToRemove);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();

            return Json(new { success = true, message = "Állat sikeresen eladva!", newCapital = user.Capital });
        }

        // Állat hozzáadása az állatkerthez
        [HttpPost("add-to-zoo")]
        public JsonResult AddAnimalToZoo([FromBody] int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Json(new { success = false, message = "Felhasználó nincs bejelentkezve." });
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
            {
                return Json(new { success = false, message = "Felhasználó nem található." });
            }

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var animalToMove = warehouseAnimals.FirstOrDefault(a => a.Id == id);
            if (animalToMove == null)
            {
                return Json(new { success = false, message = "Az állat nem található a raktárban." });
            }

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            zooAnimals.Add(animalToMove);
            user.ZooAnimals = JsonSerializer.Serialize(zooAnimals);

            warehouseAnimals.Remove(animalToMove);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();

            return Json(new { success = true, message = "Az állat sikeresen hozzáadva az állatkerthez!" });
        }

        [HttpPost("remove-from-zoo")]
        public JsonResult RemoveAnimalToZoo([FromBody] int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Json(new { success = false, message = "Felhasználó nincs bejelentkezve." });
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
            {
                return Json(new { success = false, message = "Felhasználó nem található." });
            }

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            var animalToRemove = zooAnimals.FirstOrDefault(a => a.Id == id);
            if (animalToRemove == null)
            {
                return Json(new { success = false, message = "Az állat nem található az állatkertben." });
            }

            warehouseAnimals.Add(animalToRemove);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            zooAnimals.Remove(animalToRemove);
            user.ZooAnimals = JsonSerializer.Serialize(zooAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();

            return Json(new { success = true, message = "Animal add to warehouse!" });
        }
    }
}
