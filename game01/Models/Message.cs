namespace game01.Models
{
    public class Message
    {
        Unit? Unit { get; set; }

        List<Unit>? Red { get; set; }

        List<Unit>? Blue { get; set; }

        Ball Ball { get; set; }
    }
}
