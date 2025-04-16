using System.ComponentModel.DataAnnotations;

namespace MyZoo.Server.Models
{
    public class Animals
    {
        public int Id { get; set; }
        public int Gender { get; set; }
        public string Image { get; set; }
        [Required]
        public int FeedingPeriod { get; set; }
        [Required]
        public int AgePeriod { get; set; }
        [Required]
        public int Value { get; set; }
        [Required]
        public int AttractionRating { get; set; }
        public int AnimalSpeciesId { get; set; }
        public AnimalSpecies AnimalSpecies { get; set; }
    }
}
