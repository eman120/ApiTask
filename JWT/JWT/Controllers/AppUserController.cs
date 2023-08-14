using JWT.Data;
using JWT.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Drawing.Imaging;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using System.Drawing;
using System.Drawing.Imaging;
using Gma.QrCodeNet.Encoding;

namespace JWT.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AppUserController : ControllerBase
{
    #region Injection
    private readonly IConfiguration _configuration;
    private readonly UserManager<ApplicationUser> _userManager;

    public AppUserController(IConfiguration configuration , UserManager<ApplicationUser> userManager)
    {
       _configuration = configuration;
        _userManager = userManager;
    }
    #endregion


    #region Admin Register
    [HttpPost]
    [Route("AdminRegisteration")]
    public async Task<ActionResult> RegisterAdmin(RegisterDto RegisterDto)
    {
        var userExists = await _userManager.FindByEmailAsync(RegisterDto.Email);
        if (userExists != null)
        {
            return BadRequest("User already exists");
        }

        var UserToAdd = new ApplicationUser
        {
            UserName = RegisterDto.UserName,
            Email = RegisterDto.Email,
            UserRole = RegisterDto.UserRole
        };

        var Result = await _userManager.CreateAsync(UserToAdd, RegisterDto.Password);
        if (!Result.Succeeded)
        {
            return BadRequest(Result.Errors);
        }
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier , UserToAdd.Id),
            new Claim(ClaimTypes.Role, "Admin")
        };

        await _userManager.AddClaimsAsync(UserToAdd, claims);
        return NoContent();


    }
    #endregion

    #region User Register
    [HttpPost]
    [Route("User Registeration")]
     public async Task<ActionResult>Register(RegisterDto RegisterDto)
    {
        var UserToAdd = new ApplicationUser
        {
            UserName = RegisterDto.UserName,
            Email = RegisterDto.Email,
            UserRole = RegisterDto.UserRole,
            MobileNumber = RegisterDto.MobileNumber,
            Address = RegisterDto.Address,
            Age = RegisterDto.Age
        };

        var Result = await _userManager.CreateAsync(UserToAdd, RegisterDto.Password);
        if (!Result.Succeeded)
        {
            return BadRequest(Result.Errors);
        }
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier , UserToAdd.Id),
            new Claim(ClaimTypes.Role , "User")
        };

        await _userManager.AddClaimsAsync(UserToAdd, claims);

        // Generate QR code and return response
        byte[] qrCodeBytes = GenerateQRCode($"Mobile: {RegisterDto.MobileNumber}, Address: {RegisterDto.Address}");
        return File(qrCodeBytes, "image/png", "qrcode.png");
    }
    #endregion 

    private byte[] GenerateQRCode(string text)
    {
        QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.M);
        QrCode qrCode = qrEncoder.Encode(text);

        int moduleSize = 5; // Adjust the module size as needed
        int quietZone = 4; // Adjust the quiet zone as needed

        int width = qrCode.Matrix.Width * moduleSize + 2 * quietZone * moduleSize;
        int height = qrCode.Matrix.Height * moduleSize + 2 * quietZone * moduleSize;

        Bitmap qrCodeImage = new Bitmap(width, height);

        using (Graphics graphics = Graphics.FromImage(qrCodeImage))
        {
            graphics.Clear(Color.White);

            Brush blackBrush = Brushes.Black;

            for (int x = 0; x < qrCode.Matrix.Width; x++)
            {
                for (int y = 0; y < qrCode.Matrix.Height; y++)
                {
                    if (qrCode.Matrix[x, y])
                    {
                        int left = quietZone + x * moduleSize;
                        int top = quietZone + y * moduleSize;
                        graphics.FillRectangle(blackBrush, left, top, moduleSize, moduleSize);
                    }
                }
            }
        }

        using (MemoryStream memoryStream = new MemoryStream())
        {
            qrCodeImage.Save(memoryStream, ImageFormat.Png);
            return memoryStream.ToArray();
        }
    }

    #region Login

    [HttpPost]
    [Route("Login")]
    public async Task<ActionResult<TokenDto>> Login_Clean(LogInDto credentials)
    {
        var user = await _userManager.FindByNameAsync(credentials.UserName);
        if (user == null)
        {
            return NotFound();
        }

        var isAuthenitcated = await _userManager.CheckPasswordAsync(user, credentials.Password);
        if (!isAuthenitcated)
        {
            return Unauthorized();
        }

        var claimsList = await _userManager.GetClaimsAsync(user);

        var secretKeyString = _configuration.GetValue<string>("SecretKey") ?? string.Empty;
        var secretKeyInBytes = Encoding.ASCII.GetBytes(secretKeyString);
        var secretKey = new SymmetricSecurityKey(secretKeyInBytes);

        //Combination SecretKey, HashingAlgorithm
        var siginingCreedentials = new SigningCredentials(secretKey,
            SecurityAlgorithms.HmacSha256Signature);

        var expiry = DateTime.Now.AddDays(1);

        var token = new JwtSecurityToken(
            claims: claimsList,
            expires: expiry,
            signingCredentials: siginingCreedentials);

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenString = tokenHandler.WriteToken(token);

        return new TokenDto(tokenString, expiry);
    }

    #endregion 


}
