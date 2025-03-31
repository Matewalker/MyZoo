using Microsoft.AspNetCore.Mvc;
using MyZoo.Data;
using MyZoo.Server.Models;
using System.Text.Json;

namespace MyZoo.Server.Controllers
{
    public class BuyController : Controller
    {
        private readonly ZooContext _context;

        public BuyController(ZooContext context)
        {
            _context = context;
        }
        //Állat vásárlás
        [HttpPost]
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

            var newAnimal = new MyAnimalModel
            {
                Id = zooAnimals.Concat(warehouseAnimals).Any() ? zooAnimals.Concat(warehouseAnimals).Max(a => a.Id) + 1 : 1,
                AnimalId = animalId,
                CurrentAge = animal.AgePeriod,
                CanReproduce = true
            };

            warehouseAnimals.Add(newAnimal);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            _context.SaveChanges();
            return Ok($"Állat (Id: {animalId}) hozzáadva a raktárhoz.");
        }

        [HttpPost("remove-from-warehouse")]
        public IActionResult RemoveAnimalToWarehouse([FromBody] int warehouseAnimalId)
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

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var animalToRemove = warehouseAnimals.FirstOrDefault(a => a.Id == warehouseAnimalId);
            if (animalToRemove == null)
            {
                return NotFound("Az állat nem található a raktárban.");
            }

            var animal = _context.Animals.FirstOrDefault(a => a.Id == animalToRemove.AnimalId);
            if (animal != null)
            {
                user.Capital += animal.Value / 10;
            }

            warehouseAnimals.Remove(animalToRemove);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Állat sikeresen eltávolítva a raktárból." });
        }

        // Állat hozzáadása az állatkerthez
        [HttpPost("add-to-zoo")]
        public IActionResult AddAnimalToZoo([FromBody] int warehouseAnimalId)
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

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var animalToMove = warehouseAnimals.FirstOrDefault(a => a.Id == warehouseAnimalId);
            if (animalToMove == null)
            {
                return NotFound("Az állat nem található a raktárban.");
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

            return Ok(new { success = true, message = "Az állat sikeresen hozzáadva az állatkerthez!" });
        }

        [HttpPost("remove-from-zoo")]
        public IActionResult RemoveAnimalToZoo([FromBody] int warehouseAnimalId)
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

            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            var animalToRemove = zooAnimals.FirstOrDefault(a => a.Id == warehouseAnimalId);
            if (animalToRemove == null)
            {
                return NotFound("Az állat nem található a raktárban.");
            }

            var animal = _context.Animals.FirstOrDefault(a => a.Id == animalToRemove.AnimalId);
            if (animal != null)
            {
                user.Capital += animal.Value / 10;
            }

            warehouseAnimals.Remove(animalToRemove);
            user.WarehouseAnimals = JsonSerializer.Serialize(warehouseAnimals);

            _context.Users.Update(user);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Állat sikeresen eltávolítva a raktárból." });
        }
    }
}
