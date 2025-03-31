namespace MyZoo.Server.Models
{
    public class Feed
    {
        public int Id { get; set; }
        public string FeedName { get; set; }
        public string FeedImage { get; set; }
        public int Price { get; set; }
        public ICollection<AnimalFeeds> AnimalFeeds { get; set; }
    }
}
