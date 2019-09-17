<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="OndutyInquiry.aspx.cs" Inherits="OndutyInquiry" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="border-right: #3399ff 0.1mm solid;
        border-top: #3399ff 0.1mm solid; width: 100%;
        border-bottom: #3399ff 0.1mm solid">
        <tr>
            <td align="center" colspan="3" style="background-position: center center;
                background-repeat: repeat-x; height: 30px; background-color: #3399ff;">
                售票信息查询</td>
        </tr>
        <tr>
            <td align="center" colspan="3" style="height: 8px; border-bottom: #3399ff 0.1mm solid;" valign="top">
                以下是当前售票员的所有收入</td>
        </tr>
        <tr>
            <td colspan="3" style="height: 24px" valign="top">
                所有预定车票收入为：<asp:Label ID="Label1" runat="server" Width="184px"></asp:Label></td>
        </tr>
        <tr>
            <td colspan="3" style="height: 3px" valign="top">
                所有出售车票收入为：<asp:Label ID="Label2" runat="server" Width="183px"></asp:Label></td>
        </tr>
        <tr>
            <td colspan="3" style="height: 20px" valign="top">
            </td>
        </tr>
    </table>
</asp:Content>

