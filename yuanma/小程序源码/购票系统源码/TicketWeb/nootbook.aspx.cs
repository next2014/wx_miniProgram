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
using System.Diagnostics;   
public partial class nootbook : System.Web.UI.Page
{
    private System.Diagnostics.Process process;   
    protected void Page_Load(object sender, EventArgs e)
    {
    
    
    }


   
    protected void LinkButton1_Click(object sender, EventArgs e)
    {
        process = new Process();
        process.StartInfo.FileName = "notepad.exe";
        this.process.Start();
       
    }
}
