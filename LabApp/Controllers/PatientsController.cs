[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PatientsController(AppDbContext context)
    {
        _context = context;
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
        return Ok(patient);
    }
}