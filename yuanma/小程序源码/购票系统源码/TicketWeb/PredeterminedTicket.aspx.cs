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

public partial class PredeterminedTicket : System.Web.UI.Page
{
    public int time;//定义全局变量获取设置的时间
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Linkbuy_Click(object sender, EventArgs e)
    {//以下判断售票时间时间根据设置的时间进行卖票
        Time();
        if (DateTime.Now.Hour > time)
        {
            this.Label1.Text = this.DropDownList1.SelectedItem.Text;
            this.Label2.Text = this.DropDownList2.SelectedItem.Text;
            this.Label3.Text = this.DropDownList3.SelectedItem.Text;
            this.Label4.Text = this.DropDownList2.SelectedValue;
        }
        else
        {

            Response.Write("<script language='javascript'>alert('当前时间不能订票');location.href='PredeterminedTicket.aspx'</script>");

        }
    }
    public void Time()//判断售票时间时间根据设置的时间进行卖票过程
    {
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select SysOrderTime  from System", con);//从数据库中选择设置时间
        time = Convert.ToInt32(cmd.ExecuteScalar());

        con.Close();
       
    }
    protected void LinkButton1_Click(object sender, EventArgs e)
    {
        InsertTicket();//把购票信息添加到数据库中预定表中
        Response.Write("<script language='javascript'>alert('预定成功成功确认打印  ')</script>");
    }
    private void InsertTicket()
    {//把购票信息添加到数据库中预定表中

        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;//对象实例化
        cmd.CommandText = "insert into OrderTicket (OCar,OTicketype,ObuyTime,Omoney,Ousetime,Oadmin)values(@OCar,@OTicketype,@ObuyTime,@Omoney,@Ousetime,@Oadmin)";


        cmd.Parameters.Add("@OCar", SqlDbType.VarChar);
        cmd.Parameters.Add("@OTicketype", SqlDbType.VarChar);
        cmd.Parameters.Add("@ObuyTime", SqlDbType.DateTime);
        cmd.Parameters.Add("@Omoney", SqlDbType.Money);
        cmd.Parameters.Add("@Ousetime", SqlDbType.DateTime);
        cmd.Parameters.Add("@Oadmin", SqlDbType.VarChar);

        cmd.Parameters["@OCar"].Value = this.Label1.Text;
        cmd.Parameters["@OTicketype"].Value = this.Label2.Text;
        cmd.Parameters["@ObuyTime"].Value = DateTime.Now;
        cmd.Parameters["@Omoney"].Value =Convert.ToDecimal(Label4.Text);
        cmd.Parameters["@Ousetime"].Value = Convert.ToDateTime(Label3.Text);
        cmd.Parameters["@Oadmin"].Value = Session["Aname"].ToString();
        cmd.ExecuteNonQuery();
        con.Close();




    }
}
