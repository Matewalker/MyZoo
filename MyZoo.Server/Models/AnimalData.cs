namespace MyZoo.Server.Models
{
    public class AnimalData
    {
        public int Id { get; set; }
        public int Gender { get; set; }
        public string Image { get; set; }
        public int FeedingPeriod { get; set; }
        public int AgePeriod { get; set; }
        public int Value { get; set; }
        public int AttractionRating { get; set; }
        public string Species { get; set; }
        public string Feed { get; set; }
        public List<string> Continents { get; set; }
    }
}
