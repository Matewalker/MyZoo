namespace MyZoo.Server.Models
{
    public class FeedViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public List<string> AnimalSpecies { get; set; }
        public int Price { get; set; }
    }
}
