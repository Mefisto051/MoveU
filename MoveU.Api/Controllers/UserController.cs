using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveU.Application.Interfaces;

namespace MoveU.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            var id = User.FindFirst("id")?.Value;
            return int.Parse(id);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var profile = await _service.GetUserProfileAsync(userId);
            return Ok(profile);
        }

        // ✅ NUEVO ENDPOINT PARA ACTUALIZAR PERFIL
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserDto dto)
        {
            var userId = GetUserId();
            var updatedProfile = await _service.UpdateUserProfileAsync(userId, dto);
            return Ok(updatedProfile);
        }
    }
}
