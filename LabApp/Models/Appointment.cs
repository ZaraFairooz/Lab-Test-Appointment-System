namespace LabApp.Models;

public class Appointment
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string TestType { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; }
}