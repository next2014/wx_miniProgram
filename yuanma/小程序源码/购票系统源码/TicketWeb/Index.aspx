<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Index.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>售票系统</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-right: #0099cc thin solid; border-top: #0099cc thin solid; border-left: #0099cc thin solid; border-bottom: #0099cc thin solid; height: 596px;">
            <tr>
                <td colspan="3" style="background-position: 100% 100%; background-repeat: repeat-x; height: 85px; background-image: url(image/head.gif);" valign="top">
                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-position: 100% 100%; background-repeat: repeat-x; height: 4px; background-image: url(image/bar.jpg); color: #ffffff;" valign="top" align="right">
                    <asp:Label ID="Label1" runat="server" Text="Label" Width="61px"></asp:Label></td>
            </tr>
            <tr>
                <td rowspan="2" style="width: 41px; height: 441px" valign="top">
                    &nbsp;<asp:TreeView ID="TreeView1" runat="server" Font-Size="Larger" ImageSet="BulletedList"
                        ShowExpandCollapse="False" Width="126px">
                        <ParentNodeStyle Font-Bold="False" />
                        <HoverNodeStyle BackColor="DodgerBlue" Font-Underline="True" ForeColor="Black" />
                        <SelectedNodeStyle Font-Underline="True" ForeColor="#5555DD" HorizontalPadding="0px"
                            VerticalPadding="0px" />
                        <Nodes>
                            <asp:TreeNode ImageUrl="~/image/c.gif" NavigateUrl="~/Index.aspx" Text="web售票管理系统"
                                Value="web售票管理系统"></asp:TreeNode>
                            <asp:TreeNode ImageUrl="~/image/c.gif" NavigateUrl="~/SealTicket.aspx" Text="前台营业"
                                Value="前台营业">
                                <asp:TreeNode NavigateUrl="~/SealTicket.aspx" Text="销售车票" Value="销售车票"></asp:TreeNode>
                                <asp:TreeNode NavigateUrl="~/PredeterminedTicket.aspx" Text="预定车票" Value="预定车票"></asp:TreeNode>
                                <asp:TreeNode NavigateUrl="~/ReturningTicket.aspx" Text=" 退回车票" Value=" 退回车票"></asp:TreeNode>
                            </asp:TreeNode>
                            <asp:TreeNode ImageUrl="~/image/c.gif" NavigateUrl="~/PredeterminedTicketInquiry.aspx"
                                Text="信息查询" Value="信息查询">
                                <asp:TreeNode NavigateUrl="~/PredeterminedTicketInquiry.aspx" Text="售票信息查询" Value="售票信息查询">
                                </asp:TreeNode>
                                <asp:TreeNode NavigateUrl="~/BookingInquiry.aspx" Text="订票信息查询" Value="订票信息查询"></asp:TreeNode>
                                <asp:TreeNode NavigateUrl="~/OperationPlan.aspx" Text="运营计划查询" Value="运营计划查询"></asp:TreeNode>
                                <asp:TreeNode NavigateUrl="~/OndutyInquiry.aspx" Text="当班信息查询" Value="当班信息查询"></asp:TreeNode>
                            </asp:TreeNode>
                            <asp:TreeNode ImageUrl="~/image/c.gif" NavigateUrl="~/DayStatistics.aspx" Text="营业统计"
                                Value="营业统计">
                                <asp:TreeNode NavigateUrl="~/DayStatistics.aspx" Text="日售票统计" Value="日售票统计"></asp:TreeNode>
                                <asp:TreeNode NavigateUrl="~/MonthStatistics.aspx" Text="月售票统计" Value="月售票统计"></asp:TreeNode>
                                <asp:TreeNode NavigateUrl="~/QuarterStatistics.aspx" Text="季度售票统计" Value="季度售票统计"></asp:TreeNode>
                            </asp:TreeNode>
                            <asp:TreeNode ImageUrl="~/image/c.gif" NavigateUrl="~/Computer.aspx" Text="常用工具"
                                Value="常用工具">
                                <asp:TreeNode NavigateUrl="~/nootbook.aspx" Text="记事本" Value="记事本"></asp:TreeNode>
                                <asp:TreeNode NavigateUrl="~/Computer.aspx" Text="计算器    " Value="计算器    "></asp:TreeNode>
                            </asp:TreeNode>
                            <asp:TreeNode ImageUrl="~/image/c.gif" NavigateUrl="~/ConfigEstablishment.aspx" Text="基础设置"
                                Value="基础设置"></asp:TreeNode>
                            <asp:TreeNode ImageUrl="~/image/c.gif" NavigateUrl="~/SystemCfg.aspx" Text="系统设置"
                                Value="系统设置"></asp:TreeNode>
                        </Nodes>
                        <NodeStyle Font-Names="Verdana" Font-Size="8pt" ForeColor="Black" HorizontalPadding="0px"
                            NodeSpacing="0px" VerticalPadding="0px" />
                    </asp:TreeView>
                </td>
                <td rowspan="2" style="width: 8px; height: 441px; background-position: center center; background-image: url(image/Left_Student.jpg); background-repeat: repeat-y;" valign="top">
                </td>
                <td rowspan="2" style="width: 593px; height: 441px" valign="top">
                </td>
            </tr>
            <tr>
            </tr>
            <tr>
                <td colspan="3" style="background-position: center center; background-image: url(image/bar.jpg); background-repeat: repeat-x; height: 31px;">
                </td>
            </tr>
        </table>
    
    </div>
    </form>
</body>
</html>
