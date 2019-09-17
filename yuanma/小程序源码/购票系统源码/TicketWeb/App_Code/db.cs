using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;

/// <summary>
/// db 的摘要说明
/// </summary>
public class db
{
	public db()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
    }
    public static SqlConnection ceratcon()
    {
        System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection("server=(local);database=webSealTicket;uid=sa;pwd=sa;");
        return con;

    }
}
