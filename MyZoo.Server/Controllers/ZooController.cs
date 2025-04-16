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
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 401 };

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return new JsonResult(new { message = "User not found!" }) { StatusCode = 404 };

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
              }).ToList().OrderBy(a => a.AnimalSpecies?.Species);

            return new JsonResult(new { animals = combinedAnimals }) { StatusCode = 200 };
        }

        [HttpGet("get-zoo-animals")]
        public JsonResult GetZooAnimals()
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
              }).ToList().OrderBy(a => a.AnimalSpecies?.Species);

            return new JsonResult(new { animals = combinedAnimals, ticketPrice = user.TicketPrices }) { StatusCode = 200 };
        }

        [HttpPost("set-ticket-prices")]
        public JsonResult SetTicketPrices([FromBody] int ticketPrice)
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

            int animalCount = zooAnimals.Count;

            if (animalCount < 3 && ticketPrice > 4)
            {
                user.TicketPrices = 4;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 4", newPrice = 4 }) { StatusCode = 200 };
            }
            else if (animalCount < 10 && ticketPrice > 7)
            {
                user.TicketPrices = 7;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 7", newPrice = 7 }) { StatusCode = 200 };
            }
            else if (animalCount < 25 && ticketPrice > 10)
            {
                user.TicketPrices = 10;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 10", newPrice = 10 }) { StatusCode = 200 };
            }
            else if (animalCount < 40 && ticketPrice > 13)
            {
                user.TicketPrices = 13;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 13", newPrice = 13 }) { StatusCode = 200 };
            }
            else if (animalCount < 60 && ticketPrice > 16)
            {
                user.TicketPrices = 16;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 16", newPrice = 16 }) { StatusCode = 200 };
            }
            else if (animalCount < 80 && ticketPrice > 19)
            {
                user.TicketPrices = 19;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 19", newPrice = 19 }) { StatusCode = 200 };
            }
            else if (animalCount < 110 && ticketPrice > 22)
            {
                user.TicketPrices = 22;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 22", newPrice = 22 }) { StatusCode = 200 };
            }
            else if (animalCount < 140 && ticketPrice > 25)
            {
                user.TicketPrices = 25;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 25", newPrice = 25 }) { StatusCode = 200 };
            }
            else if (animalCount < 180 && ticketPrice > 28)
            {
                user.TicketPrices = 28;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 28", newPrice = 28 }) { StatusCode = 200 };
            }
            else if (ticketPrice > 30)
            {
                user.TicketPrices = 30;

                _context.Users.Update(user);
                _context.SaveChanges();

                return new JsonResult(new { message = "Maximum ticket price: 30", newPrice = 30 }) { StatusCode = 200 };
            }

            user.TicketPrices = ticketPrice;

            _context.Users.Update(user);
            _context.SaveChanges();

            return new JsonResult(new { message = "Ticket price set successfully.", newPrice = ticketPrice }) { StatusCode = 200 };
        }
    }
}
