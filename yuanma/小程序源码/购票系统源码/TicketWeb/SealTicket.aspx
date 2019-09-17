<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="SealTicket.aspx.cs" Inherits="SealTicket" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="border-right: #3399ff 0.1mm solid;
        border-top: #3399ff 0.1mm solid; ; width: 100%;
        border-bottom: #3399ff 0.1mm solid">
        <tr>
            <td align="center" colspan="3" style="background-position: center center; font-size: large; color: #000033; background-repeat: repeat-x;
                height: 32px; background-color: #3399ff;">
                前台车票预定系统</td>
        </tr>
        <tr>
            <td style="width: 184px; height: 23px">
                选择乘坐车次：</td>
            <td align="left" colspan="2" style="width: 670px; height: 23px">
                <asp:DropDownList ID="DropDownList1" runat="server" DataSourceID="SqlDataSource1"
                    DataTextField="Carname" DataValueField="Carname" Width="180px">
                </asp:DropDownList>
            </td>
        </tr>
        <tr>
            <td style="width: 184px; height: 29px">
                选择车票种类：</td>
            <td align="left" colspan="2" style="width: 670px; height: 29px">
                <asp:DropDownList ID="DropDownList2" runat="server" DataSourceID="SqlDataSource3"
                    DataTextField="Tname" DataValueField="Tmoney" Width="180px">
                </asp:DropDownList>&nbsp;
            </td>
        </tr>
        <tr>
            <td style="width: 184px; height: 29px">
                选择开车时间：</td>
            <td align="left" colspan="2" style="width: 670px; height: 29px">
                &nbsp;<asp:DropDownList ID="DropDownList3" runat="server" DataSourceID="SqlDataSource2"
                    DataTextField="Ttime" DataValueField="Ttime" Width="174px">
                </asp:DropDownList></td>
        </tr>
        <tr>
            <td align="left" colspan="3" rowspan="2" style="background-position: center center;
                background-image: url(image/bar.jpg); background-repeat: repeat-x; height: 30px">
                <asp:LinkButton ID="Linkbuy" runat="server" BackColor="MediumTurquoise" ForeColor="Black"
                    Height="18px" OnClick="Linkbuy_Click" Width="91px" BorderStyle="None">　预　览　</asp:LinkButton>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;
            </td>
        </tr>
        <tr>
        </tr>
        <tr>
            <td align="left" colspan="3" style="height: 26px">
                &nbsp;以下是你购买的车票信息</td>
        </tr>
        <tr>
            <td colspan="3" rowspan="2">
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                    <tr>
                        <td align="left" style="width: 133px; height: 30px">
                            车次：</td>
                        <td align="left" colspan="2" style="height: 30px">
                            <asp:Label ID="Label1" runat="server" Width="165px"></asp:Label></td>
                    </tr>
                    <tr>
                        <td align="left" style="width: 133px; height: 31px">
                            种类：</td>
                        <td align="left" colspan="2" style="height: 31px">
                            <asp:Label ID="Label2" runat="server" Width="166px"></asp:Label></td>
                    </tr>
                    <tr>
                        <td align="left" style="width: 133px; height: 30px">
                            开车时间：</td>
                        <td align="left" colspan="2" style="height: 30px">
                            <asp:Label ID="Label3" runat="server" Width="165px"></asp:Label></td>
                    </tr>
                     <tr>
                        <td align="left" style="width: 133px; height: 30px">
                            车票价格：</td>
                        <td align="left" colspan="2" style="height: 30px">
                            <asp:Label ID="Label4" runat="server" Width="165px"></asp:Label></td>
                    </tr>
                    <tr>
                        <td align="left" colspan="3" style="height: 31px">
                            <asp:LinkButton ID="LinkButton1" runat="server" BackColor="MediumTurquoise" ForeColor="Black"
                                OnClick="LinkButton1_Click" Width="80px" BorderStyle="None">　购　买　</asp:LinkButton></td>
                    </tr>
                </table>
                &nbsp;</td>
        </tr>
        <tr>
        </tr>
    </table>
    <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
        SelectCommand="SELECT * FROM [Car] WHERE ([CType] = @CType) ORDER BY [Cid]">
        <SelectParameters>
            <asp:Parameter DefaultValue="否" Name="CType" Type="String" />
        </SelectParameters>
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource2" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
        SelectCommand="SELECT * FROM [Ticket]"></asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource3" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
        SelectCommand="SELECT * FROM [Ticket]"></asp:SqlDataSource>
</asp:Content>

