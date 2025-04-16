using System.ComponentModel.DataAnnotations;

namespace MyZoo.Server.Models
{
    public class Continents
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public ICollection<AnimalContinents> AnimalContinents { get; set; }
    }
}
