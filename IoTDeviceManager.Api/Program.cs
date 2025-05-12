using IoTDeviceManagerApi.Data;
using IoTDeviceManagerApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

// Configure database context
builder.Services.AddDbContext<IoTDeviceManagerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Add memory caching
builder.Services.AddMemoryCache();

var app = builder.Build();

// Use CORS
app.UseCors("AllowAll"); // Ensure this is called before app.UseRouting()

// Use Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Health check endpoint
app.MapGet("/v1/health", () => Results.Ok(new { Status = "ok" }));

// Device endpoints
app.MapPost("/v1/devices", async (IoTDeviceManagerContext db, DeviceInput input) =>
{
   if (string.IsNullOrEmpty(input.Name) || input.IsNew == null)
        return Results.BadRequest(new { Error = "Name and isNew are required" });


    var device = new Device
    {
        Id = string.IsNullOrEmpty(input.Id) ? DateTime.Now.Ticks.ToString() : input.Id,
        Name = input.Name,
        IsNew = input.IsNew,
        Synced = true,
        CreatedAt = DateTime.UtcNow,
    };

    db.Devices.Add(device);
    await db.SaveChangesAsync();
    return Results.Created($"/v1/devices/{device.Id}", device);
});

app.MapGet("/v1/devices", async (IoTDeviceManagerContext db) =>
{
    var devices = await db.Devices.ToListAsync();
    return Results.Ok(devices);
});

app.MapDelete("/v1/devices/{id}", async (IoTDeviceManagerContext db, string id) =>
{
    var device = await db.Devices.FindAsync(id);
    if (device == null)
        return Results.NotFound(new { Error = "Device not found" });

    db.Devices.Remove(device);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Device names endpoints
app.MapPost("/v1/deviceNames", async (IoTDeviceManagerContext db, DeviceNameInput input) =>
{
    if (string.IsNullOrEmpty(input.Name))
        return Results.BadRequest(new { Error = "Name is required" });

    if (await db.DeviceNames.AnyAsync(dn => dn.Name == input.Name))
        return Results.BadRequest(new { Error = "Name already exists" });

    var deviceName = new DeviceName { Name = input.Name };
    db.DeviceNames.Add(deviceName);
    await db.SaveChangesAsync();
    return Results.Created("/v1/deviceNames", deviceName);
});

app.MapGet("/v1/deviceNames", async (IoTDeviceManagerContext db) =>
{
    var names = await db.DeviceNames.Select(dn => dn.Name).ToListAsync();
    return Results.Ok(names);
});

app.Run();

// Input models for validation
public record DeviceInput(
    string? Id,
    [Required] string Name,
    [Required] string IsNew,
    bool synced
);

public record DeviceNameInput(
    [Required] string Name
);