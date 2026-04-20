using LabApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<PatientsController> _logger;

    public PatientsController(AppDbContext context, ILogger<PatientsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _context.Patients.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        _logger.LogInformation(
            "Created patient {PatientId} ({PatientName})",
            patient.Id,
            patient.Name);
        return Ok(patient);
    }
}