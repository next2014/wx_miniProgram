<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="ConfigEstablishment.aspx.cs" Inherits="ConfigEstablishment" Title="Untitled Page" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <tr>
            <td align="left" style="background-position: center center; background-image: url(image/bar.jpg);
                width: 629px; background-repeat: repeat-x; height: 22px">
                <asp:LinkButton ID="linkjichucanshu" runat="server" ForeColor="White" OnClick="linkjichucanshu_Click" CausesValidation="False">基础参数设置</asp:LinkButton>
                <asp:LinkButton ID="Linkchepiao" runat="server" ForeColor="White" OnClick="Linkchepiao_Click" CausesValidation="False">车票设置</asp:LinkButton>&nbsp;
                <asp:LinkButton ID="Linkcheci" runat="server" ForeColor="White" OnClick="Linkcheci_Click" CausesValidation="False">车次设置</asp:LinkButton>
                <asp:LinkButton ID="Linkdiaodu" runat="server" ForeColor="White" OnClick="Linkdiaodu_Click" CausesValidation="False">调度设置</asp:LinkButton></td>
        </tr>
        <tr>
            <td style="width: 629px;" align="left" valign="top" rowspan="5">
                <asp:Panel ID="Panel1" runat="server" Height="50px" Width="125px">
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 500%;  border-top: #3399ff 0.1pc solid;  border-bottom: #3399ff 0.1pc solid;">
                        <tr>
                            <td colspan="3" style="height: 18px; background-color: #3399ff;">
                                基础参数设置</td>
                        </tr>
                        <tr>
                            <td style="width: 100px; height: 27px;">
                                买票设置：</td>
                            <td style="width: 441px; height: 27px;" align="left">
                                <asp:TextBox ID="TextBox1" runat="server" Width="55px" MaxLength="2"></asp:TextBox>点之前不能买票（24小时制）</td>
                            <td style="width: 119px; height: 27px;" align="center">
                                <asp:LinkButton ID="Linkbuy" runat="server" OnClick="Linkbuy_Click">确定</asp:LinkButton></td>
                        </tr>
                        <tr>
                            <td style="width: 100px; height: 25px;">
                                订票设置：</td>
                            <td style="width: 441px; height: 25px;" align="left">
                                <asp:TextBox ID="TextBox2" runat="server" Width="55px" MaxLength="2"></asp:TextBox>点之前不能订票（24小时制）</td>
                            <td style="width: 119px; height: 25px;" align="center">
                                <asp:LinkButton ID="Linklinkding" runat="server" OnClick="Linklinkding_Click">确定</asp:LinkButton></td>
                        </tr>
                        <tr>
                            <td style="width: 100px; height: 25px;">
                                退票设置：</td>
                            <td style="width: 441px; height: 25px;" align="left">
                                <asp:TextBox ID="TextBox3" runat="server" Width="57px" MaxLength="2"></asp:TextBox>说出几小时不能退票（24小时制）</td>
                            <td style="width: 119px; height: 25px;" align="center">
                                <asp:LinkButton ID="Linktui" runat="server" OnClick="Linktui_Click">确定</asp:LinkButton></td>
                        </tr>
                    </table>
                </asp:Panel>
                <asp:Panel ID="Panel2" runat="server" Height="50px" Width="125px">
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 501%;  border-top: #3399ff 0.1mm solid; border-bottom: #3399ff 0.1mm solid;">
                        <tr>
                            <td colspan="3" style="height: 25px; background-color: #3399ff; width: 652px;">
                                车票的增删改</td>
                        </tr>
                        <tr>
                            <td align="left" colspan="3" style="height: 67px; width: 652px;" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-top-width: 0.1mm; border-left-width: 0.1mm; border-left-color: #3399ff; border-bottom-width: 0.1mm; border-bottom-color: #3399ff; border-top-color: #3399ff; border-right-width: 0.1mm; border-right-color: #3399ff;">
                                    <tr>
                                        <td align="center" colspan="3" style="height: 18px">
                                            增加车票</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" rowspan="4" align="left" style="height: 69px" valign="top">
                                            车票名称：<asp:TextBox ID="txtaddname" runat="server" MaxLength="20"></asp:TextBox>
                                            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="txtaddname"
                                                Display="Dynamic" ErrorMessage="名称必须填写" ValidationGroup="1"></asp:RequiredFieldValidator><br />
                                            开车时间：<asp:TextBox ID="txttime" runat="server"></asp:TextBox>
                                            <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" ControlToValidate="txttime"
                                                Display="Dynamic" ErrorMessage="时间没有填写"></asp:RequiredFieldValidator>时间格式：2007-4-25 PM 02:40:00<br />
                                            车票价格：<asp:TextBox ID="txtmoney" runat="server" MaxLength="4"></asp:TextBox>
                                            <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ControlToValidate="txtmoney"
                                                Display="Dynamic" ErrorMessage="价格必须填写" ValidationGroup="1"></asp:RequiredFieldValidator>
                                            <br />
                                            <asp:LinkButton ID="Linkaddticket" runat="server" Width="54px" OnClick="Linkaddticket_Click" ValidationGroup="1">添加</asp:LinkButton></td>
                                    </tr>
                                    <tr>
                                    </tr>
                                    <tr>
                                    </tr>
                                    <tr>
                                    </tr>
                                </table>
                                修改删除车票</td>
                        </tr>
                        <tr>
                            <td style="height: 25px; width: 652px;" align="left" colspan="3">
                                选择要修改或删除车票名称：<asp:DropDownList ID="DropDownList1" runat="server" AutoPostBack="True" DataSourceID="SqlDataSource1"
                                    DataTextField="Tname" DataValueField="Tname" Width="118px" OnSelectedIndexChanged="DropDownList1_SelectedIndexChanged1" >
                                </asp:DropDownList>
                            </td>
                        </tr>
                         <tr>
                            <td style="height: 96px; width: 652px;" align="left" colspan="3">
                                车票名称：<asp:TextBox ID="txtupname" runat="server" MaxLength="20"></asp:TextBox>&nbsp;
                                <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ControlToValidate="txtupname"
                                    ErrorMessage="名称没有填写" Display="Dynamic" ValidationGroup="2"></asp:RequiredFieldValidator><br />
                                开车时间：<asp:TextBox ID="txtuptime" runat="server"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ControlToValidate="txtuptime"
                                    Display="Dynamic" ErrorMessage="时间没有填写" ValidationGroup="2"></asp:RequiredFieldValidator>时间格式：2007-4-25
                                PM 02:40:00<br />
                                车票价格：<asp:TextBox ID="txtupmoney" runat="server" MaxLength="4" Width="148px"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ControlToValidate="txtupmoney"
                                    Display="Dynamic" ErrorMessage="价格没有填写" ValidationGroup="2"></asp:RequiredFieldValidator>
                                <br />
                                <asp:LinkButton ID="Linkupdata" runat="server" OnClick="Linkupdata_Click" CausesValidation="False" ValidationGroup="2">修改</asp:LinkButton></td>
                        </tr>
                         <tr>
                            <td style="height: 37px; width: 652px;" align="left" colspan="3">
                                车票名称：<asp:TextBox ID="txtdelname" runat="server" MaxLength="20"></asp:TextBox>
                                <asp:LinkButton ID="Linkdel" runat="server" OnClick="Linkdel_Click" CausesValidation="False">删除</asp:LinkButton></td>
                         </tr>
                    </table>
                </asp:Panel>
                <asp:Panel ID="Panel3" runat="server" Height="50px" Width="125px"><table border="0" cellpadding="0" cellspacing="0" style="width: 499%; border-top: #3399ff 0.1mm solid;  border-bottom: #3399ff 0.1mm solid;">
                    <tr>
                        <td colspan="3" style="height: 25px; background-color: #3399ff;">
                            车次的增删改</td>
                    </tr>
                    <tr>
                        <td align="center" colspan="3" style="height: 67px" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-top-width: 0.1mm; border-left-width: 0.1mm; border-left-color: #3399ff; border-bottom-width: 0.1mm; border-bottom-color: #3399ff; border-top-color: #3399ff; border-right-width: 0.1mm; border-right-color: #3399ff;">
                                <tr>
                                    <td align="center" colspan="3" style="height: 18px">
                                        增加车次</td>
                                </tr>
                                <tr>
                                    <td colspan="3" rowspan="4" align="left" style="height: 29px">
                                        车次名称：<asp:TextBox ID="txtcname" runat="server" MaxLength="20"></asp:TextBox>
                                        <asp:LinkButton ID="Linkaddcar" runat="server" OnClick="Linkaddcar_Click">添加</asp:LinkButton></td>
                                </tr>
                                <tr>
                                </tr>
                                <tr>
                                </tr>
                                <tr>
                                </tr>
                            </table>
                            修改删除车次</td>
                    </tr>
                    <tr>
                        <td style="height: 25px" align="left" colspan="3">
                            选择要修改或删除车次名称：&nbsp;
                            <asp:DropDownList ID="DropDownList2" runat="server" AutoPostBack="True" DataSourceID="SqlDataSource2"
                                DataTextField="Carname" DataValueField="Carname" OnSelectedIndexChanged="DropDownList2_SelectedIndexChanged"
                                Width="104px">
                            </asp:DropDownList></td>
                    </tr>
                    <tr>
                        <td style="height: 25px" align="left" colspan="3">
                            车次名称：<asp:TextBox ID="txtupcarname" runat="server" MaxLength="20"></asp:TextBox>
                            <asp:LinkButton ID="Linkupcar" runat="server" OnClick="Linkupcar_Click" CausesValidation="False">修改</asp:LinkButton></td>
                    </tr>
                    <tr>
                        <td style="height: 25px" align="left" colspan="3">
                            车次名称：<asp:TextBox ID="txtcdelname" runat="server" MaxLength="20"></asp:TextBox>
                            <asp:LinkButton ID="Linkdelcar" runat="server" OnClick="Linkdelcar_Click" CausesValidation="False">删除</asp:LinkButton></td>
                    </tr>
                </table>
                </asp:Panel>
                <asp:Panel ID="Panel4" runat="server" Height="50px" Width="125px">
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 499%; border-top: #3399ff 0.1pc solid; border-bottom: #3399ff 0.1pc solid;">
                        <tr>
                            <td align="center" colspan="3" style="height: 25px; background-color: #3399ff">
                                调度设置</td>
                        </tr>
                        <tr>
                            <td style="width: 181px; height: 25px" align="left">
                                选择运营中车次</td>
                            <td align="left" style="width: 192px; height: 25px;">
                                <asp:DropDownList ID="DropDownList3" runat="server"
                                    DataTextField="Carname" DataValueField="Carname" Width="161px" DataSourceID="SqlDataSource3" AutoPostBack="True" OnSelectedIndexChanged="DropDownList3_SelectedIndexChanged1">
                                </asp:DropDownList>&nbsp;
                            </td>
                            <td align="left" style="width: 203px; height: 25px;">
                                </td>
                        </tr>
                        <tr>
                            <td style="width: 181px; height: 25px" align="left">
                                选择停运中车次</td>
                            <td align="left" style="width: 192px; height: 25px;">
                                <asp:DropDownList ID="DropDownList4" runat="server" Width="163px" DataSourceID="SqlDataSource4" DataTextField="Carname" DataValueField="Carname" OnSelectedIndexChanged="DropDownList4_SelectedIndexChanged" AutoPostBack="True">
                                </asp:DropDownList></td>
                            <td align="left" style="width: 203px; height: 25px;">
                                </td>
                        </tr>
                        <tr>
                            <td style="width: 181px; height: 25px" align="left">
                                要运营的车次：</td>
                            <td align="left" style="width: 192px; height: 25px;">
                                <asp:TextBox ID="txttinyun" runat="server" MaxLength="20"></asp:TextBox></td>
                            <td align="left" style="width: 203px; height: 25px;">
                                <asp:LinkButton ID="Linkyunying" runat="server" OnClick="Linkyunying_Click">确定</asp:LinkButton></td>
                        </tr>
                        <tr>
                            <td style="width: 181px; height: 25px" align="left">
                                要停运车次：</td>
                            <td align="left" style="width: 192px; height: 25px;">
                                <asp:TextBox ID="txtyunying" runat="server" Width="149px" MaxLength="20"></asp:TextBox></td>
                            <td style="width: 203px; height: 25px;" align="left">
                                <asp:LinkButton ID="Linktingyun" runat="server" OnClick="Linktingyun_Click">停运</asp:LinkButton></td>
                        </tr>
                    </table>
                </asp:Panel>
              
            </td>
        </tr>
        <tr>
        </tr>
        <tr>
        </tr>
        <tr>
        </tr>
        <tr>
        </tr>
    </table>
    <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
        SelectCommand="SELECT * FROM [Ticket] ORDER BY [Tid]"></asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource2" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
        SelectCommand="SELECT * FROM [Car]"></asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource3" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
        SelectCommand="SELECT * FROM [Car] WHERE ([CType] = @CType)">
        <SelectParameters>
            <asp:Parameter DefaultValue="否" Name="CType" Type="String" />
        </SelectParameters>
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource4" runat="server" ConnectionString="<%$ ConnectionStrings:webSealTicketConnectionString %>"
        SelectCommand="SELECT * FROM [Car] WHERE ([CType] = @CType)">
        <SelectParameters>
            <asp:Parameter DefaultValue="是" Name="CType" Type="String" />
        </SelectParameters>
    </asp:SqlDataSource>
</asp:Content>

