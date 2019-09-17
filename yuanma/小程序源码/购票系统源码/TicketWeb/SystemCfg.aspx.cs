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

public partial class SystemCfg : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.Panel1.Visible = true;
            this.Panel2.Visible = false;
            if (Session["Apw"].ToString()== "普通管理员")
            {
                Response.Write("<script language='javascript'>alert('对不起你没有该项的操作权限');location.href='Index.aspx'</script>");
            
            }
            else
                if (Session["Apw"].ToString() == "超级管理员")
                {
                  
 
                
                }
        
        }

    }
    protected void linkconfig_Click(object sender, EventArgs e)
    {
        this.Panel2.Visible = false;
        this.Panel1.Visible = true;
    }
    protected void dayin_Click(object sender, EventArgs e)
    {
        Response.Write("<script language='javascript'>alert('该功能正在制作中！')</script>");
    }
    protected void linkclear_Click(object sender, EventArgs e)
    {
        this.txtname.Text = "";
        txtpwd.Text = "";
        txtpwd2.Text = "";
    }
    protected void lingadd_Click(object sender, EventArgs e)
    {
        try
        {

            SqlConnection con = db.ceratcon();
            con.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = (SqlConnection)con;//对象实例化
            cmd.CommandText = "insert into Admin (Apwd,Aname,Apw)values(@Apwd,@Aname,@Apw)";


            cmd.Parameters.Add("@Apwd", SqlDbType.VarChar);
            cmd.Parameters.Add("@Aname", SqlDbType.VarChar);
            cmd.Parameters.Add("@Apw",SqlDbType.VarChar);

            cmd.Parameters["@Apwd"].Value = this.txtpwd.Text;
            cmd.Parameters["@Aname"].Value = this.txtname.Text;
            cmd.Parameters["@Apw"].Value = this.DropDownList1.SelectedItem.Text;
            cmd.ExecuteNonQuery();
            con.Close();
            Response.Write("<script language='javascript'>alert('注册成功请登陆');location.href='Index.aspx'</script>");
        }
        catch
        {
            Response.Write("<script language='javascript'>alert('注册失败请重新注册');location.href='SystemCfg.aspx'</script>");
        }
    }
    protected void linkUpdata_Click(object sender, EventArgs e)
    {
        Panel1.Visible = false;
        Panel2.Visible = true;
    }
    protected void txtpwd3_TextChanged(object sender, EventArgs e)
    {

    }
    protected void DropDownList3_SelectedIndexChanged(object sender, EventArgs e)
    {
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand("select  * from Admin", con);//从数据库中选择数据
        cmd.Parameters.Add("@Aname", SqlDbType.VarChar);
        cmd.Parameters["@Aname"].Value = this.DropDownList1.SelectedItem.Text;

        SqlDataReader sdr = cmd.ExecuteReader();//读数据
        if (sdr.Read())
        {
            this.txtname2.Text = this.DropDownList3.SelectedItem.Text;
            this.txtpwd3.Text = Convert.ToString(sdr["Apwd"]);
            this.DropDownList2.SelectedItem.Text = Convert.ToString(sdr["Apw"]);



        }
        con.Close();

    }
    protected void LinkButton1_Click(object sender, EventArgs e)
    {
        string name = this.DropDownList3.SelectedItem.Text;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;
        cmd.CommandText = "update   Admin set Apwd=@Apwd,Aname=@Aname,Apw=@Apw where Aname=@Aname";
        cmd.Parameters.Add("@Apwd", SqlDbType.VarChar);
        cmd.Parameters.Add("@Aname", SqlDbType.VarChar);
        cmd.Parameters.Add("@Apw", SqlDbType.VarChar);

        cmd.Parameters["@Apwd"].Value =this.txtpwd3.Text;
        cmd.Parameters["@Aname"].Value = this.txtname2.Text;
        cmd.Parameters["@Apw"].Value = this.DropDownList2.SelectedItem.Text;
        cmd.ExecuteNonQuery();
         con.Close();
         Response.Write("<script language='javascript'>alert('修改成功');location.href='SystemCfg.aspx'</script>");

    }
}
