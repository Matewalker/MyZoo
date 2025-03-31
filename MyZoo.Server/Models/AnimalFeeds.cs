namespace MyZoo.Server.Models
{
    public class AnimalFeeds
    {
        public int AnimalSpeciesId { get; set; }
        public AnimalSpecies AnimalSpecies { get; set; }
        public int FeedId { get; set; }
        public Feed Feed { get; set; }
    }
}
