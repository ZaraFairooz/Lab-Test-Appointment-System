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
    private readonly ILogger<AppointmentsController> _logger;

    public AppointmentsController(
        AppDbContext context,
        ILogger<AppointmentsController> logger)
    {
        _context = context;
        _logger = logger;
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
        _logger.LogInformation(
            "Created appointment {AppointmentId} for patient {PatientId}, test {TestType}",
            appt.Id,
            appt.PatientId,
            appt.TestType);
        return Ok(appt);
    }
}