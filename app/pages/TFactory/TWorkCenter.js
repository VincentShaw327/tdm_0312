import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Row, Col, Popover, message, Divider, Popconfirm } from 'antd';
import {fetchWorkcenterList,} from 'actions/process'
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal, UpdateModal } from 'components/TModal';
import { StandardQForm } from 'components/TForm';
import { TPostData, urlBase } from '../../utils/TAjax';
import TWorkCenterDetail from './TWorkCenterDetail';
import PageHeaderLayout from '../../base/PageHeaderLayout';
import auto01 from '../../images/assets/auto01.jpg'

@connect((state, props) => {
    console.log('state',state)
    return{
        Breadcrumb:state.Breadcrumb,
        workcenter: state.workcenter,
    }
},)
export default class TWorkCenter extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            tableDataList: [],
            updateFromItem: {},
            total: 0,
            current: 1,
            pageSize: 10,
            WorkshopUUID: -1,
            TypeUUID: -1,
            UModalShow: false,
            loading: true,
            showDetal: false,
            detailID: 0,
            detailMessage: {},
            workshopList: [],
            WorkCenterTypeList:[]
        }
        this.url = '/api/TProcess/workcenter';
    }

    componentWillMount() {
        // this.getWorkCenterType();
        // this.getWorkShopList();
        // this.getTableList();
        // this.props.dispatch(fetchWorkcenterList({current:1}, (respose) => {}))
    }

    componentDidMount(){
        this.props.dispatch(fetchWorkcenterList({current:1}, (respose) => {}))

    }

    getTableList( que ) {
        const { current, pageSize, keyWord, TypeUUID, WorkshopUUID } = this.state;
        const dat = {
            PageIndex: current - 1, // 分页：页序号，不分页时设为0
            PageSize: pageSize, // 分页：每页记录数，不分页时设为-1
            WorkshopUUID: WorkshopUUID, // 所属车间UUID，不作为查询条件时取值设为-1
            TypeUUID: TypeUUID, // 类型UUID，不作为查询条件时取值设为-1
            // KeyWord :keyWord,
            KeyWord: que ? que.keyWord : '',
        }

        TPostData( this.url, "ListActive", dat,
            ( res ) => {
                var list = [];
                console.log( "查询到工作中心列表", res );
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach( ( item, index ) => {
                    list.push( {
                        key: index,
                        UUID: item.UUID,
                        TypeUUID: item.TypeUUID.toString(),
                        WorkshopUUID: item.WorkshopUUID.toString(),
                        Name: item.Name,
                        ID: item.ID,
                        TypeName: item.TypeName,
                        WorkshopName: item.WorkshopName,
                        Image: item.Image,
                        Note: item.Note,
                        Desc: item.Desc,
                        UpdateDateTime: item.UpdateDateTime,
                        Modifier:Mock.mock('@cname()'),
                        Founder:Mock.mock('@cname()'),
                        CreateTime:Random.datetime(),
                        Status: item.Status
                    } )
                } )
                this.setState( { tableDataList: list, total: totalcount, loading: false } );
            },
            ( error ) => {
                message.info( error );
            }
        )

    }

    getWorkCenterType() {
        /**** 拉取下拉款类型数据 *****/
        TPostData( '/api/TProcess/workcenter_type', 'ListActive', {
                'PageIndex': 0,
                'PageSize': -1,
                'TypeUUID': -1
            },
            ( res ) => {
                console.log( "workcenter_type", res );
                let Ui_list = res.obj.objectlist || [],
                    list = [];
                Ui_list.forEach( ( item, index ) => {
                    list.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } );
                this.setState( { WorkCenterTypeList: list } );
            },
            ( error ) => {
                message.info( error );
                console.log( "查询工作中心类别失败" );
            }
        )
    }

    getWorkShopList() {
        const dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1, //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1, //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID: -1, //类型UUID，不作为查询条件时取值设为-1
            KeyWord: ''
        }

        TPostData( '/api/TFactory/workshop', "ListActive", dat,
            ( res ) => {
                var list = [];
                console.log( "查询到车间列表", res );
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach( function ( item, index ) {
                    list.push( {
                        key: index,
                        value: item.UUID.toString(),
                        FactoryUUID: item.FactoryUUID,
                        TypeUUID: item.TypeUUID,
                        text: item.Name,
                        Number: item.ID,
                        TypeName: item.TypeName, //类别名称
                        Desc: item.Desc,
                        UpdateDateTime: item.UpdateDateTime,
                        Note: item.Note,
                        TypeID: item.TypeID, //类别编号
                    } )
                } )
                this.setState( { workshopList: list } );
            },
            ( error ) => {
                message.info( error );
            }
        )
    }

    toggleRender( record ) {
        this.setState( {
            showDetal: !this.state.showDetal,
            detailID: record.UUID,
            detailMessage: record
        } )
    }

    handleCreat = ( data ) => {
        let dat = {
            ID: data.ID,
            Name: data.Name,
            Path: data.Image,
            TypeUUID: data.TypeUUID,
            WorkshopUUID: data.WorkshopUUID //所属这几ID
        }
        TPostData( this.url, "Add", dat,
            ( res ) => {
                message.success( "创建成功！" );
                this.getTableList();
            },
            ( err ) => {
                message.error( "创建失败！" );
                console.log( 'err', err );
            }
        )
    }

    handleQuery = ( data ) => {
        console.log( "查询的值是:", data );
        const { keyWord, TypeUUID, WorkshopUUID } = data;
        this.setState( { keyWord, TypeUUID, WorkshopUUID, current: 1 }, () => {
            this.getTableList( { keyWord } );
        } );
    }

    handleUpdate = ( data ) => {
        let dat = {
            UUID: this.state.updateFromItem.UUID,
            TypeUUID: data.TypeUUID,
            WorkshopUUID: data.WorkshopUUID,
            Name: data.Name,
            Path: data.Image,
            ID: data.ID,
            Desc: '-',
            Note: data.Note
        }
        TPostData( this.url, "Update", dat,
            ( res ) => {
                message.success( "更新成功！" );
                this.getTableList();
            },
            ( err ) => {
                message.error( "更新失败！" );
                console.log( 'err', err );
            }
        )
    }

    handleDelete = ( data ) => {
        var dat = {
            UUID: data.UUID,
        }
        // console.log("看看data",data);
        TPostData( this.url, "Inactive", dat,
            ( res ) => {
                message.success( "删除成功！" );
                this.getTableList();
            },
            ( err ) => {
                message.error( "删除失败！" );
                console.log( 'err', err );
            }
        )
    }

    handleTableChange = ( pagination ) => {
        // console.log('pagination',pagination);
        const { current, pageSize } = pagination;
        this.setState( { current, pageSize, loading: true }, () => {
            this.getTableList();
        } );
    }

    toggleUModalShow = ( record ) => {
        this.setState( { UModalShow: !this.state.UModalShow, updateFromItem: record } );
    }

    render() {
        const {Breadcrumb}=this.props;
        // let Feature=this.feature;
        const {
            showDetal,
            detailID,
            detailMessage,
            tableDataList,
            // loading,
            WorkCenterTypeList,
            workshopList,
            current,
            // total,
            pageSize,
            updateFromItem,
            UModalShow
        } = this.state;
        const {workcenterList,total,loading}=this.props.workcenter;
        const { detail } = this.props;

        let Data = {
            // list: tableDataList,
            list: workcenterList,
            pagination: { total, current, pageSize }
        };

        const Tcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
                title: '图片',
                dataIndex: 'Image',
                render: ( e, record ) => {
                    // console.log('图片地址',e);
                    const content = (
                        <div>
                          <img width="300"
                            // src={urlBase+e}
                            src={auto01}
                            alt="这是工作中心图片"/>
                        </div>
                    );
                    return (
                        <Popover placement="right"  content={content} trigger="hover">
                          {/* <Button>Right</Button> */}
                          {/* <img height='30' src={auto01}/> */}
                          <img height='50'
                            // src={urlBase+e}
                            src={auto01}
                          />
                        </Popover>
                    )
                }
            },
            {
                title: '名称',
                dataIndex: 'Name',
                type: 'string'
                // 车间描述,备注,
            }, {
                title: '编号',
                dataIndex: 'ID',
                type: 'string'
                // 车间描述,备注,
            }, {
                title: '类型',
                dataIndex: 'TypeName',
                type: 'string'
            }, {
                title: '所属车间',
                dataIndex: 'WorkshopName',
                type: 'string'
            },{
                title: '创建人',
                dataIndex: 'Founder',
                type: 'string'
            },
            {
                title: '创建时间',
                dataIndex: 'CreateTime',
                type: 'string'
            },
            /*{
                           title: '描述',
                           dataIndex: 'Desc',
                           type: 'string'
                       },*/
            {
                title: '备注',
                dataIndex: 'Note',
                type: 'string'
            },
            /*{
                            title: '修改时间',
                            dataIndex: 'UpdateDateTime',
                            type: 'string',
                        },*/
            {
                title: '操作',
                dataIndex: 'Status',
                width: '10%',
                type: 'operate', // 操作的类型必须为 operate
                render: ( txt, record ) => {
                    var path = {
                        pathname: '/TWorkCenterDetail',
                        state: {
                            UUID: record.UUID
                        }
                    }
                    return <span>
                        <a onClick={this.toggleUModalShow.bind(this,record)}>编辑</a>
                        <Divider type="vertical"/>
                        <Popconfirm
                            placement="topRight"
                            title="确定删除此项数据？"
                            onConfirm={this.handleDelete.bind(this,record)}
                            okText="确定" cancelText="取消">
                            <a href="#">删除</a>
                        </Popconfirm>
                        <Divider type="vertical"/>
                        <a href="javascript:void 0;" onClick={this.toggleRender.bind(this,record)}>
                            {/* <Icon type="profile" /> */}
                            详情
                        </a>
                    </span>
                }
            }
        ];
        //更新弹框数据项
        const UFormItem = [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '修改名称时必填',
                rules: [ { required: true, message: '名称不能为空' } ]
            },
            {
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '修改编号时必填',
                rules: [ { required: true, min: 1, message: '编号不能为空' } ]
            },
            {
                name: 'TypeUUID',
                label: '中心类型',
                type: 'select',
                options: WorkCenterTypeList
            },
            {
                name: 'WorkshopUUID',
                label: '车间',
                type: 'select',
                options: workshopList
            },
            /* {
                name: 'Desc',
                label: '描述',
                type: 'string',
                placeholder: '修改描述时必填'
            }, */
            {
                name: 'Note',
                label: '备注',
                type: 'string',
                placeholder: '其它',
            },
            {
                name: 'Image',
                label: '图片',
                type: 'antUpload',
                url: '/api/tupload/do',
            }
        ];
        // 可设置的查询字段
        const CFormItem = [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入名称',
                rules: [ { required: true, min: 1, message: '名称不能为空' } ]
            }, {
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '请输入编号',
                rules: [ { required: true, message: '编号不能为空' } ]
            }, {
                name: 'TypeUUID',
                label: '中心类型',
                type: 'select',
                // defaultValue: '1',
                rules: [ { required: true, message: '请选择工作中心类型' } ],
                options: WorkCenterTypeList
            }, {
                name: 'WorkshopUUID',
                label: '车间',
                type: 'select',
                // defaultValue: '1',
                rules: [ { required: true, message: '请选择所属车间' } ],
                options: workshopList
            },
            {
                name: 'Image',
                label: '图片',
                type: 'antUpload',
                url: '/api/tupload/do',
            }
        ];
        //查询的数据项
        const RFormItem = [
            {
                name: 'KeyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
            }, {
                name: 'TypeUUID',
                label: '中心类型',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 200,
                options: WorkCenterTypeList
            }, {
                name: 'WorkshopUUID',
                label: '车间',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 180,
                options: workshopList
            }
        ];

        const WorkCenterDetail = (
            <div className="cardContent">
                {/* <div>
                    <Breadcrumb style={{display:"inline-block"}}>
                        <Breadcrumb.Item>
                            <a onClick={this.toggleRender.bind(this)} href="#">工作中心</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>工作中心详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <span onClick={this.toggleRender.bind(this)} className="backup-button">
                        <Icon type="rollback" />
                    </span>
                </div> */}
                <TWorkCenterDetail detailMessage={detailMessage} workcenterUUID={detailID}/>
            </div>
        );

        const WorkCenterList = (
            <div className="cardContent">
                {/* <Feature/> */}
                {/* SimpleQForm */}
                <StandardQForm
                    FormItem={RFormItem}
                    submit={this.handleQuery}
                    />
                <CreateModal
                    FormItem={CFormItem}
                    submit={this.handleCreat.bind(this)}
                />
                <SimpleTable
                    size="middle"
                    loading={loading}
                    data={Data}
                    columns={Tcolumns}
                    isHaveSelect={false}
                    onChange={this.handleTableChange}
                />
                <UpdateModal
                    FormItem={UFormItem}
                    updateItem={updateFromItem}
                    submit={this.handleUpdate.bind(this)}
                    showModal={UModalShow}
                    hideModal={this.toggleUModalShow}
                />
            </div>
        );
        const bcList11 = [ {
            title: "首页",
            href: '/',
          }, {
            title: '车间管理',
            href: '/',
          }, {
            title: '工作中心',
          } ];

        const HeadAction = (
            // <span onClick={this.toggleRender.bind(this)} className="backup-button">
            //     <Icon type="rollback" />
            // </span>
            <Button onClick={this.toggleRender.bind(this)} type="primary" icon="rollback">返回</Button>
        );

        const HeadContent = (
            <div style={{height:100}}>
                <Row  type="flex" justify="start" align="middle">
                    <Col span={5}><img style={{maxHeight:100}} src={urlBase+detailMessage.Image}/></Col>
                    <Col span={6}>
                        <div style={{
                                fontSize:16,
                                display:'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 100}}>
                            <p>名称：<span>{detailMessage.Name}</span></p>
                            <p>编号：<span>{detailMessage.ID}</span></p>
                        </div>
                    </Col>
                    <Col>
                        <div style={{
                                fontSize:16,
                                display:'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 100}}>
                            <p>类型：<span>{detailMessage.TypeName}</span></p>
                            <p>所属车间：{detailMessage.WorkshopName}</p>
                            {/* <p>备注：{detailMessage.Note}</p> */}
                        </div>
                    </Col>
                </Row>
            </div>
        );

        // return showDetal?WorkCenterDetail:WorkCenterList;
        return (
            <PageHeaderLayout
                title={showDetal?"工作中心详情":"工作中心"}
                action={showDetal?HeadAction:''}
                content={showDetal?HeadContent:''}
                wrapperClassName="pageContent"
                BreadcrumbList={Breadcrumb.BCList}>
                    {/* <TWorkCenter/> */}
                    {showDetal?WorkCenterDetail:WorkCenterList}
            </PageHeaderLayout>
        );
    }
}
