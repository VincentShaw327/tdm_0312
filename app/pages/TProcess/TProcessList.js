/**
 *这是工藝列表页
 *添加日期:2018.09.27
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory, Link } from 'react-router'
import { Table, Menu, Icon, Badge, Dropdown,message,Divider,Popconfirm } from 'antd';
import { fetchDeviceTypeList } from 'actions/device'
import { fetchProcessList } from 'actions/process'
import { TPostData } from 'utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import PageHeaderLayout from '../../base/PageHeaderLayout';

@connect( ( state, props ) => {
    console.log( 'state', state )
    return {
        Breadcrumb:state.Breadcrumb,
        process: state.process,
    }
}, )
export default class TDeviceType extends Component {

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
        }
        this.url='/api/TDevice/device_type';
    }

    componentWillMount(){
        // this.getTableList();
        this.props.dispatch( fetchProcessList( { current: 1 }, ( respose ) => {} ) )
    }

    getTableList(que){
        const {current,pageSize}=this.state;
        const dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,   //分页：每页记录数，不分页时设为-1
            ParentUUID : -1,
            // FactoryUUID: -1,    //所属工厂UUID，不作为查询条件时取值设为-1
            // TypeUUID: que?que.TypeUUID:-1,  //类型UUID，不作为查询条件时取值设为-1
            KeyWord : que?que.keyWord:''
        }

        TPostData( this.url, "ListActive", dat,
            (res) => {
                var list = [];
                console.log("查询到设备类别列表", res);
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach((item, index) => {
                    list.push({
                        key: index,
                        Desc: item.Desc,
                        Name: item.Name,
                        ID: item.ID,
                        Note: item.Note,
                        ParentUUID: item.ParentUUID,
                        Status: item.Status,
                        UUID: item.UUID,
                        UpdateDateTime: item.UpdateDateTime
                    })
                });

                this.setState({ tableDataList: list, total: totalcount, loading: false });
            },
            ( error )=> {
              message.info( error );
            }
        )

    }

    handleCreat=(data)=>{
        let dat = {
            Name : data.Name,
            ParentUUID : 0,
            ID : "-",
        }
        TPostData( this.url, "Add", dat,
            ( res )=> {
                message.success("创建成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("创建失败！");
                console.log('err',err);
            }
        )
    }

    handleQuery=(data)=>{
        console.log("查询的值是:",data);
        const {keyWord,TypeUUID}=data;
        // this.setState({keyWord,TypeUUID});
        this.getTableList({keyWord});
    }

    handleUpdate=(data)=>{
        let dat = {
            UUID: data.UUID,
            ParentUUID : 0,
            Name: data.Name,
            Desc: data.Desc,
            ID: "-",
            Note: "-"
        }

        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("更新成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("更新失败！");
                console.log('err',err);
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

    handleTableChange=(pagination)=>{
        // console.log('pagination',pagination);
        const {current,pageSize}=pagination;
        this.setState({current,pageSize,loading:true},()=>{
            this.getTableList();
        });
    }

    toggleUModalShow=(record)=>{
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }


    render() {
        const {
            wsTypeList,
            tableDataList,
            // loading,
            current,
            // total,
            pageSize,
            updateFromItem,
            UModalShow
        } = this.state;
        const {Breadcrumb}=this.props;
        const { list, total, loading } = this.props.process;
        let Data={
            list:list,
            // list:tableDataList,
            pagination:{total,current,pageSize}
        };

        const Tcolumns= [
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
                title: '工序名称',
                dataIndex: 'Name',
                type: 'string'
            },
            {
                title: '工序编号',
                dataIndex: 'Number',
                type: 'string'
            },
            {
                title: '是否要求质检',
                dataIndex: 'isQCheck',
                type: 'string'
            },
            {
                title: '标准工时(h)',
                dataIndex: 'Hours',
                type: 'string'
            },
            {
                title: '工时计费',
                dataIndex: 'TimeBilling',
                type: 'string'
            },
            {
                title: '创建人',
                dataIndex: 'Founder',
                type: 'string'
            },
            {
                title: '创建时间',
                dataIndex: 'CreateTime',
                type: 'string'
            },
            {
                title: '备注',
                dataIndex: 'Desc',
                type: 'string'
            },
            /*{
                title: '描述',
                dataIndex: 'Note',
                type: 'string'
            },
            {
                title: '修改时间',
                dataIndex: 'UpdateDateTime',
                type: 'string',
            },*/
            {
                title: '操作',
                dataIndex: 'uMachineUUID',
                render:(txt,record)=>{
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
                        <Link to='process/process_detail' >详情</Link>
                    </span>
                }
            }
        ];

        //更新弹框数据项
        const UFormItem= [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入管理者编号',
                rules: [{required: true,min: 1,message: '名称不能为空'}]
            },/*{
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '请输入管理者编号'
            }, {
                name: 'Note',
                label: '描述',
                type: 'string',
                placeholder: '请输入描述',
            }, */{
                name: 'Desc',
                label: '备注',
                type: 'string',
                placeholder: '请输入备注',
            }
        ];

        // 可设置的查询字段
        const CFormItem= [
            {
                name: 'Name',
                label: '类别名称',
                type: 'string',
                placeholder: '请输入类别名称',
                rules: [{required: true,min: 1,message: '名称不能为空'}]
            },
            /*{
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '编号',
                rules: [{required: true,min: 1,message: '名称不能为空'}]
            }*/
        ];

        //查询的数据项
        const RFormItem= [
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
            }
        ];

        const bcList = [{
            title:"首页",
            href: '/',
            }, {
            title: '设备管理',
            href: '/',
            }, {
            title: '设备类别',
        }];

        return (
            <PageHeaderLayout title="工序管理" wrapperClassName="pageContent" BreadcrumbList={Breadcrumb.BCList}>
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
            </PageHeaderLayout>
        )
    }
}
