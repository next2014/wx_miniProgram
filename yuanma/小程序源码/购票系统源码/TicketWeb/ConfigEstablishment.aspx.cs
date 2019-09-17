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

public partial class ConfigEstablishment : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Panel1.Visible = false;
        Panel2.Visible = false;
        Panel3.Visible = false;
        Panel4.Visible = false;
    }
    protected void Linkaddticket_Click(object sender, EventArgs e)
    {//添加车票
      

            SqlConnection con = db.ceratcon();
            con.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = (SqlConnection)con;//对象实例化
            cmd.CommandText = "insert into Ticket (Tname,Ttime,Tmoney)values(@Tname,@Ttime,@Tmoney)";


            cmd.Parameters.Add("@Tname", SqlDbType.VarChar);
            cmd.Parameters.Add("@Ttime", SqlDbType.DateTime);
            cmd.Parameters.Add("@Tmoney", SqlDbType.Money);


            cmd.Parameters["@Tname"].Value = this.txtaddname.Text;

            cmd.Parameters["@Ttime"].Value = Convert.ToString(this.txttime.Text);
            cmd.Parameters["@Tmoney"].Value = this.txtmoney.Text;
            cmd.ExecuteNonQuery();
            con.Close();
            Panel1.Visible = false;
            Panel2.Visible = true;
            Panel3.Visible = false;
            Panel4.Visible = false;
            Response.Write("<script language='javascript'>alert('添加成功')</script>");
            
    }
    
    protected void Linkdel_Click(object sender, EventArgs e)
    {//删除车票
        string name = this.DropDownList1.SelectedItem.Text;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;
        cmd.CommandText = "delete from  Ticket   where  Tname='" + name + "'";
        

        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('删除成功')</script>");

        Panel1.Visible = false;
        Panel2.Visible = true;
        Panel3.Visible = false;
        Panel4.Visible = false;

    }
    protected void Linkupdata_Click(object sender, EventArgs e)
    {
        
        //修改车票
        string name = this.DropDownList1.SelectedItem.Text;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;
        cmd.CommandText = "update   Ticket set Tname=@Tname,Ttime=@Ttime ,Tmoney=@Tmoney  where  Tname='" + name + "'";
        cmd.Parameters.Add("@Tname", SqlDbType.VarChar);
        cmd.Parameters.Add("@Ttime", SqlDbType.DateTime);
        cmd.Parameters.Add("@Tmoney", SqlDbType.Money);

        cmd.Parameters["@Tname"].Value = this.txtupname.Text;
        cmd.Parameters["@Ttime"].Value = this.txtuptime.Text;
        cmd.Parameters["@Tmoney"].Value = this.txtupmoney.Text;
      
        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('修改成功')</script>");
        Panel1.Visible = false;
        Panel2.Visible = true;
        Panel3.Visible = false;
        Panel4.Visible = false;


    }
    protected void Linkaddcar_Click(object sender, EventArgs e)
    {//添加车次

        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;//对象实例化
        cmd.CommandText = "insert into Car (Carname)values(@Carname)";


        cmd.Parameters.Add("@Carname", SqlDbType.VarChar);



        cmd.Parameters["@Carname"].Value = this.txtcname.Text;

        

        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('添加成功')</script>");
        Panel1.Visible = false;
        Panel2.Visible = false;
        Panel3.Visible = true;
        Panel4.Visible = false;
    }
    protected void DropDownList2_SelectedIndexChanged(object sender, EventArgs e)
    {
        Panel1.Visible = false;
        Panel2.Visible = false;
        Panel3.Visible = true;
        Panel4.Visible = false;
        //选择车次信息
        SqlConnection con = db.ceratcon();
        con.Open();

        SqlCommand cmd = new SqlCommand("select  * from Car", con);//从数据库中选择数据
        cmd.Parameters.Add("@Carname", SqlDbType.VarChar);
        cmd.Parameters["@Carname"].Value = this.DropDownList2.SelectedItem.Text;

        SqlDataReader sdr = cmd.ExecuteReader();//读数据
        if (sdr.Read())
        {
            this.txtupcarname.Text = this.DropDownList2.SelectedItem.Text;

            this.txtcdelname.Text = this.DropDownList2.SelectedItem.Text;

        }
        Panel1.Visible = false;
        Panel2.Visible = false;
        Panel3.Visible = true;
        Panel4.Visible = false;
        con.Close();
    }
    protected void Linkupcar_Click(object sender, EventArgs e)
    {
        //修改车次
        string name = this.DropDownList2.SelectedItem.Text;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;
        cmd.CommandText = "update   Car set Carname=@Carname where  Carname='"+name+"'";
        cmd.Parameters.Add("@Carname", SqlDbType.VarChar);
     


        cmd.Parameters["@Carname"].Value = this.txtupcarname.Text;
      
      
        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('修改成功')</script>");

        Panel1.Visible = false;
        Panel2.Visible = false;
        Panel3.Visible = true;
        Panel4.Visible = false;
    }

    protected void Linkdelcar_Click(object sender, EventArgs e)
    {//删除车次
        string name = this.DropDownList2.SelectedItem.Text;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;
        cmd.CommandText = "delete from  Car   where  Carname='" + name + "'";


        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('修改成功')</script>");
        Panel1.Visible = false;
        Panel2.Visible = false;
        Panel3.Visible = true;
        Panel4.Visible = false;

    }
    protected void linkjichucanshu_Click(object sender, EventArgs e)
    {
        Panel1.Visible = true;
        Panel2.Visible = false;
        Panel3.Visible = false;
        Panel4.Visible = false;
    }
    protected void Linkchepiao_Click(object sender, EventArgs e)
    {
        Panel4.Visible = false;
        Panel1.Visible = false;
        Panel2.Visible = true;
        Panel3.Visible = false;

    }
    protected void Linkcheci_Click(object sender, EventArgs e)
    {
        Panel3.Visible = true;
        Panel1.Visible = false;
        Panel2.Visible = false;
        Panel4.Visible = false;
    }
    protected void Linkdiaodu_Click(object sender, EventArgs e)
    {
        Panel4.Visible = true;
        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = false;
    }
    protected void DropDownList3_SelectedIndexChanged(object sender, EventArgs e)
    {
       
       
    }
    protected void DropDownList4_SelectedIndexChanged(object sender, EventArgs e)
    {
        Panel4.Visible = true;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = false;
        //获取运营中的车次信息
        SqlConnection con = db.ceratcon();
        con.Open();

        SqlCommand cmd = new SqlCommand("select  * from Car", con);//从数据库中选择数据
        cmd.Parameters.Add("@Carname", SqlDbType.VarChar);
        cmd.Parameters["@Carname"].Value = this.DropDownList4.SelectedItem.Text;

        SqlDataReader sdr = cmd.ExecuteReader();//读数据
        if (sdr.Read())
        {
            this.txttinyun.Text = this.DropDownList4.SelectedItem.Text;

           

        }

        con.Close();
        
    }
    protected void Linktingyun_Click(object sender, EventArgs e)
    {//把运营中的车辆设置成停运
        Panel4.Visible = true;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = false;
        string name = this.DropDownList3.SelectedItem.Text;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;
        cmd.CommandText = "update   Car set CType=@CType where  Carname='" + name + "'";
        cmd.Parameters.Add("@CType", SqlDbType.VarChar);



        cmd.Parameters["@CType"].Value = "是";


        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('设置成功')</script>");
        Panel4.Visible = true;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = false;
    }
    protected void Linkyunying_Click(object sender, EventArgs e)
    {//把停运中的车次设置成运营 
        Panel4.Visible = true;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = false;
        string name = this.DropDownList4.SelectedItem.Text;
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;
        cmd.CommandText = "update   Car set CType=@CType where  Carname='" + name + "'";
        cmd.Parameters.Add("@CType", SqlDbType.VarChar);



        cmd.Parameters["@CType"].Value = "否";


        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('设置成功')</script>");
        Panel4.Visible = true;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = false;
    }
    protected void Linkbuy_Click(object sender, EventArgs e)
    {//添加设置买票时间
       
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;//对象实例化
        cmd.CommandText = "update  System set SysBuyTime=@SysBuyTime";


        cmd.Parameters.Add("@SysBuyTime", SqlDbType.VarChar);



        cmd.Parameters["@SysBuyTime"].Value = this.TextBox1.Text;



        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('设置成功')</script>");
        Panel4.Visible = false;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = true;

    }
    protected void Linklinkding_Click(object sender, EventArgs e)
    {//设置订票时间

        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;//对象实例化
        cmd.CommandText = "update  System set SysOrderTime=@SysOrderTime";
       

        cmd.Parameters.Add("@SysOrderTime", SqlDbType.VarChar);



        cmd.Parameters["@SysOrderTime"].Value = this.TextBox2.Text;



        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('设置成功')</script>");
        Panel4.Visible = false;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = true;
    }
    protected void Linktui_Click(object sender, EventArgs e)
    {//设置退票时间
        SqlConnection con = db.ceratcon();
        con.Open();
        SqlCommand cmd = new SqlCommand();
        cmd.Connection = (SqlConnection)con;//对象实例化
        cmd.CommandText = "update  System set SystuipiaoTime=@SystuipiaoTime";
       

        cmd.Parameters.Add("@SystuipiaoTime", SqlDbType.VarChar);



        cmd.Parameters["@SystuipiaoTime"].Value = this.TextBox3.Text;



        cmd.ExecuteNonQuery();
        con.Close();
        Response.Write("<script language='javascript'>alert('设置成功')</script>");
        Panel4.Visible = false;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = true;

    }

    protected void DropDownList3_SelectedIndexChanged1(object sender, EventArgs e)
    {//获取停运车次信息
        Panel4.Visible = true;

        Panel3.Visible = false;
        Panel2.Visible = false;
        Panel1.Visible = false;

        SqlConnection con = db.ceratcon();
        con.Open();

        SqlCommand cmd = new SqlCommand("select  * from Car", con);//从数据库中选择数据
        cmd.Parameters.Add("@Carname", SqlDbType.VarChar);
        cmd.Parameters["@Carname"].Value = this.DropDownList3.SelectedItem.Text;

        SqlDataReader sdr = cmd.ExecuteReader();//读数据
        if (sdr.Read())
        {
            this.txtyunying.Text = this.DropDownList3.SelectedItem.Text;



        }

        con.Close();

    }
    protected void DropDownList1_SelectedIndexChanged1(object sender, EventArgs e)
    {
        Panel1.Visible = false;
        Panel2.Visible = true;
        Panel3.Visible = false;
        Panel4.Visible = false;
        //读取车票数据到更新和删除
        SqlConnection con = db.ceratcon();
        con.Open();

        SqlCommand cmd = new SqlCommand("select  * from Ticket where Tname=@Tname", con);//从数据库中选择数据
        cmd.Parameters.Add("@Tname", SqlDbType.VarChar);
        cmd.Parameters["@Tname"].Value = this.DropDownList1.SelectedItem.Text;

        SqlDataReader sdr = cmd.ExecuteReader();//读数据
        if (sdr.Read())
        {
            this.txtupmoney.Text = sdr["Tmoney"].ToString();
            this.txtuptime.Text = sdr["Ttime"].ToString();
            this.txtupname.Text = sdr["Tname"].ToString();
            this.txtdelname.Text = sdr["Tname"].ToString();
        }

        con.Close();
        Panel1.Visible = false;
        Panel2.Visible = true;
        Panel3.Visible = false;
        Panel4.Visible = false;
    }
}

