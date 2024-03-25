using System.ComponentModel.DataAnnotations;

namespace ChatApplication.ViewModels;

public class RegisterVM
{
    [Required(ErrorMessage = "User Name is required")]
    public string? Username { get; set; }
    [EmailAddress]
    [Required(ErrorMessage = "Email is required")]
    public string? Email { get; set; }
    [DataType(DataType.Password)]
    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }

    [Compare("Password", ErrorMessage="Passwords don't match")]
    public string? ConfirmPassword { get; set;}
}
