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

public partial class MonthStatistics : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
           
        }
    }
    private void YudingMoney()
    {
        //所有预定车票当月的收入
        int month = this.DropDownList1.SelectedIndex + 1;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select sum(Omoney) from OrderTicket where month(ObuyTime)='" + month + "'", con);
        decimal summoney = Convert.ToDecimal(cmd.ExecuteScalar());
        this.Label1.Text = Convert.ToString(summoney);

        con.Close();


    }
    private void Money()
    {
        //所有出售车票当月的收入
          int month = this.DropDownList1.SelectedIndex + 1;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select sum(Smoney) from SealTicket  where month(Stime)='"+month+"'", con);
        decimal summoney = Convert.ToDecimal(cmd.ExecuteScalar());
        this.Label2.Text = Convert.ToString(summoney);


    }

    protected void DropDownList1_SelectedIndexChanged(object sender, EventArgs e)
    {
        Checkidmonth1();
        Checkidmonth2();


        //计算总营业额
        if (Label1.Text != "" || Label2.Text != "")
        {
            decimal str1 = Convert.ToDecimal(this.Label1.Text);
            decimal str2 = Convert.ToDecimal(this.Label2.Text);
            this.Label3.Text = Convert.ToString(str2 + str1);
        }
    }
    private void Checkidmonth1()
    {
        //检索出售的车票表中是否存在所选择月份信息
        int month = this.DropDownList1.SelectedIndex + 1;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from SealTicket where  month(Stime)='" + month + "'", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            Money();
        }

        else
        {

            Response.Write("<script language='javascript'>alert('该月份没有数据');location.href='MonthStatistics.aspx'</script>");
        }

    }

    private void Checkidmonth2()
    {
        int month = this.DropDownList1.SelectedIndex + 1;
        //检索预售的车票表中是否存在所选择月份信息
      
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from OrderTicket where  month(ObuyTime)='" + month + "'", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            YudingMoney();
        }

        else
        {

            Response.Write("<script language='javascript'>alert('该月份没有数据');location.href='MonthStatistics.aspx'</script>");
        }

    }
}
