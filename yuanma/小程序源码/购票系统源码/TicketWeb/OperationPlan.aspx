<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="OperationPlan.aspx.cs" Inherits="QuarterStatistics" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="border-right: #3399ff 0.1mm solid;
        border-top: #3399ff 0.1mm solid;  width: 100%;
        border-bottom: #3399ff 0.1mm solid">
        <tr>
            <td align="center" colspan="3" style="background-position: center center;
                background-repeat: repeat-x; height: 30px; background-color: #3399ff;">
                售票信息查询</td>
        </tr>
        <tr>
            <td align="center" colspan="3" style="height: 8px; border-bottom: #3399ff 0.1mm solid;" valign="top">
                以下是当前运营的所有列车</td>
        </tr>
        <tr>
            <td colspan="3" style="height: auto" valign="top" align="left">
                <asp:GridView ID="GridView1" runat="server" AllowPaging="True" AutoGenerateColumns="False"
                    CellPadding="4" DataSourceID="SqlDataSource1" ForeColor="#333333" GridLines="None"
                    PageSize="12" Width="633px">
                    <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <Columns>
                        <asp:BoundField DataField="Cid" HeaderText="车辆编号" InsertVisible="False" SortExpression="Cid" />
                        <asp:BoundField DataField="Carname" HeaderText="车次" SortExpression="Carname" />
                    </Columns>
                    <RowStyle BackColor="#EFF3FB" />
                    <EditRowStyle BackColor="#2461BF" />
                    <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                    <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
                    <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <AlternatingRowStyle BackColor="White" />
                </asp:GridView>
                &nbsp; &nbsp;
            </td>
        </tr>
         <tr>
            <td align="center" colspan="3" style="height: 8px; border-bottom: #3399ff 0.1mm solid;" valign="top">
                以下是当前停运的所有列车</td>
        </tr>
         <tr>
            <td align="left" colspan="3" style="height: auto" valign="top">
                <asp:GridView ID="GridView2" runat="server" AllowPaging="True" AutoGenerateColumns="False"
                    CellPadding="4" DataSourceID="SqlDataSource2" ForeColor="#333333" GridLines="None"
                    PageSize="12" Width="634px">
                    <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <Columns>
                        <asp:BoundField DataField="Cid" HeaderText="车辆编号" InsertVisible="False" ReadOnly="True"
                            SortExpression="Cid" />
                        <asp:BoundField DataField="Carname" HeaderText="车次" SortExpression="Carname" />
                    </Columns>
                    <RowStyle BackColor="#EFF3FB" />
                    <EditRowStyle BackColor="#2461BF" />
                    <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                    <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
                    <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <AlternatingRowStyle BackColor="White" />
                </asp:GridView>
                <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
                    SelectCommand="SELECT * FROM [Car] WHERE ([CType] = @CType)">
                    <SelectParameters>
                        <asp:Parameter DefaultValue="否" Name="CType" Type="String" />
                    </SelectParameters>
                </asp:SqlDataSource>
                <asp:SqlDataSource ID="SqlDataSource2" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
                    SelectCommand="SELECT * FROM [Car] WHERE ([CType] = @CType)">
                    <SelectParameters>
                        <asp:Parameter DefaultValue="是" Name="CType" Type="String" />
                    </SelectParameters>
                </asp:SqlDataSource>
                </td>
        </tr>
    </table>
</asp:Content>

