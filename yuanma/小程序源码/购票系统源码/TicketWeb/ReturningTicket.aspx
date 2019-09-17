<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="ReturningTicket.aspx.cs" Inherits="ReturningTicket" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-right: #3399ff 0.1mm solid; border-top: #3399ff 0.1mm solid;  border-bottom: #3399ff 0.1mm solid;">
        <tr>
            <td align="center" colspan="2" scope="row" style="background-position: center center; background-repeat: repeat-x;
                height: 33px; background-color: #3399ff;">
                退票管理</td>
        </tr>
        <tr>
            <td style="width: 327px; height: 25px">
                选择退票种类：</td>
            <td style="width: 836px; height: 25px">
                <asp:DropDownList ID="DropDownList1" runat="server" AutoPostBack="True" OnSelectedIndexChanged="DropDownList1_SelectedIndexChanged"
                    Width="128px">
                    <asp:ListItem>预定的票</asp:ListItem>
                    <asp:ListItem Selected="True">非预定的票</asp:ListItem>
                </asp:DropDownList>
                <asp:Label ID="Label1" runat="server" Width="357px"></asp:Label></td>
        </tr>
        <tr>
            <td id="TD1" runat="server" colspan="2" style="height: 23px; background-position: center center; background-image: url(image/bar.jpg); color: #ffffff; background-repeat: repeat-x;" align="center">
                车票的内容</td>
        </tr>
        <tr>
            <td style="width: 327px; height: 25px">
                输入编号：</td>
            <td style="width: 836px; height: 25px">
                <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
                <asp:LinkButton ID="LinkButton1" runat="server" OnClick="LinkButton1_Click" Width="32px">查找</asp:LinkButton>输入车票编号检索车票</td>
        </tr>
        <tr>
            <td style="width: 327px; height: 25px">
                车票价格：</td>
            <td style="width: 836px; height: 25px">
                <asp:Label ID="Label2" runat="server" Width="159px"></asp:Label></td>
        </tr>
        <tr>
            <td style="width: 327px; height: 27px">
                车次：</td>
            <td style="width: 836px; height: 27px">
                <asp:Label ID="Label3" runat="server" Width="159px"></asp:Label></td>
        </tr>
        <tr>
            <td style="width: 327px; height: 25px">
                车票类型：</td>
            <td style="width: 836px; height: 25px">
                <asp:Label ID="Label4" runat="server" Width="158px"></asp:Label></td>
        </tr>
        <tr>
            <td style="width: 327px; height: 25px">
                开车时间：</td>
            <td style="width: 836px; height: 25px">
                <asp:Label ID="Label5" runat="server" Width="162px"></asp:Label></td>
        </tr>
        <tr>
            <td style="width: 327px; height: 25px">
                预定时间：</td>
            <td style="width: 836px; height: 25px">
                <asp:Label ID="txtyudingtime" runat="server" Width="162px"></asp:Label></td>
        </tr>
        <tr>
            <td style="height: 25px; background-position: center center; background-image: url(image/bar.jpg); color: #ffffff; background-repeat: repeat-x;" align="center" colspan="2">
                <asp:LinkButton ID="Linktuipiao" runat="server" OnClick="Linktuipiao_Click" ForeColor="White" Width="45px">退票</asp:LinkButton></td>
        </tr>
        <tr>
            <td style="height: 25px" colspan="2">
                </td>
        </tr>
    </table>
</asp:Content>

