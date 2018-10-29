/**
 *这是车间类别页
 *添加日期:2018.03.02
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Menu, Icon, Badge, Dropdown,message,Divider,Popconfirm } from 'antd';
import { fetchWorkshopTypeList } from 'actions/factory'
import { TPostData,TPostMock } from '../../utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import PageHeaderLayout from '../../base/PageHeaderLayout';

@connect( ( state, props ) => {
    return {
        Breadcrumb:state.Breadcrumb,
        workshopType: state.workshopType,
    }
}, )
export default class App extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            tableDataList:[],
            updateFromItem:{},
            total:0,
            current:1,
            pageSize:10,
            keyWord:'',
            UModalShow:false,
            loading:true,
        }
        this.url='/api/TFactory/workshop_type';
    }

    componentWillMount() {
        // this.getWSTypeList();
        this.props.dispatch( fetchWorkshopTypeList( { current: 1 }, ( respose ) => {} ) )
    }

    componentDidMount(){}

    getWSTypeList(str){
        const {current,pageSize}=this.state;
        const dat = {
            PageIndex:current-1,
            pageSize,
            KeyWord: str||''
        }
        TPostMock('/workshop_type', "ListActive", dat,
            ( res )=> {
                var list = [];
                console.log( "查询到车间类别列表", res );
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach( ( item, index )=> {
                    list.push( {
                        key: index,
                        UUID: item.UUID,
                        Name:item.Name,
                        ID:item.ID,
                        Founder:item.Founder,
                        CreatDateTime:item.CreatDateTime,
                        Renewing:item.Renewing,
                        UpdateDateTime:item.UpdateDateTime,
                    } )
                } );
                this.setState({tableDataList:list,total:totalcount,loading:false});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    handleCreat=(data)=>{
        let dat = {
            Name: data.Name,
            ID: "---"
        }
        console.log('创建后的数据是:', data);
        TPostData( this.url, "Add", dat,
            ( res )=> {
                message.success("创建车间成功！");
                this.getWSTypeList();
            },
            ( err )=> {
                message.error("创建车间失败！");
                console.log('err',err);
            }
        )
    }

    handleQuery=(data)=>{
        // console.log("查询的只是:",data.keyWord);
        // this.setState({keyWord:data.keyWord});
        this.getWSTypeList(data.keyWord);
    }

    handleUpdate=(data)=>{
        let dat = {
            UUID: this.state.updateFromItem.UUID,
            Name: data.Name,
            Desc: data.Desc,
            ID: "--",
            Note: "--"
        }
        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("更新成功！");
                this.getWSTypeList();
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
                this.getWSTypeList();
            },
            ( err )=> {
                message.error("删除失败！");
                console.log('err',err);
            }
        )
    }

    handleTableChange=(pagination)=>{
        const {current,pageSize}=pagination;
        this.setState({current,pageSize});
        this.getWSTypeList();
    }

    toggleUModalShow=(record)=>{
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }

    render() {
        const {
            tableDataList,
            // loading,
            current,
            // total,
            pageSize,
            updateFromItem,
            UModalShow
        } = this.state;
        const {Breadcrumb}=this.props;
        const { workshopTypeList, total, loading } = this.props.workshopType;
        let Data={
            // list:tableDataList,
            list:workshopTypeList,
            pagination:{total,current,pageSize}
        };
        const Tcolumns =[
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
                title: '车间类型',
                dataIndex: 'Name',
                type: 'string',
                // sorter: (a, b) => a.Name.length - b.Name.length
            },
            {
                title: '编号',
                dataIndex: 'ID',
                type: 'string',
                // sorter: (a, b) => a.Name.length - b.Name.length
            },
            {
                title: '创建人',
                dataIndex: 'Founder',
                type: 'string',
            },
            {
                title: '创建时间',
                dataIndex: 'CreateTime',
                type: 'string',
            },
            /*{
                title: '修改人',
                dataIndex: 'Renewing',
                type: 'string',
            },
            {
                title: '修改时间',
                dataIndex: 'UpdateDateTime',
                type: 'string',
            },*/
            {
                title: '操作',
                dataIndex: 'UUID',
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
                    </span>
                }
            }
        ];

        const RFormItem=[
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
          }
        ];
        const CFormItem= [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入车间类别名称',
                rules: [{required: true,message: '名称不能为空'}]
            }
        ];
        const UFormItem= [
            {
                name: 'Name',
                label: '类别名称',
                type: 'string',
                rules: [{ required: true, message: '名称不能为空' }],
                placeholder: '请输入车间类别名称'
            },
            {
                name: 'Desc',
                label: '描述',
                type: 'string',
                placeholder: '请输入描述',
            },
        ];

        const bcList = [{
            title:"首页",
            href: '/',
            }, {
            title: '生产资料',
            href: '/',
            }, {
            title: '物料类别',
        }];

        return (
            <PageHeaderLayout title="车间类别" wrapperClassName="pageContent" BreadcrumbList={Breadcrumb.BCList}>
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
                        loading={loading}
                        size="middle"
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
