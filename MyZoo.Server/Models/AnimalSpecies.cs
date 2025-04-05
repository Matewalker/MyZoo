using System.Text.Json.Serialization;

namespace MyZoo.Server.Models
{
    public class AnimalSpecies
    {
        public int Id { get; set; }
        public string Species { get; set; }
        public ICollection<AnimalContinents> AnimalContinents { get; set; }
        public ICollection<AnimalFeeds> AnimalFeeds { get; set; }
        //JsonSerializer-ben nincs
        [JsonIgnore]
        public ICollection<Animals> Animals { get; set; }
    }
}
