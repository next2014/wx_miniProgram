<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="DayStatistics.aspx.cs" Inherits="DayStatistics" Title="Untitled Page" %>
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
            <td align="center" colspan="3" style="height: 8px" valign="top">
                以下是今日的总销售额</td>
        </tr>
        <tr>
            <td colspan="3" style="height: 24px" valign="top">
                预定收入：<asp:Label ID="Label1" runat="server" Width="97px"></asp:Label>
                售票收入：<asp:Label ID="Label2" runat="server" Width="103px"></asp:Label>
                总收入：<asp:Label ID="Label3" runat="server" Width="102px"></asp:Label></td>
        </tr>
    </table>
</asp:Content>

