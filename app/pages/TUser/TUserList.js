/**
 *这是用户列表页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory, Link } from 'react-router';
import { Button, Icon, Popover,message,Breadcrumb,Table,Card,Row,Col,Select,Input,Popconfirm  } from 'antd';
import MD5 from 'components/TCommon/md5';
import { fetchUserAccountList } from 'actions/user';
import { TPostData,urlBase } from 'utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import TUserDetails from './TUserDetails';
import PageHeaderLayout from '../../base/PageHeaderLayout';
import pic from 'images/user01.jpg'

@connect( ( state, props ) => {
    console.log( 'state', state )
    return {
        Breadcrumb:state.Breadcrumb,
        UserAccount: state.UserAccount,
    }
}, )
export default class TUserList extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            tableDataList:[],
            updateFromItem:{},
            total:0,
            current:1,
            pageSize:10,
            UModalShow:false,
            loading:true,
            keyWord:'',
            showDetal:false,
            detailID:0,
            detailMessage:{},
        }
        this.url= '/api/TUser/account';
    }

    componentWillMount(){
        // this.getTableList();
        this.props.dispatch( fetchUserAccountList( { current: 1 }, ( respose ) => {} ) )
    }

    getTableList(){
        const {current,pageSize,keyWord }=this.state;
        var dat = {
            PageIndex : current-1,//分页：页序号，不分页时设为0
            PageSize:pageSize,
            KeyWord: keyWord
        }

        TPostData(this.url, "ListActive", dat,
            ( res )=> {
                console.log("查询到用户列表：",res);
                let list = [],
                    Ui_list = res.obj.objectlist || [],
                    totalcount = res.obj.totalcount;

                Ui_list.forEach(
                    ( item, index )=> {
                        list.push( {
                            key: index,
                            Name: item.Name,
                            ID: item.ID,
                            Email: item.Email,
                            UUID: item.UUID,
                            Phone: item.Phone,
                            Image: item.Image,
                            Desc: item.Desc,
                            LoginName: item.LoginName,
                            Mobile: item.Mobile,
                            ActiveDateTime:item.ActiveDateTime,
                            InactiveDateTime:item.InactiveDateTime,
                            Note: item.Note
                        } )
                    }
                )
                this.setState({ tableDataList: list, total: totalcount, loading: false });
            },
            ( error )=> {
                message.info( error );
            }
        )

    }

    getProModelList(){
        TPostData( '/api/TProduct/product_model', 'ListActive',
            {
                'PageIndex': 0,
                'PageSize': -1,
                "TypeUUID": -1,
                "KeyWord": ""
            },
            ( res )=> {
                console.log("获取到产品型号：",res);
                var Ui_list = res.obj.objectlist || [];
                let list=[];
                Ui_list.forEach( function ( item, index ) {
                    list.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } );
                this.setState({ProModelList:list});
            },
            ( error )=>{
                message.info( error );
            }
        )
    }

    handleCreat(data){
        // console.log('data',data);
        let password = MD5( data.Password );
        let dat = {
            LoginName: data.LoginName,
            Password: password,
            ID: "-",
            Path:data.Image
        }
        TPostData( this.url, "Add", dat,
            ( res )=> {
                message.success("创建成功！");
                this.getTableList();
            } ,
            ( res )=> {
                message.error("创建失败！");
            }
        )
    }

    handleDelete=(data)=>{
        var dat = {
            UUID: data.UUID,
        }
        // console.log("看看data",data);
        TPostData( this.url, "Inactive", dat,
            ( res )=> {
                message.success("删除成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("删除失败！");
                console.log('err',err);
            }
        )
    }

    handleUpdate(data){
        const {updateFromItem}=this.state;

        let dat = {
            UUID: updateFromItem.UUID,
            ID: '-',
            Name: data.Name,
            Email: data.Email,
            Mobile: data.Mobile,
            Phone: data.Phone,
            Path:data.Image,
            Desc: data.Desc,
            Note: data.Note
        }
        console.log("update",dat)
        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("编辑成功！");
                this.getTableList();
            },
            ( res )=> {
                message.error("编辑失败！");
            }
        )
    }

    handleQuery=(data)=>{
        const {keyWord}=data;
        this.setState({keyWord},()=>{
            this.getTableList();
        });
    }

    handleTableChange=(pagination)=>{
        // console.log('pagination',pagination);
        const {current,pageSize}=pagination;
        this.setState({current,pageSize,loading:true},()=>{
            this.getTableList();
        });
    }

    toggleRender(record){
        // console.log("toggleRender",record);
        this.setState({
            showDetal:!this.state.showDetal,
            detailID:record.UUID,
            detailMessage:record
        })
    }

    toggleUModalShow=(record)=>{
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }

    render() {
        const {detail}=this.props;
        const {
            tableDataList,
            ProModelList,
            // loading,
            current,
            // total,
            pageSize,
            updateFromItem,
            UModalShow,
            showDetal,
            detailID,
            detailMessage
        } = this.state;
        const {Breadcrumb}=this.props;
        const { list, total, loading } = this.props.UserAccount;
        let Data={
            // list:tableDataList,
            list:list,
            pagination:{total,current,pageSize}
        };

        const Tcolumns= [
            {
                title: '用户头像',
                dataIndex: 'Image',
                render: ( e, record ) => {
                    // console.log('图片地址',e);
                    const content = (
                        <div>
                          <img width="300"
                            // src={urlBase+e}
                            src={pic}
                          />
                        </div>
                    );
                    return (
                        <Popover placement="right"  content={content} trigger="hover">
                          {/* <Button>Right</Button> */}
                          <img
                            height='50'
                            // src={urlBase+e}
                            src={pic}
                          />
                        </Popover>
                    )
                }
            },
            {
                title: '用户名',
                dataIndex: 'Name',
                type: 'string'
            },
            {
                title: '登录名',
                dataIndex: 'LoginName',
                type: 'string',
            },
            {
                title: '邮箱',
                dataIndex: 'Email',
                type: 'string',
            },
            {
                title: '手机号',
                dataIndex: 'Mobile',
                type: 'string'
            },
            {
                title: '电话',
                dataIndex: 'Phone',
                type: 'string'
            },
            {
                title: '用户启用时间',
                dataIndex: 'ActiveDateTime',
                type: 'string'
            },
            /*{
                title: '用户冻结时间',
                dataIndex: 'InactiveDateTime',
                type: 'string'
            },*/
            {
                title: '备注',
                dataIndex: 'Note',
                type: 'string'
            },
            {
                title: '操作',
                dataIndex: 'UUID',
                render: (UUID, record) => {
                    const {editable} = record;
                    return (
                        <div className="editable-row-operations">
                            <a onClick={() => this.toggleUModalShow(record)}>编辑</a>
                            <span className="ant-divider"></span>
                            <Popconfirm title="确定要删除?" onConfirm={() => this.handleDelete(record)}>
                                    <a>删除</a>
                            </Popconfirm>
                            <span className="ant-divider"></span>
                            <a onClick={this.toggleRender.bind(this,record)}>详情</a>
                    </div>);
                }
            }
        ];

        const UFormItem= [
             {
                name: 'Name',
                label: '用户名',
                type: 'string',
                placeholder: '请输入名字',
                rules: [{required: true,message: '用户名不能为空'}]
            },/*  {
                name: 'LoginName',
                label: '登录名',
                type: 'string',
                placeholder: '请输入名字',
                rules: [{required: true,message: '登录名不能为空'}]
            }, */ {
                name: 'Email',
                label: '邮箱',
                type: 'string',
                placeholder: '请输入Emial',
                rules: [{required: true,message: '邮箱不能为空'}]
            }, {
                name: 'Mobile',
                label: '手机号',
                type: 'string',
                placeholder: '请输入手机号码',
                rules: [{required: true,message: '手机号不能为空'}]
            }, {
                name: 'Phone',
                label: '电话',
                type: 'string',
                placeholder: '请输入电话',
                rules: [{required: true,message: '电话不能为空'}]
            }, {
                name: 'Note',
                label: '备注',
                type: 'string',
                placeholder: '请输入备注',
            },/*{
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '输入需要更改的ID',
            }, {
                name: 'Desc',
                label: '描述',
                type: 'string',
                placeholder: '请输入描述',
            },*/{
                name: 'Image',
                label: '图片',
                type: 'antUpload',
                url: '/api/tupload/do',
            }
        ];

        const CFormItem= [
             {
                name: 'LoginName',
                label: '登录名',
                type: 'string',
                placeholder: '请输入登录名',
                rules: [{required: true,message: '登录名不能为空'}]
            }, {
                name: 'Password',
                label: '密码',
                type: 'string',
                placeholder: '请输入密码',
                rules: [{required: true,message: '密码不能为空'}]
            },/*{
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '请输入用户编号',
                rules: [{required: true,message: '编号至少为 1 个字符'}]
            }*/
            {
                name: 'Image',
                label: '图片',
                type: 'antUpload',
                url: '/api/tupload/do',
            }
        ];

        const RFormItem= [
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
            }
        ];

        const UserDetail=(
            <div className="cardContent">
                {/* <div>
                    <Breadcrumb style={{display:"inline-block"}}>
                        <Breadcrumb.Item>
                            <a onClick={this.toggleRender.bind(this)} href="#">BOM管理</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>用户详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <span onClick={this.toggleRender.bind(this)} className="backup-button">
                        <Icon type="rollback" />
                    </span>
                </div> */}
                <TUserDetails detailMessage={detailMessage} UUID={detailID}/>
            </div>
        );
        const UserListTable=(
            <div className="cardContent">
                {/* <SimpleQForm
                    FormItem={RFormItem}
                    submit={this.handleQuery}
                    /> */}
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

        const bcList11 = [{
          title:"首页",
          href: '/',
          }, {
          title: '系统设置',
          href: '/',
          }, {
          title: '用户列表',
          }];

        const HeadAction=(
                // <span onClick={this.toggleRender.bind(this)} className="backup-button">
                //     <Icon type="rollback" />返回
                // </span>
                <Button onClick={this.toggleRender.bind(this)} type="primary" icon="rollback">返回</Button>
            );

        const HeadContent=(
            <div style={{marginTop:25,height:100}}>
                    {/* <img height='50' src={urlBase+detailMessage.Image}/>avatarPic */}
                <Row>
                    <Col span={5}>
                        <div style={{
                                fontSize:16,
                                display:'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 100}}>
                            <img style={{height:'100%'}} src={urlBase+detailMessage.Image}/>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{
                                fontSize:16,
                                display:'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 100}}>
                            <p>用户名：<span>{detailMessage.Name}</span></p>
                            <p>手机号：<span>{detailMessage.Mobile}</span></p>
                            <p>电话：<span>{detailMessage.Phone}</span></p>
                        </div>
                    </Col>
                    <Col>
                        <div style={{
                                fontSize:16,
                                display:'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 100}}>
                            <p>职称：车间主任</p>
                            <p>账户启用时间：{detailMessage.ActiveDateTime}</p>
                            <p>备注：{detailMessage.Note}</p>
                        </div>
                    </Col>
                </Row>
            </div>
        );

        // return  showDetal?UserDetail:UserListTable
        return(
            <PageHeaderLayout
                title={showDetal?"工作中心详情":"工作中心"}
                action={showDetal?HeadAction:''}
                content={showDetal?HeadContent:''}
                wrapperClassName="pageContent"
                BreadcrumbList={bcList11}>
                    {/* <TWorkCenter/> */}
                    {showDetal?UserDetail:UserListTable}
            </PageHeaderLayout>
        );
    }
}
