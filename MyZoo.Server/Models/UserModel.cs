using System.ComponentModel.DataAnnotations;

namespace MyZoo.Server.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public int Capital { get; set; }
        public string? WarehouseAnimals { get; set; }
        public string? ZooAnimals { get; set; }
        public int TicketPrices { get; set; }
        public DateTime CurrentDate { get; set; } = new DateTime(2025, 1, 1);
        public int Visitors { get; set; }
    }
}
