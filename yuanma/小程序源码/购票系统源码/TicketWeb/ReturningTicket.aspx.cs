using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;


public partial class ReturningTicket : System.Web.UI.Page
{
    public int  time;
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void DropDownList1_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.Label1.Text = "你的车票类型是：" + this.DropDownList1.SelectedItem.Text;
      
    }
    private void LookTicket1()
    {//预定车票查询
       
       

        int id = Convert.ToInt32(this.TextBox1.Text);
      
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select  * from OrderTicket where Oid='"+id+"'", con);
          cmd.Parameters.Add("@Oid", SqlDbType.Int);
        cmd.Parameters["@Oid"].Value = id;
        SqlDataReader sdr = cmd.ExecuteReader();
        if(sdr.Read())
        {
            this.Label2.Text = sdr["Omoney"].ToString();
            this.Label3.Text = sdr["OTicketype"].ToString();
            Label4.Text = sdr["OCar"].ToString();
            Label5.Text = sdr["Ousetime"].ToString();
            txtyudingtime.Text = sdr["ObuyTime"].ToString();
        
        }
        con.Close();
    
    
    }
    private void LookTicket2()
    {//非预定车票查询
        

            int id = Convert.ToInt32(this.TextBox1.Text);
            SqlConnection con = db.ceratcon();
            con.Open();
            SqlCommand cmd = new SqlCommand("select  * from SealTicket where Sid='" + id + "'", con);
            cmd.Parameters.Add("@Sid", SqlDbType.Int);
            cmd.Parameters["@Sid"].Value = id;
            SqlDataReader sdr = cmd.ExecuteReader();
            if (sdr.Read())
            {
                this.Label2.Text = sdr["Smoney"].ToString();
                this.Label3.Text = sdr["SticketType"].ToString();
                Label4.Text = sdr["SCar"].ToString();
                Label5.Text = sdr["Stime"].ToString();


            }
            con.Close();

       
    }
    private void Checkid2()
    {
        //检索输入的车票号码是否在预定的数据库中存在
        int id = Convert.ToInt32(this.TextBox1.Text);
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from OrderTicket where Oid='" + id + "'", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            Session["id"] = sdr["Oid"].ToString();//管理员名称保存到session


          
        }

        else
        {

            Response.Write("<script language='javascript'>alert('该车票不存在');location.href='ReturningTicket.aspx'</script>");
        }
    
    }
    private void Checkid1()
    {
        //检索输入的车票号码是否在非预定的数据库中存在
        int id = Convert.ToInt32(this.TextBox1.Text);
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from SealTicket where Sid='" + id + "'", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            Session["id"] = sdr["Sid"].ToString();//管理员名称保存到session



        }

        else
        {

            Response.Write("<script language='javascript'>alert('该车票不存在');location.href='ReturningTicket.aspx'</script>");
        }

    }

    protected void LinkButton1_Click(object sender, EventArgs e)
    {//查询车票
        Time();//判断当前时间是否可以退票
        if (DateTime.Now.Hour > time)
        {
            if (this.DropDownList1.SelectedItem.Text == "非预定的票")
            {
                if (this.TextBox1.Text != "")
                {
                    Checkid1();
                    LookTicket2();


                }
                else
                {
                    Response.Write("<script language='javascript'>alert('请输入车票号码！')</script>");

                }
            }
            else if (this.DropDownList1.SelectedItem.Text == "预定的票")
            {
                if (this.TextBox1.Text != "")
                {
                    Checkid2();
                    LookTicket1();

                }
                else
                {
                    Response.Write("<script language='javascript'>alert('请输入车票号码！')</script>");

                }


            }
        }
        else
        {
            Response.Write("<script language='javascript'>alert('当前时间不能退票');location.href='ReturningTicket.aspx'</script>");
        
        }
    }
    protected void Linktuipiao_Click(object sender, EventArgs e)
    {//退票按钮单击事件
        if (this.DropDownList1.SelectedItem.Text == "非预定的票")
        {
            DeleteTicker2();
        }
        else if (this.DropDownList1.SelectedItem.Text == "预定的票")
        {
            DeleteTicker1();
        
        }
    }
    public void Time()//判断退票时间根据设置的时间进行卖票过程
    {
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select SystuipiaoTime  from System", con);//从数据库中选择设置时间
        time = Convert.ToInt32(cmd.ExecuteScalar());

        con.Close();

    }
    private void DeleteTicker1()
    {
        //删除预定的票
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand(" delete OrderTicket    where Oid=@Oid", con);
        cmd.Parameters.Add("@Oid", SqlDbType.Int);
        cmd.Parameters["@Oid"].Value = Convert.ToInt32(this.TextBox1.Text);
        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('退票成功');location.href='ReturningTicket.aspx'</script>");
      
    
    }
    private void DeleteTicker2()
    {
        //删除预定的票
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand(" delete SealTicket    where Sid=@Sid", con);
        cmd.Parameters.Add("@Sid", SqlDbType.Int);
        cmd.Parameters["@Sid"].Value = Convert.ToInt32(this.TextBox1.Text);
        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('退票成功');location.href='ReturningTicket.aspx'</script>");


    }
}
