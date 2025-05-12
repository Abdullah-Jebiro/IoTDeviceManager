using IoTDeviceManagerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace IoTDeviceManagerApi.Data;

public class IoTDeviceManagerContext : DbContext
{
    public IoTDeviceManagerContext(DbContextOptions<IoTDeviceManagerContext> options)
        : base(options) { }

    public DbSet<Device> Devices { get; set; }
    public DbSet<DeviceName> DeviceNames { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Device>().HasKey(d => d.Id);
        modelBuilder.Entity<DeviceName>().HasKey(dn => dn.Name);

   
        modelBuilder.Entity<Device>()
            .Property(d => d.Name)
            .HasMaxLength(100)
            .IsRequired();

        modelBuilder.Entity<DeviceName>()
            .Property(dn => dn.Name)
            .HasMaxLength(100)
            .IsRequired();

    }
}