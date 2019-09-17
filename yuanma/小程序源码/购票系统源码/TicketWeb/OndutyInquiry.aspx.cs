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

public partial class OndutyInquiry : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {//还要加入session
        if (!IsPostBack)
        {
            Checkperson1();
            Checkpersonh2();
        }
    }
    private void YudingMoney()
    {
        string person = Session["Aname"].ToString();
        //所有当班人的预定车票收入

        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select sum(Omoney) from OrderTicket where Oadmin='"+person+"' ", con);
      decimal summoney = Convert.ToDecimal(cmd.ExecuteScalar());
        this.Label1.Text =Convert.ToString(summoney);

    
    }
    private void Money()
    {
        string person = Session["Aname"].ToString();
        //所有当班人的出售车票收入

        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select sum(Smoney) from SealTicket where Sadmin='"+person+"'", con);
        decimal summoney = Convert.ToDecimal(cmd.ExecuteScalar());
        this.Label2.Text = Convert.ToString(summoney);


    }
    private void Checkperson1()
    {
        //检索当班人的销售收入是否存在
        string person = Session["Aname"].ToString();
       
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from SealTicket   where Sadmin='"+person+"'", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            Money();
        }

    }
    private void Checkpersonh2()
    {

        //检索当班人的订票收入是否存在
        string person = Session["Aname"].ToString();
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from OrderTicket  where Oadmin='" + person + "' ", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            YudingMoney();
        }


    }


}
