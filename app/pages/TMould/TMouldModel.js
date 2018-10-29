/**
 *这是模具型号页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory, Link } from 'react-router'
import { Table, Menu, Icon, Badge, Dropdown,Popover,message,Divider,Popconfirm } from 'antd';
import { fetchMoldModel } from 'actions/mold';
import { TPostData,urlBase } from 'utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import PageHeaderLayout from '../../base/PageHeaderLayout';
import Pic from 'images/assets/mold01.jpg'

@connect( ( state, props ) => {
    console.log( 'state', state )
    return {
        Breadcrumb:state.Breadcrumb,
        moldModel: state.moldModel,
    }
}, )
export default class MouldModel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tableDataList:[],
            updateFromItem:{},
            total:0,
            current:1,
            pageSize:10,
            UModalShow:false,
            loading:true,
        }
        this.url= '/api/TMold/mold_model';
    }

    componentWillMount(){
        // this.getTableList();
        this.props.dispatch( fetchMoldModel( { current: 1 }, ( respose ) => {} ) )
    }

    getTableList(que){
        const {current,pageSize,keyWord}=this.state;
        const dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,   //分页：每页记录数，不分页时设为-1
            // FactoryUUID: -1,    //所属工厂UUID，不作为查询条件时取值设为-1
            // TypeUUID: que?que.TypeUUID:-1,  //类型UUID，不作为查询条件时取值设为-1
            KeyWord :keyWord,
            // KeyWord : que?que.keyWord:''
        }

        TPostData( this.url, "ListActive", dat,
            (res) => {
                var list = [];
                console.log("查询到模具型号列表", res);
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach((item, index)=> {
                    list.push({
                        key: index,
                        UUID: item.UUID,
                        // ModelUUID:item.ModelUUID,
                        TypeName:item.TypeName,
                        MoldModelID: 'SC-00'+item.ID,
                        MoldModelName: item.Name,
                        MoldModelSize: item.Size,
                        MoldModelDesc: item.Desc,
                        MoldModelNote: item.Note,
                        UpdateDateTime:item.UpdateDateTime,
                        Cavity:item.Cavity,
                        Image:item.Image
                    })
                })
                this.setState({ tableDataList: list, total: totalcount, loading: false });
            },
            ( error )=> {
              message.error( error );
              this.setState({loading:false});
            }
        )

    }

    handleCreat=(data)=>{
        let dat = {
            ID: data.strMoldModelID,
            Name: data.strMoldModelName,
            Cavity:data.strCavity,
            Path:data.Image
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

    handleUpdate=(data)=>{
        let dat = {
            UUID: this.state.updateFromItem.UUID,
            ID: data.strMoldModelID,
            Name: data.strMoldModelName,
            Size: data.strMoldModelSize,
            Cavity:data.strCavity,
            Path : data.Image,
            // Desc: data.strMoldModelDesc,
            Desc: "-",
            Note: data.strMoldModelNote,
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

    handleQuery=(data)=>{
        console.log("查询的值是:",data);
        const {keyWord,TypeUUID}=data;
        this.setState({keyWord,TypeUUID,loading:true},()=>{
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
        const { list, total, loading } = this.props.moldModel;

        let Data={
            // list:tableDataList,
            list:list,
            pagination:{total,current,pageSize}
        };

        //table表格表头参数
        const Tcolumns= [
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
              title: '图片',
              dataIndex: 'Image',
              render:(e,record)=>{
                  const content = (
                      <div>
                        <img width="300"
                          // src={urlBase+e}
                          src={Pic}
                        />
                      </div>
                    );
                  return (
                      <Popover placement="right"  content={content} trigger="hover">
                        {/* <Button>Right</Button> */}
                        <img height='50'
                           // src={urlBase+e}
                           src={Pic}
                         />
                      </Popover>
                    )
              }
            }, {
                title: '模具型号',
                dataIndex: 'MoldModelName',
                type: 'string'
            }, {
                title: '编号',
                dataIndex: 'MoldModelID',
                type: 'string'
            },{
                title: '模具类别',
                dataIndex: 'TypeName',
                type: 'string'
            }, {
                title: '规格 （材料/尺寸(注塑：周期)/步距）',
                dataIndex: 'MoldModelSize',
                type: 'string'
            },{
                title: '穴数',
                dataIndex: 'Cavity',
                type: 'string'
            },{
                title: '修改时间',
                dataIndex: 'UpdateDateTime',
                type: 'string'
            }, {
                title: '操作',
                dataIndex: 'UUID',
                render:(UUID,record)=>{
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
        //更新弹框数据项
        const UFormItem= [
            {
                name: 'strMoldModelName',
                label: '名称',
                type: 'string',
                placeholder: '请输入型号',
                rules: [{ required: true, message: '请输入型号' }]
            }, {
                name: 'strMoldModelID',
                label: '编号',
                type: 'string',
                placeholder: '请输入编号',
                rules: [{ required: true, message: '请输入编号' }]
            }, {
                name: 'strMoldModelSize',
                label: '尺寸',
                type: 'string',
                placeholder: '尺寸',
                rules: [{ required: true, message: '请输入尺寸' }]
            },{
                name: 'strCavity',
                label: '穴数',
                type: 'string',
                placeholder: '请输入模具穴数',
                rules: [{ required: true,  message: '模具穴数不能为空' }]
            },/* {
                name: 'strMoldModelDesc',
                label: '描述',
                type: 'string',
                placeholder: '请输入描述'
            },*/ {
                name: 'strMoldModelNote',
                label: '备注',
                type: 'string',
                placeholder: '请输入备注'
            }, {
              name: 'Image',
              label: '图片',
              type: 'antUpload',
              url: '/api/tupload/do',
            },
        ];
        //添加的弹出框菜单
        const CFormItem= [
            {
                name: 'strMoldModelName',
                label: '名称',
                type: 'string',
                placeholder: '请输入名称',
                rules: [{ required: true, message: '请输入名称' }]
            },
            {
                name: 'strMoldModelID',
                label: '编号',
                type: 'string',
                placeholder: '请输入编号',
                rules: [{ required: true,  message: '请输入编号' }]
            },
            {
                name: 'strCavity',
                label: '穴数',
                type: 'string',
                placeholder: '请输入模具穴数',
                rules: [{ required: true,  message: '模具穴数不能为空' }]
            },
            {
              name: 'Image',
              label: '图片',
              type: 'antUpload',
              url: '/api/tupload/do',
            },
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
            title: '生产资料',
            href: '/',
            }, {
            title: '物料类别',
        }];

        return (
            <PageHeaderLayout title="模具型号" wrapperClassName="pageContent" BreadcrumbList={Breadcrumb.BCList}>
                <div className="cardContent">
                    {/* <Feature /> */}
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
