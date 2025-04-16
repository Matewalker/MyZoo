using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MyZoo.Server.Models
{
    public class Feed
    {
        public int Id { get; set; }
        [Required]
        public string FeedName { get; set; }
        [Required]
        public string FeedImage { get; set; }
        [Required]
        public int Price { get; set; }
        [JsonIgnore]
        public ICollection<AnimalFeeds> AnimalFeeds { get; set; }
    }
}
