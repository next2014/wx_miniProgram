<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="BookingInquiry.aspx.cs" Inherits="BookingInquiry" Title="Untitled Page" %>
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
            <td align="center" colspan="3" style="height: 8px" valign="top">
                以下是当前预售的所有车票</td>
        </tr>
        <tr>
            <td colspan="3" style="height: 132px" valign="top">
                <asp:GridView ID="GridView1" runat="server" AllowPaging="True" AutoGenerateColumns="False"
                    CellPadding="4" ForeColor="#333333" GridLines="None"
                    PageSize="12" Width="636px" DataSourceID="SqlDataSource1">
                    <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <Columns>
                        <asp:BoundField DataField="Oid" HeaderText="编号" InsertVisible="False" ReadOnly="True"
                            SortExpression="Oid" />
                        <asp:BoundField DataField="OCar" HeaderText="车次" SortExpression="OCar" />
                        <asp:BoundField DataField="OTicketype" HeaderText="车票类型" SortExpression="OTicketype" />
                        <asp:BoundField DataField="ObuyTime" HeaderText="预定时间" SortExpression="ObuyTime" />
                        <asp:BoundField DataField="Ousetime" HeaderText="开车时间" SortExpression="Ousetime" />
                        <asp:BoundField DataField="Omoney" HeaderText="票价" SortExpression="Omoney" />
                    </Columns>
                    <RowStyle BackColor="#EFF3FB" />
                    <EditRowStyle BackColor="#2461BF" />
                    <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                    <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
                    <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <AlternatingRowStyle BackColor="White" />
                </asp:GridView>
                <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
                    SelectCommand="SELECT * FROM [OrderTicket]"></asp:SqlDataSource>
                &nbsp;
            </td>
        </tr>
    </table>
</asp:Content>

