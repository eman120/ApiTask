
using Microsoft.AspNetCore.Identity;

namespace JWT.Data;

public class ApplicationUser:IdentityUser
{
    public string UserRole { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int Age { get; set; }
}
