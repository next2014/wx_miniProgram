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

public partial class MasterPage : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["Aname"] != null )
        {
            this.Label1.Text = "尊敬的：" + Session["Aname"] + "您好" + "您目前登录的身份是：" + Session["Apw"];
        
        
        }

    }
    protected void LinkButton2_Click(object sender, EventArgs e)
    {
        Response.Redirect("Index.aspx");
    }
}
