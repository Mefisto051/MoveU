using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveU.Application.DTOs;
using MoveU.Application.Interfaces;

namespace MoveU.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ActivityPlanController : ControllerBase
    {
        private readonly IActivityPlanService _service;

        public ActivityPlanController(IActivityPlanService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            var id = User.FindFirst("id")?.Value;
            return int.Parse(id);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ActivityPlanDto dto)
        {
            int userId = GetUserId();
            var result = await _service.CreatePlanAsync(userId, dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            int userId = GetUserId();
            var result = await _service.GetPlansByUserAsync(userId);
            return Ok(result);
        }
    }
}
