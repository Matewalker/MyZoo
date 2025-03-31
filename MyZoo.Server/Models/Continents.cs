namespace MyZoo.Server.Models
{
    public class Continents
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<AnimalContinents> AnimalContinents { get; set; }
    }
}
