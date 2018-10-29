export default (() => {
  window.gconfig = {};
  +(function (global) {
    // 本地开发打开的路径以及端口
    global.linkUrl = 'http://localhost:3001';
    global.iconUrl = 'images/assets/';
    if (process.env.NODE_ENV === 'production') { // 生产环境用不同的接口地址
      global.linkUrl = 'http://localhost:3000';
    }
    global.isDemo_dev=true;
    // 系统一二级菜单
    global.nav = [
      {
        name: '系统主页',
        icon: 'home',
        url: 'THome',
        key: 'THome',
      },
      {
        name: '组织架构',
        // icon: 'org-structure',
        icon: 'sliders',
        url: '',
        key: 'TOrg_Structure',
        children: [
          {
            name: '车间信息', key: 'TOrg_workshop',url:'TOrg_workshop'
          },
          {
            name: '工作中心', key: 'TOrg_WorkCenter',url:'TOrg_WorkCenter'
          },
        ],
      },
      {
        name: '基础数据',
        // icon: 'basic-data',
        icon: 'dot-chart',
        url: '',
        key: 'TBasic_Data',
        children: [
          /*{
            name: '工厂类别', key: 'TBas_Type_Factory',url:'TBas_Type_Factory'
          },*/
          {
            name: '车间类别', key: 'TBas_Type_Workshop',url:'TBas_Type_Workshop'
          },
          {
            name: '物料类别', key: 'TBas_Type_Mtrl',url:'TBas_Type_Mtrl'
          },
          {
            name: '设备类别', key: 'TBas_Type_Dev',url:'TBas_Type_Dev'
          },
          {
            name: '工作中心类别', key: 'TBas_Type_WorkCenter',url:'TBas_Type_WorkCenter'
          },
        ],
      },
      {
        name: '车间监控',
        icon: 'monitor',
        url: '',
        key: 'TScada',
        children: [
          {
            name:'自动化装配车间一', key: 'scada1',url:'scada1'
          },
          {
            name:'自动化装配车间二', key: 'scada2',url:'scada2'
          },
          {
            name:'注塑车间', key: 'scada3',url:'scada3'
          },
          {
            name:'冲压车间', key: 'scada4',url:'scada4'
          },
        ],
      },
      {
        name: '生产管理',
        // icon: 'pro-mg',
        icon: 'notification',
        url: '',
        key: 'TManufacture',
        children: [
          {
            name:'订单排程', key: 'manufacture_task',url:'manufacture_task'
          },
          {
            name:'生产任务', key: 'task_dispatch',url:'task_dispatch'
          },
          {
            name:'工单生产监控', key: 'task_monitor',url:'task_monitor'
          },
          // {
          //   name:'物料需求计划', key: 'materialReq',url:'materialReq'
          // },
        ],
      },
      /*{
        name: '条码管理',
        icon: 'barcode',
        url: '',
        key: 'TBarcode_Management',
        children: [
          {
            name:'规则类别维护', key: 'TBarcode_Type',url:'TBarcode_Type'
          },
          {
            name:'条码规则维护', key: 'TBarcode_Rules',url:'TBarcode_Rules'
          },
          {
            name:'条码功能打印', key: 'TBarcode_Printing',url:'TBarcode_Printing'
          },
        ],
      },
      {
        name: '质量管理',
        icon: 'quality-assurance',
        url: '',
        key: 'TQuality_Management',
        children: [
          {
            name:'主数据', key: 'TQM_BasicData',url:'TQM_BasicData',
            children:[
                {
                    name:'缺陷等级', key: 'TQMB_DefectGrade',url:'TQMB_DefectGrade',
                },
                {
                    name:'责任类型', key: 'TQMB_Type_Duty',url:'TQMB_Type_Duty',
                },
                {
                    name:'缺陷属性定义', key: 'TQMB_DefectAttr',url:'TQMB_DefectAttr',
                },
                {
                    name:'缺陷类型', key: 'TQM_DefectType',url:'TQM_DefectType',
                },
                {
                    name:'返修方法', key: 'TQM_RepairMethod',url:'TQM_RepairMethod',
                },
                {
                    name:'缺陷树', key: 'TQM_DefectTree',url:'TQM_DefectTree',
                },
            ]
          },
          {
            name:'统计分析', key: 'TQM_AnalysisData',url:'',
            children:[
                {
                    name:'过程检验台账', key: 'TQMA_CheckoutRecord',url:'TQMA_CheckoutRecord',
                },
                {
                    name:'质量日报', key: 'TQMA_DailySheet',url:'TQMA_DailySheet',
                },
                {
                    name:'质量月报', key: 'TQMA_MonthSheet',url:'TQMA_MonthSheet',
                },
                {
                    name:'检验缺陷图形化查询', key: 'TQMA_AnalysisData',url:'TQMA_AnalysisData',
                },
                {
                    name:'缺陷TOP N分析', key: 'TQMA_DefectFigure',url:'TQMA_DefectFigure',
                },
            ]
          },
        ],
      },*/
      {
        name: '工艺管理',
        // icon: 'quality-assurance',
        icon: 'share-alt',
        url: '',
        key: 'TProcessManagement',
        children: [
          {
            name:'工序管理', key: 'process',url:'pm_management',
          },
          {
            name:'工艺管理', key: 'crafts',url:'TPM_Procedure',
          },
          /*{
            name:'工艺路线管理', key: 'TPM_Route',url:'TPM_Route',
          },
          {
            name:'产品管理', key: 'TPM_Product',url:'TPM_Product',
          },
          {
            name:'文档管理', key: 'TPM_Document',url:'TPM_Document',
          },
          {
            name:'工艺参数', key: 'TProcess',url:'',
            children:[
                {
                    name:'过程检验台账', key: 'TQMA_CheckoutRecord',url:'TQMA_CheckoutRecord',
                },

            ]
          },*/
        ],
      },
      {
        name: '设备管理',
        // icon: 'device-mg',
        icon: 'tablet',
        url: '',
        key: 'TDevice',
        children: [
          /*{
            name:'设备类别', key: 'TDeviceCategory',url:'TDeviceCategory',
          },*/
          {
            name:'设备型号', key: 'TDeviceModel',url:'TDeviceModel',
          },
          {
            name:'设备列表', key: 'TDeviceList',url:'TDeviceList',
          },
          /*{
            name:'设备维保', key: 'TDev_Maintain',url:'',
            children:[
                {
                    name:'维保方案', key: 'TMt_Plan',url:'TMt_Plan',
                },
                {
                    name:'方案绑定', key: 'TPlan_Bind',url:'TPlan_Bind',
                },
                {
                    name:'维保任务', key: 'TMt_Task',url:'TMt_Task',
                },
                {
                    name:'维保分析', key: 'TMt_analysis',url:'TMt_analysis',
                },

            ]
          },*/
        ],
      },
      {
        name: '模具管理',
        // icon: 'mould-mg',
        icon: 'inbox',
        url: '',
        key: 'TMould',
        children: [
          {
            name:'模具型号', key: 'mould_model',url:'mould_model',
          },
          {
            name:'模具列表', key: 'mould_list',url:'mould_list',
          },
        ],
      },
      {
        name: '报表中心',
        icon: 'bar-chart',
        url: '',
        key: 'TReport',
        children: [
          {
            name:'车间状态', key: 'dev_state_report',url:'dev_state_report',
          },
          {
            name:'生产追踪', key: 'production_tracking',url:'production_tracking',
          },
          {
            name:'生产报表', key: 'production_report',url:'production_report',
          },
          {
            name:'OEE报表', key: 'oee_analysis_report',url:'oee_analysis_report',
          },
        ],
      },
      {
        name: '系统设置',
        icon: 'setting',
        url: '',
        key: 'TSystemSetting',
        children: [
          {
            name:'用户列表', key: 'user_list',url:'user_list',
          },
          {
            name:'权限列表', key: 'auth_list',url:'auth_list',
          },
          {
            name:'权限组', key: 'auth_group_list',url:'auth_group_list',
          },
        ],
      },
    ];
  }(window.gconfig));
})()

export const prefix = global.gconfig.linkUrl
export const suffix = '.json'
