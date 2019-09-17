<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="QuarterStatistics.aspx.cs" Inherits="QuarterStatistics" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="border-right: #3399ff 0.1mm solid;
        border-top: #3399ff 0.1mm solid; border-left: #3399ff 0.1mm solid; width: 100%;
        border-bottom: #3399ff 0.1mm solid">
        <tr>
            <td align="center" colspan="3" style="background-position: center center;
                background-repeat: repeat-x; height: 30px; background-color: #3399ff;">
                售票信息查询</td>
        </tr>
        <tr>
            <td align="center" colspan="3" style="height: 7px" valign="top">
                以下是按季度统计的总销售额</td>
        </tr>
        <tr>
            <td align="left" colspan="3" style="height: 7px" valign="top">
                按季度统计：<asp:DropDownList ID="DropDownList1" runat="server" AutoPostBack="True" OnSelectedIndexChanged="DropDownList1_SelectedIndexChanged"
                    Width="122px">
                    <asp:ListItem Selected="True" Value="1">第一季度</asp:ListItem>
                    <asp:ListItem Value="2">第二季度</asp:ListItem>
                    <asp:ListItem Value="3">第三季度</asp:ListItem>
                    <asp:ListItem Value="4">第四季度</asp:ListItem>
                </asp:DropDownList>请选择季度</td>
        </tr>
        <tr>
            <td align="center" colspan="3" style="height: 7px" valign="top">
            </td>
        </tr>
        <tr>
            <td colspan="3" style="height: 24px" valign="top">
                预定收入：<asp:Label ID="Label1" runat="server" Width="97px"></asp:Label>
                售票收入：<asp:Label ID="Label2" runat="server" Width="103px"></asp:Label>
                总收入：<asp:Label ID="Label3" runat="server" Width="102px"></asp:Label></td>
        </tr>
    </table>
</asp:Content>

