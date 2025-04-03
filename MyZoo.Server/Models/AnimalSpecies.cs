namespace MyZoo.Server.Models
{
    public class AnimalSpecies
    {
        public int Id { get; set; }
        public string Species { get; set; }
        public ICollection<AnimalContinents> AnimalContinents { get; set; }
        public ICollection<AnimalFeeds> AnimalFeeds { get; set; }
    }
}
