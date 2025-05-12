namespace IoTDeviceManagerApi.Models;

public class Device
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string IsNew { get; set; } = null!;
    public bool Synced { get; set; } = true;
    public DateTime CreatedAt { get; set; }
}



public class DeviceName
{
    public string Name { get; set; } = string.Empty;
}