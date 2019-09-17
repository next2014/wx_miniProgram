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

public partial class login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btclier_Click(object sender, EventArgs e)
    {
        this.txtname.Text = "";
        this.txtpwd.Text = "";
    }
    protected void btnlogin_Click(object sender, EventArgs e)
    {
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select * from Admin where  Aname='" + this.txtname.Text + "'and  Apwd='" + this.txtpwd.Text + "'", con);
        SqlDataReader sdr = cmd.ExecuteReader();
        if (sdr.Read())
        {
            Session["Aname"] = sdr["Aname"].ToString();
            Session["Apw"] = sdr["Apw"].ToString();
            Response.Write("<script language='javascript'>alert('登录成功欢迎使用web售票系统');location.href='Index.aspx'</script>");

        }

        else
        {
            Response.Write("<script language='javascript'>alert('用户名或密码错误请重新登录');location.href='login.aspx'</script>");
        
        }
    }
}
