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

public partial class DayStatistics : System.Web.UI.Page
{
  
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            Checkperson1();
            Checkpersonh2();
          
         //计算总营业额
           
                decimal str1 = Convert.ToDecimal(this.Label1.Text);
                decimal str2 = Convert.ToDecimal(this.Label2.Text);
                this.Label3.Text = Convert.ToString(str2 + str1);
           
        }
    }
    private void YudingMoney()
    {
        //所有预定车票当天的收入
        
        
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select sum(Omoney) from OrderTicket where datediff(day,ObuyTime,getdate())=0", con);
    
        decimal summoney = Convert.ToDecimal(cmd.ExecuteScalar());
        this.Label1.Text = Convert.ToString(summoney);


    }
    private void Money()
    {
        //所有出售车票当天的收入

        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select sum(Smoney) from SealTicket  where datediff(day,Stime,getdate())=0", con);
        decimal summoney = Convert.ToDecimal(cmd.ExecuteScalar());
        this.Label2.Text = Convert.ToString(summoney);


    }

    private void Checkperson1()
    {
        //检索当天出售的车票表中是否存
        

        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from SealTicket   where datediff(day,Stime,getdate())=0", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            Money();
        }

    }
    private void Checkpersonh2()
    {

        //检索当天预定的车票表中是否存
      
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from OrderTicket  where datediff(day,ObuyTime,getdate())=0", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            YudingMoney();
        }


    }
}
