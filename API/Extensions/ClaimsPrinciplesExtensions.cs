using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ClaimsPrinciplesExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(value))
            {
                throw new ArgumentException("NameIdentifier claim is missing or empty");
            }

            if (!int.TryParse(value, out int userId))
            {
                throw new ArgumentException($"NameIdentifier claim value '{value}' is not a valid integer");
            }

            return userId;
        }
    }
}