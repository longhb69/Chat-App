namespace ChatApplication.Models;

public class Friendships
{
    public String user_id_1 { get; set; }
    public String user_id_2 { get; set; }
    public String? status { get; set; }

    public User User1 { get; set; }
}
