import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Table,Radio,Icon ,Row, Col, Divider,Form,
    List, Timeline, Menu, Card, DatePicker, Select,Switch } from 'antd';
import { TPostData, urlBase } from '../../utils/TAjax';
import ReactEcharts from 'echarts-for-react';
import PageHeaderLayout from '../../base/PageHeaderLayout';
import TimelineDataTable from './components/TimelineDataTable';
import TimeLineChart from './components/timeLineChart';
const FormItem = Form.Item;


@connect( ( state, props ) => {
    return {
        workcenter: state.workcenter,
        Breadcrumb:state.Breadcrumb,
    }
}, )
export default class TStateTimeOverview extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
            toggleView: 'timelineTable',
            workshopList: [],
            workCenterList:[]
        }
    }

    componentWillMount() {
        this.getWorkCenterList();
        this.getWorkshopList();
    }

    componentDidMount() {

    }

    getWorkshopList() {

        const dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1, //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1, //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID: -1, //类型UUID，不作为查询条件时取值设为-1
            KeyWord: ""
        }
        TPostData( '/api/TFactory/workshop', "ListActive", dat,
            ( res ) => {
                var list = [];
                console.log( "查询到车间列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach( ( item, index ) => {
                    list.push( {
                        key: index,
                        UUID: item.UUID,
                        Name: item.Name,
                        Number: item.ID
                    } )
                    this.setState( { workshopList: list } )
                } )
            },
            ( error ) => {
                message.info( error );
            }
        )

    }

    getWorkCenterList() {
        var dat = {
            'PageIndex': 0,
            'PageSize': -1,
            WorkshopUUID:1,
            'TypeUUID': -1
        }
        TPostData('/api/TProcess/workcenter', "ListActive", dat,
            ( res )=> {
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                console.log( '查询到工作中心列表', Ui_list );
                Ui_list.forEach(( item, index )=> {
                    /*list.push( {
                        key: index,
                        ID: item.ID,
                        UUID: item.UUID,
                        Name: item.Name,
                    } )*/
                    list.push({Name:item.Name,UUID:item.UUID});
                } )
                this.setState({workCenterList:list})
            },
            ( error )=> {
                message.info( error );
            }
        )
    }


    generate(){
        let list=[],
            periodStart='',
            periodEnd='';
        for (let i=0;i<24;i++) {
            periodEnd=i+1;
            periodStart=i<10?'0'+i:i;
            periodEnd=periodEnd<10?'0'+periodEnd:periodEnd;
            list.push(
                {
                    key:i,
                    period:`${periodStart}:00~${periodEnd}:00`,
                    orderNumber:'Task001',
                    product:"RCA音视频端子",
                    capacity:'1200',
                    yield:this.GetRandomInt(800,1200),
                    OEE:`${this.GetRandomInt(40,90)}%`,
                    status:this.GetRandomInt(0,1)
                }
            )
        }
        return list;
    }

    handleChange() {

    }
    handleToggle(e){
      this.setState({ toggleView: e.target.value });
      console.log(e);
    }
    GetRandomInt(max,min){
        return parseInt(Math.random() * (max - min) + min);
    }

    render() {
        const {Breadcrumb}=this.props;

        const columns = [
            {
                title: '生产时间',
                dataIndex: 'period',
                key: 'lotJobID'
            }, {
                title: '工单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
            },
            {
                title: '产品',
                dataIndex: 'product',
                key: 'product',
            },
            {
                title: '产能',
                dataIndex: 'capacity',
                type: 'capacity'
            }, {
                title: '产量',
                dataIndex: 'yield',
                type: 'yield'
            }, {
                title: 'OEE(%)',
                dataIndex: 'OEE',
                type: 'OEE'
            },
            {
                title: '工单状态',
                dataIndex: 'Status',
                key: 'Status',
                render: ( e, record ) => {
                    let status;
                    status=e==0?<span>生产中</span>:<span>已完成</span>;
                    return status;
                    // return <StateBotton stateType='workOrder' state = { record.Status }/>
                }
            }
        ];

        const toggleView = this.state.toggleView;

        const productData=this.generate();

        const defaultSelectedWS=(()=>{
            let wsList=this.state.workshopList,
                defaultValue='';
            if(wsList.length){
                defaultValue=wsList[0].hasOwnProperty('UUID')?wsList[0].UUID:'-1'
            }
            else{
                defaultValue='-1';

            }
            return defaultValue;
        })();

        return (
            <PageHeaderLayout title="生产追踪" wrapperClassName="pageContent" BreadcrumbList={Breadcrumb.BCList}>
                <div className="cardContent">
                    <Card>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>车间:</span>
                                    <Select defaultValue={defaultSelectedWS} style={{ width: "60%" }} onChange={this.handleChange}>
                                        <Option value="-1" key="all">全部</Option>
                                        {
                                            this.state.workshopList.map((item,index)=>{
                                                    return (<Option value={item.UUID} key={index}>{item.Name}</Option>)
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>工作中心:</span>
                                    <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleChange}>
                                        <Option value="-1" key="all">全部</Option>
                                        {
                                            this.state.workCenterList.map((item,index)=>{
                                                    return (<Option value={item.UUID} key={index}>{item.Name}</Option>)
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>日期:</span>
                                    <DatePicker style={{ width: "60%" }} />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box">
                                    <Button type="primary" icon="search">查询</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <div style={{marginTop:20}}>
                        <Radio.Group value={toggleView} onChange={this.handleToggle.bind(this)}>
                            <Radio.Button value="timelineTable">数据表</Radio.Button>
                            <Radio.Button value="timelineChart">曲线趋势</Radio.Button>
                        </Radio.Group>
                        <Switch style={{marginLeft:35}} checkedChildren="白班" unCheckedChildren="晚班" />
                    </div>
                    <div style={{marginTop:30}}>
                        {
                            this.state.toggleView=="timelineTable"?
                            <TimelineDataTable />:
                            <TimeLineChart />
                        }
                        {/* <Row gutter={16}>
                            <Col span={16}>
                                <Table
                                    columns={columns}
                                    dataSource={productData}
                                    bordered={true}
                                    size="small"
                                />
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Timeline>
                                      <Timeline.Item color="green">创建服务现场 2015-09-01</Timeline.Item>
                                      <Timeline.Item color="green">创建服务现场 2015-09-01</Timeline.Item>
                                      <Timeline.Item color="red">
                                        <p>初步排除网络异常1</p>
                                        <p>初步排除网络异常2</p>
                                        <p>初步排除网络异常3 2015-09-01</p>
                                      </Timeline.Item>
                                      <Timeline.Item>
                                        <p>技术测试异常1</p>
                                        <p>技术测试异常2</p>
                                        <p>技术测试异常3 2015-09-01</p>
                                      </Timeline.Item>
                                    </Timeline>
                                </Card>
                            </Col>
                        </Row> */}
                    </div>
                </div>
            </PageHeaderLayout>
        )
    }
}
