namespace MyZoo.Server.Models
{
    public class AnimalContinents
    {
        public int AnimalSpeciesId { get; set; }
        public AnimalSpecies AnimalSpecies { get; set; }
        public int ContinentId { get; set; }
        public Continents Continent { get; set; }
    }
}
