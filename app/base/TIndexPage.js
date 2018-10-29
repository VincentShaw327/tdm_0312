import React, { Fragment }  from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Layout, Menu, Icon,Switch } from 'antd';
import { hashHistory,History , Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { updateTabList } from 'actions/tabList';
import { updateBreadcrumbList } from 'actions/common';
import TFooter from './TFooter';
import GlobalFooter from 'components/ant-design-pro/GlobalFooter';
import THeader from './Header/THeader';
import TTabMain from './TTabMain';
import PageHeaderLayout from './PageHeaderLayout';
import { TPostData } from 'utils/ajax';
import LOGO from '../images/SCLOGO1.png';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


@connect((state, props) => ({
  config: state.config,
  tabListResult:state.tabListResult,
}))
export default class TIndexPage extends React.Component {

    constructor( props ) {
        super( props );
        this.state={
            siderTheme:false,
            minHeight:0,
            maxHeight:0,
        }
    }

    componentWillMount(){ }

    componentDidMount(){
        this.setState({maxHeight:innerHeight-64,minHeight:innerHeight-64});
        window.onresize=(e)=>{
            // console.log('e',e);
            // console.log("innerHeight",innerHeight);
            this.setState({
                maxHeight:innerHeight-64,
                minHeight:innerHeight-64})
        }
    }

    // 调用子组件方法获取孩子名字
    THandleClick = ( e,key,keyPath ) => {
        console.log("TPageOpen( e.key )",e,key,keyPath)
        hashHistory.push(e.key)
        // this._child.TPageOpen( e.key );
        // this._child.TPageOpen1( e.item.props );
        this.props.dispatch(updateTabList({ title: e.item.props.name, content: '', key: e.key }))
        this.props.dispatch(updateBreadcrumbList({ title: e.item.props.name,href:e.key }))

    }

    handleScroll(e){
        console.log("Scroll",e);
    }

    toggleTheme(value){
        this.setState({siderTheme:value});
    }

    // 二级菜单的生成
    renderLeftNav(options) {
      const self = this
      return options.map((item, index) => {
        if (!item.children) {
          return (
            // <SubMenu key={index} title={item.name}>
            <Menu.Item key={item.key ? item.key : item.url} name={item.name}>
                {item.icon?<Icon type={item.icon} title={item.name} />:''}
              <span
                  className="menu-name"
                  >{item.name}</span>
            </Menu.Item>
            // </SubMenu>
          )
        }
        return (
          // <SubMenu key={`sub${index}`}
          <SubMenu key={item.key ? item.key : item.url}
            title={
              <span>
                <Icon type={item.icon} title={item.name} />
                <span className="menu-name">{item.name}</span>
              </span>}
          >
            {
              // item.url ?
                // <Menu.Item key={item.key ? item.key : item.url} name={item.name}>
                //   {/* <Icon type={item.icon} title={item.name} /> */}
                //   {/* <span className="menu-name">{item.name}</span> */}
                //   {item.name}
                // </Menu.Item> : null
            }

            {
              item.children && item.children.length > 0 ? self.renderLeftNav(item.children) : null
            }
          </SubMenu>
        )
      })
    }

    render() {
        const { children } = this.props
        return (
            <Layout style={{height:"100%"}}>
                <THeader handleSearch={this._child}  />
                <Layout>
                      <Sider
                        breakpoint="md"
                        collapsedWidth="0"
                        onCollapse={(collapsed, type) => { console.log(collapsed, type); }}>
                        {/* <div style={{background: `url(${LOGO})`,backgroundSize:'200px 85px',height:96}}></div> */}
                        <Scrollbars
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            autoHeight
                            autoHeightMin={500}
                            autoHeightMax={this.state.maxHeight}
                            thumbMinSize={30}
                            universal={true}
                            >
                            <Menu
                                theme="light"
                                mode="inline"
                                defaultSelectedKeys={['4']}
                                onClick={this.THandleClick}>

                                {this.renderLeftNav(this.props.config.nav || [])}
                              {/* <Menu.Item key="THome">
                                <Icon type="home" />
                                <span className="nav-text">系统首页</span>
                              </Menu.Item> */}

                              {/* <SubMenu
                                    key="TOrg_Structure"
                                    title={<span><Icon type="org-structure" /><span>组织架构</span></span>}
                                  >
                                    <Menu.Item key="TOrg_company">公司信息</Menu.Item>
                                    <Menu.Item key="TOrg_factory">工厂信息</Menu.Item>
                                    <Menu.Item key="TOrg_workshop">车间信息</Menu.Item>
                                    <Menu.Item key="TOrg_department">部门信息</Menu.Item>
                                    <Menu.Item key="TOrg_staff">员工信息</Menu.Item>
                                    <Menu.Item key="TOrg_region">区域信息</Menu.Item>
                                    <Menu.Item key="TOrg_post">岗位信息</Menu.Item>
                                    <Menu.Item key="TOrg_LogicalFactory">逻辑工厂</Menu.Item>
                                    <Menu.Item key="TOrg_WorkCenter">工作中心</Menu.Item>
                              </SubMenu> */}

                              {/* 基础数据 */}
                              {/* <SubMenu
                                    key="TBasic_Data"
                                    title={<span><Icon type="basic-data"/><span>基础数据</span></span>}
                                  >
                                    <Menu.Item key="TBas_Type_Factory">工厂类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_Workshop">车间类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_Area">区域类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_Mtrl">物料类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_Dev">设备类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_WorkCenter">工作中心类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_Alarm">告警类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_Mold">模具类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_Rejects">不良品类别</Menu.Item>
                                    <Menu.Item key="TBas_Type_WorkOrder">派工单类别</Menu.Item>
                                    <Menu.Item key="TBas_Mtrl">物料信息</Menu.Item>
                                    <Menu.Item key="TBas_Classes">班次信息</Menu.Item>
                                    <Menu.Item key="TBas_Line">生产线维护</Menu.Item>
                                    <Menu.Item key="TBas_Date_Line">产线日历</Menu.Item>
                                    <Menu.Item key="TBas_ClassGroup">班组维护</Menu.Item>
                                    <Menu.Item key="TBas_TimeSlot">时间段维护</Menu.Item>
                                    <Menu.Item key="TBas_Date_Workshop">车间日历</Menu.Item>
                              </SubMenu> */}

                              {/* <SubMenu
                                    key="TScada"
                                    title={<span><Icon type="monitor" /><span>车间监控</span></span>}
                                  >
                                    <Menu.Item key="scada1">自动化装配车间一</Menu.Item>
                                    <Menu.Item key="scada2">自动化装配车间二</Menu.Item>
                                    <Menu.Item key="scada3">注塑车间</Menu.Item>
                                    <Menu.Item key="scada4">冲压车间</Menu.Item>
                              </SubMenu> */}

                              {/* 生产管理 */}
                              {/* <SubMenu
                                    key="TManufacture"
                                    title={<span><Icon type="pro-mg" /><span>生产管理</span></span>}
                                  >
                                    <Menu.Item key="TManufactureOrder">订单管理</Menu.Item>
                                    <Menu.Item key="manufacture_task">订单排程</Menu.Item>
                                    <Menu.Item key="task_dispatch">生产派工</Menu.Item>
                                    <Menu.Item key="task_monitor">工单生产监控</Menu.Item>
                                    <Menu.Item key="ProductionReport">生产报表</Menu.Item>
                                    <Menu.Item key="materialReq">物料需求计划</Menu.Item>
                              </SubMenu> */}

                              {/* 条码管理 */}
                              {/* <SubMenu
                                    key="TBarcode_Management"
                                    title={<span>
                                        <Icon type="barcode" /><span>条码管理</span></span>}>
                                    <Menu.Item key="TBarcode_Type">规则类别维护</Menu.Item>
                                    <Menu.Item key="TBarcode_Rules">条码规则维护</Menu.Item>
                                    <Menu.Item key="TBarcode_Printing">条码功能打印</Menu.Item>
                              </SubMenu> */}

                              {/* 质量管理 */}
                              {/* <SubMenu
                                    key="TQuality_Management"
                                    title={
                                        <span>
                                            <Icon type="quality-assurance" />
                                            <span>质量管理</span>
                                        </span>
                                    }
                                    >
                                    <SubMenu key="TQM_BasicData" title={"主数据"} >
                                        <Menu.Item key="TQMB_DefectGrade">缺陷等级</Menu.Item>
                                        <Menu.Item key="TQMB_Type_Duty">责任类型</Menu.Item>
                                        <Menu.Item key="TQMB_DefectAttr">缺陷属性定义</Menu.Item>
                                        <Menu.Item key="TQM_DefectType">缺陷类型</Menu.Item>
                                        <Menu.Item key="TQM_DefectDefine">缺陷定义</Menu.Item>
                                        <Menu.Item key="TQM_RepairMethod">返修方法</Menu.Item>
                                        <Menu.Item key="TQM_DefectTree">缺陷树</Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="TQM_AnalysisData" title={"统计分析"}>
                                        <Menu.Item key="TQMA_CheckoutRecord">过程检验台账</Menu.Item>
                                        <Menu.Item key="TQMA_DailySheet">质量日报</Menu.Item>
                                        <Menu.Item key="TQMA_MonthSheet">质量月报</Menu.Item>
                                        <Menu.Item key="TQMA_AnalysisData">检验缺陷图形化查询</Menu.Item>
                                        <Menu.Item key="TQMA_DefectFigure">缺陷TOP N分析</Menu.Item>
                                    </SubMenu>
                              </SubMenu> */}

                              {/* 工艺管理 */}
                              {/* <SubMenu
                                    key="TProcess_Management"
                                    title={
                                        <span>
                                            <img
                                                style={{marginRight:6,width:15}}
                                                src={'../images/icon/org_technology.png'}/>
                                            <span>工艺管理</span>
                                        </span>
                                    }
                                    >
                                        <Menu.Item key="TPM_Route">工艺路线管理</Menu.Item>
                                        <Menu.Item key="TPM_Procedure">工序管理</Menu.Item>
                                        <Menu.Item key="TPM_Product">产品管理</Menu.Item>
                                        <Menu.Item key="TPM_Management">工艺管理</Menu.Item>
                                        <Menu.Item key="TPM_Document">文档管理</Menu.Item>
                                    <SubMenu
                                      key="TProcess"
                                      title={<span><Icon type="process-mg" /><span>工艺参数</span></span>}
                                      >
                                      <Menu.Item key="TParameterList"><span>工艺参数列表</span></Menu.Item>
                                      <Menu.Item key="TModifyRecord"><span>参数修改记录</span></Menu.Item>
                                      <Menu.Item key="TParameterScada"><span>工艺参数监控</span></Menu.Item>
                                      <Menu.Item key="TParameterAnalysis"><span>工艺优化分析</span></Menu.Item>
                                    </SubMenu>
                              </SubMenu> */}

                              {/* 物料管理 */}
                              {/* <SubMenu
                                    key="TMateriel_Management"
                                    title={<span><Icon type="materiel-mg" /><span>物料管理</span></span>}
                                    >
                                        <Menu.Item key="TMM_Route">工艺路线管理</Menu.Item>
                                        <Menu.Item key="TMM_Procedure">工序管理</Menu.Item>
                                        <Menu.Item key="TMM_Product">产品管理</Menu.Item>
                                        <Menu.Item key="TMM_Management">工艺管理</Menu.Item>
                                        <Menu.Item key="TMM_Document">文档管理</Menu.Item>
                              </SubMenu> */}

                              {/* 看板管理 */}
                              {/* <SubMenu
                                    key="TBoard_Management"
                                    title={<span><Icon type="dashboard" /><span>看板管理</span></span>}
                                    >
                                        <Menu.Item key="TMM_Route">生产进度看板</Menu.Item>
                                        <Menu.Item key="TMM_Procedure">告警异常看板</Menu.Item>
                                        <Menu.Item key="TMM_Product">品质分析看板</Menu.Item>
                                        <Menu.Item key="TMM_Management">出货计划看板</Menu.Item>
                                        <Menu.Item key="TMM_Document">物料看板</Menu.Item>
                              </SubMenu> */}

                              {/* 仓储管理 */}
                              {/* <SubMenu
                                    key="TWarehouse_Management"
                                    title={<span>
                                    <Icon type="warehouse" /><span>仓储管理</span></span>}
                                    >
                                    <Menu.Item key="TWM_Route">仓库信息</Menu.Item>
                                    <Menu.Item key="TMM_Procedure">申领管理</Menu.Item>
                                    <Menu.Item key="TMM_Product">盘库管理</Menu.Item>
                                    <Menu.Item key="TMM_Management">入库管理</Menu.Item>
                                    <Menu.Item key="TMM_Document">出库管理</Menu.Item>
                              </SubMenu> */}

                              {/* 能耗管理 */}
                              {/* <SubMenu
                                    key="TEnergy_Management"
                                    title={<span>
                                    <Icon type="energy-mg" /><span>能耗管理</span></span>}
                                >
                                        <Menu.Item key="TEM_Route">能耗分析</Menu.Item>
                                        <Menu.Item key="TEM_Procedure">平衡分析</Menu.Item>
                                        <Menu.Item key="TEM_Product">能源趋势预测</Menu.Item>
                                        <Menu.Item key="TEM_Management">成本分析</Menu.Item>
                                        <Menu.Item key="TEM_Document">能源报表</Menu.Item>
                              </SubMenu> */}

                              {/* 设备管理 */}
                              {/* <SubMenu
                                    key="TDevice"
                                    title={<span><Icon type="device-mg" /><span>设备管理</span></span>}
                                  >
                                    <Menu.Item key="TDeviceCategory">设备类别</Menu.Item>
                                    <Menu.Item key="TDeviceModel"><span>设备型号</span></Menu.Item>
                                    <Menu.Item key="TDeviceList">设备台账</Menu.Item>
                                    <Menu.Item key="TDev_Inspection">设备点检</Menu.Item>
                                    <SubMenu
                                          key="TDev_Maintain"
                                          title={
                                              <span>
                                                  <img style={{marginRight:6,width:15}}
                                                      src={'../images/icon/dev_maintain.png'}/>
                                                  <span>设备维保</span>
                                              </span>
                                          }
                                        >
                                          <Menu.Item key="TMt_Plan">
                                              <span>维保方案</span>
                                          </Menu.Item>
                                          <Menu.Item key="TPlan_Bind">
                                              <span>方案绑定</span>
                                          </Menu.Item>
                                          <Menu.Item key="TMt_Task">
                                              <span>维保任务</span>
                                          </Menu.Item>
                                          <Menu.Item key="TMt_analysis">
                                              <span>维保分析</span>
                                          </Menu.Item>
                                    </SubMenu>
                                    <SubMenu
                                          key="TDev_Repair"
                                          title={
                                            <span>
                                                  <img style={{marginRight:6,width:15}}
                                                      src={'../images/icon/dev_repair.png'}/>
                                                <span>设备维修</span>
                                            </span>
                                            }
                                        >
                                          <Menu.Item key="TMt_Plan">
                                              <span>维保方案</span>
                                          </Menu.Item>
                                          <Menu.Item key="TPlan_Bind">
                                              <span>方案绑定</span>
                                          </Menu.Item>
                                          <Menu.Item key="TMt_Task">
                                              <span>维保任务</span>
                                          </Menu.Item>
                                          <Menu.Item key="TMt_analysis">
                                              <span>维保分析</span>
                                          </Menu.Item>
                                    </SubMenu>
                              </SubMenu> */}

                              {/* 报表中心 */}
                              {/* <SubMenu
                                    key="TReport"
                                    title={<span><Icon type="bar-chart" /><span>报表中心</span></span>}
                                  >
                                      <Menu.Item key="dev_state_report">车间状态统计</Menu.Item>
                                      <Menu.Item key="production_tracking">生产追踪</Menu.Item>
                                      <Menu.Item key="production_report">生产报表</Menu.Item>
                                      <Menu.Item key="oee_analysis_report">OEE分析</Menu.Item>
                                      <Menu.Item key="TWarningHistory">报警历史</Menu.Item>
                              </SubMenu> */}

                              {/* 车间管理 */}
                              {/* <SubMenu
                                    key="TWorkshop"
                                    title={<span><Icon type="idcard" /><span>车间管理</span></span>}
                                  >
                                    <Menu.Item key="TWorkShopType">车间类别</Menu.Item>
                                    <Menu.Item key="TWorkShopList">车间列表</Menu.Item>
                                    <Menu.Item key="TWorkCenterType">工作中心类别</Menu.Item>
                                    <Menu.Item key="TWorkCenter">工作中心</Menu.Item>
                              </SubMenu> */}

                              {/* 模具管理 */}
                              {/* <SubMenu
                                    key="TMould"
                                    title={<span><Icon type="mould-mg" /><span>模具管理</span></span>}
                                  >
                                <Menu.Item key="mould_model">模具型号</Menu.Item>
                                <Menu.Item key="mould_list">模具列表</Menu.Item>
                                <Menu.Item key="TMouldCategory">模具类别</Menu.Item>
                                <Menu.Item key="TMouldList_ZS">注塑模具</Menu.Item>
                                <Menu.Item key="TMouldList_CY">冲压模具</Menu.Item>
                                <Menu.Item key="TMouldUserHistory">模具使用</Menu.Item>
                              </SubMenu> */}

                              {/* 生产资源 */}
                              {/* <SubMenu
                                    key="TMaterial"
                                    title={<span><Icon type="shop" /><span>生产物料</span></span>}
                                  >
                                    <Menu.Item key="TBas_Type_Mtrl">物料类别</Menu.Item>
                                    <Menu.Item key="material_model">物料型号</Menu.Item>
                                    <Menu.Item key="product_model">产品型号</Menu.Item>
                                    <Menu.Item key="bom_list">BOM管理</Menu.Item>
                              </SubMenu> */}

                              {/* 产品定义 */}
                              {/* <SubMenu
                                    key="TProduct"
                                    title={<span><Icon type="user" /><span>产品定义</span></span>}
                                  >
                                    <Menu.Item key="TProductCategory">产品类别</Menu.Item>
                                    <Menu.Item key="TProductModel">产品型号</Menu.Item>
                                    <Menu.Item key="TProductList">产品列表</Menu.Item>
                              </SubMenu> */}

                              {/* 报警管理 */}
                              {/* <SubMenu
                                key="TWarning"
                                title={<span><Icon type="user" /><span>报警管理</span></span>}
                                >
                                 <Menu.Item key="TWarningItem">报警内容</Menu.Item>
                                <Menu.Item key="TWarningHistory">
                                    <span>报警历史</span>
                                </Menu.Item>
                              </SubMenu> */}

                              {/* 报表中心 */}
                              {/* <SubMenu
                                    key="TReport"
                                    title={<span><Icon type="bar-chart" /><span>报表中心</span></span>}
                                  >

                                      <Menu.Item key="TTimeStatusReport">车间状态统计</Menu.Item>
                                      <Menu.Item key="TLossTimeReport">生产追踪</Menu.Item>
                                      <Menu.Item key="TProductionReport">生产报表</Menu.Item>
                                      <Menu.Item key="TOEEAnalysis">OEE分析</Menu.Item>
                                      <Menu.Item key="TWarningHistory">报警历史</Menu.Item>
                              </SubMenu> */}

                              {/* 人资管理 */}
                              {/* <SubMenu
                                    key="THRM"
                                    title={<span><Icon type="human-resources" /><span>人资管理</span></span>}
                                  >
                                    <Menu.Item key="TEmployee_Files">
                                        <span>员工档案</span>
                                    </Menu.Item>
                                    <Menu.Item key="TPost_Archives">
                                        <span>岗位档案</span>
                                    </Menu.Item>
                                    <Menu.Item key="TClass_Management">
                                        <span>班次管理</span>
                                    </Menu.Item>
                                    <Menu.Item key="TAttendance_Record">
                                        <span>考勤记录</span>
                                    </Menu.Item>
                                    <Menu.Item key="TWH_Recording">
                                        <span>工时补录</span>
                                    </Menu.Item>
                                    <Menu.Item key="TAppend_Piecework">
                                        <span>计件补录</span>
                                    </Menu.Item>
                                    <Menu.Item key="TEmployee_Timings">
                                        <span>员工计时表</span>
                                    </Menu.Item>
                                    <Menu.Item key="TEmp_PWTable">
                                        <span>员工计件表</span>
                                    </Menu.Item>
                              </SubMenu> */}

                              {/* <SubMenu
                                    key="TSystemSetting"
                                    title={<span><Icon type="setting" /><span>系统设置</span></span>}
                                  >
                                    <Menu.Item key="user_list">用户列表</Menu.Item>
                                    <Menu.Item key="auth_list">权限列表</Menu.Item>
                                    <Menu.Item key="auth_group_list">权限组管理</Menu.Item>
                                    <Menu.Item key="TWarningConfig">
                                        <span>报警配置</span>
                                    </Menu.Item>
                                    <Menu.Item key="TDA_Terminal">终端管理</Menu.Item>
                                    <Menu.Item key="TWorkShopCategory">车间类型</Menu.Item>
                                    <Menu.Item key="TWorkCenterCategory">工作中心类型</Menu.Item>
                              </SubMenu> */}

                              {/* <Menu.Item key="TAboutSupport">
                                <Icon type="tec-support" />
                                <span className="nav-text">技术支持</span>
                              </Menu.Item> */}
                              {/* <Menu.Item key="TDemo">
                                <Icon type="appstore" />
                                <span className="nav-text">组件DEMO</span>
                              </Menu.Item> */}
                            </Menu>
                        </Scrollbars>
                      </Sider>
                    {/* <THeader /> */}
                    <Scrollbars
                      autoHide
                      autoHideTimeout={1000}
                      autoHideDuration={200}
                      autoHeight
                      autoHeightMin={500}
                      // autoHeightMax={560}
                      autoHeightMax={this.state.maxHeight}
                      thumbMinSize={30}
                      universal={true}
                      >
                        <Layout style={{border:'solid 0px' }}>
                            {/* <Content style={{ margin: '24px 16px 0',border:'solid 0px' }}> */}
                            <Content style={{ margin: '0',border:'solid 0px' }}>
                                {/* <div style={{ padding: 24, background: '#fff', minHeight: 360 }}> */}
                                <div style={{ minHeight: 360 }}>
                                    <TTabMain
                                        ref={child => this._child = child}
                                        content ={children}
                                    />
                                    {children}
                                </div>
                                {/* <TFooter /> */}
                            </Content>
                            <Footer style={{ padding: 0 }}>
                                <GlobalFooter
                                    className="globalFooter"
                                /*  links={[{
                                    key: 'Pro 首页',
                                    title: 'Pro 首页',
                                    href: 'http://pro.ant.design',
                                    blankTarget: true,
                                  }, {
                                    key: 'github',
                                    title: <Icon type="github" />,
                                    href: 'https://github.com/ant-design/ant-design-pro',
                                    blankTarget: true,
                                  }, {
                                    key: 'Ant Design',
                                    title: 'Ant Design',
                                    href: 'http://ant.design',
                                    blankTarget: true,
                                  }]}*/
                                  copyright={
                                    <Fragment>
                                      Copyright <Icon type="copyright" />广东拓斯达科技股份有限公司
                                    </Fragment>
                                  }
                                />
                            </Footer>
                        </Layout>
                    </Scrollbars>
                </Layout>
             </Layout>
        );
    }
}

TIndexPage.propTypes = {
};
