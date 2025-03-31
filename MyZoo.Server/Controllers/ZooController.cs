using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyZoo.Data;
using MyZoo.Server.Models;
using System.Text.Json;

namespace MyZoo.Server.Controllers
{
    public class ZooController : Controller
    {
        private readonly ZooContext _context;

        public ZooController(ZooContext context)
        {
            _context = context;
        }

        public IActionResult GetAnimals()
        {
            if (_context == null)
            {
                return Content("Context is null!");
            }

            var animals = _context.Animals.Include(a => a.AnimalSpecies).ToList();
            foreach (var animal in animals)
            {
                Console.WriteLine($"Animal ID: {animal.Id}, Species: {animal.AnimalSpecies?.Species ?? "N/A"}");
            }

            return View();
        }
        public IActionResult BuyAnimals()
        {
            var animals = _context.Animals.Include(a => a.AnimalSpecies).Where(a => a.Gender != 2).ToList();
            return View(animals);
        }

        [HttpGet]
        public IActionResult AnimalCollection()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return RedirectToAction("Login"); // ha nincs bejelentkezve a felhasználó

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return NotFound("Felhasználó nem található.");

            // Felhasználó állatainak lekérdezése a JSON-ból
            var warehouseAnimals = user.WarehouseAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.WarehouseAnimals)
                : new List<MyAnimalModel>();

            // Az AnimalId-k alapján lekérdezzük az állatok adatait az adatbázisból
            var animalIds = warehouseAnimals.Select(a => a.AnimalId).ToList();
            var animals = _context.Animals.Where(a => animalIds.Contains(a.Id)).ToList();

            var combinedAnimals = warehouseAnimals
            .Join(animals,
              wa => wa.AnimalId,
              a => a.Id,
              (wa, a) => new
              {
                  WarehouseAnimalId = wa.Id, // raktár azonosító
                  AnimalId = a.Id,
                  a.Image,
                  a.Gender,
                  a.Value,
                  AnimalSpecies = _context.AnimalSpecies.FirstOrDefault(s => s.Id == a.AnimalSpeciesId)
              }).ToList();


            return View(combinedAnimals);
        }

        public IActionResult ZooCollection()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return RedirectToAction("Login"); // ha nincs bejelentkezve a felhasználó

            var user = _context.Users.FirstOrDefault(u => u.Id == userId.Value);
            if (user == null)
                return NotFound("Felhasználó nem található.");

            var zooAnimals = user.ZooAnimals != null
                ? JsonSerializer.Deserialize<List<MyAnimalModel>>(user.ZooAnimals)
                : new List<MyAnimalModel>();

            var animalIds = zooAnimals.Select(a => a.AnimalId).ToList();
            var animals = _context.Animals
                .Where(a => animalIds.Contains(a.Id))
                .ToList();

            ViewBag.TicketPrice = user.TicketPrices;

            return View(animals);
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

            return RedirectToAction("ZooCollection");
        }
    }
}
