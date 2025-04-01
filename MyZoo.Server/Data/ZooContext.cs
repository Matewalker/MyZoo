using Microsoft.EntityFrameworkCore;
using System;
using MyZoo.Server.Models;
using Microsoft.Extensions.Configuration;

namespace MyZoo.Data
{
    public class ZooContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public ZooContext(DbContextOptions<ZooContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        public ZooContext(DbContextOptions<ZooContext> options) : base(options) { }
        public DbSet<AnimalSpecies> AnimalSpecies { get; set; }
        public DbSet<Animals> Animals { get; set; }
        public DbSet<Continents> Continents { get; set; }
        public DbSet<Feed> Feed { get; set; }
        public DbSet<AnimalContinents> AnimalContinents { get; set; }
        public DbSet<AnimalFeeds> AnimalFeeds { get; set; }
        public DbSet<UserModel> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Kompozit kulcs beállítása
            modelBuilder.Entity<AnimalContinents>()
                .HasKey(ac => new { ac.AnimalSpeciesId, ac.ContinentId });

            modelBuilder.Entity<AnimalFeeds>()
                .HasKey(af => new { af.AnimalSpeciesId, af.FeedId });
        }
    }
}
