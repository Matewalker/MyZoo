using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MyZoo.Server.Models
{
    public class AnimalSpecies
    {
        public int Id { get; set; }
        [Required]
        public string Species { get; set; }
        public ICollection<AnimalContinents> AnimalContinents { get; set; }
        //JsonSerializer-ben nincs
        [JsonIgnore]
        public ICollection<AnimalFeeds> AnimalFeeds { get; set; }
        [JsonIgnore]
        public ICollection<Animals> Animals { get; set; }
    }
}
