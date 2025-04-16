namespace MyZoo.Server.Models
{
    public class MessageStorage
    {
        public static List<string> Messages { get; set; } = new List<string>();

        public static void AddMessage(string message)
        {
            Messages.Add(message);
        }
    }
}
