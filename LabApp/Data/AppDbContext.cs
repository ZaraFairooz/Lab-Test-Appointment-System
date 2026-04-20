using Microsoft.EntityFrameworkCore;
using LabApp.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Patient> Patients { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Result> Results { get; set; }
    public DbSet<User> Users { get; set; }
}