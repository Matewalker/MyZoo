namespace MyZoo.Server.Models
{
    public class Animals
    {
        public int Id { get; set; }
        public int Gender { get; set; }
        public string Image { get; set; }
        public int FeedingPeriod { get; set; }
        public int AgePeriod { get; set; }
        public int Value { get; set; }
        public int AttractionRating { get; set; }
        public int AnimalSpeciesId { get; set; }
        public AnimalSpecies AnimalSpecies { get; set; }
    }
}
