using LabApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppointmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _context.Appointments.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Appointment appt)
    {
        appt.Status = "Pending";
        _context.Appointments.Add(appt);
        await _context.SaveChangesAsync();
        return Ok(appt);
    }
}