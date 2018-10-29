import React, { Component ,createElement} from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Input, Row,
     Col, Avatar, Dropdown,AutoComplete,Button  } from 'antd';
import LOGO from '../../images/T-3.png';
// import LOGO from '../../images/_TOP-STAR-LOGO.png';
// import LOGO from '../../images/_TOP-STAR-LOGO_01.jpg';
// import LOGO from '../../images/_TOP-STAR-LOGO_02.jpg';
import styles from './THeader.less';
import HeaderSearch from '../../components/ant-design-pro/HeaderSearch';
const Option = AutoComplete.Option;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;

const userMenu = (
    <Menu className="userlistMenu">
        <Menu.Item>
            <Icon type="user"/>
            <span className="itemTxt">个人中心</span>
        </Menu.Item>
        <Menu.Item>
            <Icon type="logout" />
            <span className="itemTxt">退出登录</span>
        </Menu.Item>
        <Menu.Item>
            <Icon type="setting" />
            <span className="itemTxt">设置</span>
        </Menu.Item>
    </Menu>
)
const setMenu = (
    <Menu>
        <Menu.Item >
            <Icon type="arrows-alt" />
            <span >全屏</span>
        </Menu.Item>
        <Menu.Item>
            <Icon type="setting" />
            <span>设置</span>
        </Menu.Item>
        <Menu.Item>
            <Icon type="setting" />
            <span>退出登录</span>
        </Menu.Item>
    </Menu>
)


function onSelect(value) {
  console.log('onSelect', value);
}

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}

function searchResult(query) {
  return (new Array(getRandomInt(5))).join('.').split('.')
    .map((item, idx) => ({
      query,
      category: `${query}${idx}`,
      count: getRandomInt(200, 100),
    }));
}

function renderOption(item) {
  return (
    <Option key={item.category} text={item.category}>
      {/* {item.query} 在
      <a
        href={`https://s.taobao.com/search?q=${item.query}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.category}
      </a>
      区块中
      <span className="global-search-item-count">约 {item.count} 个结果</span> */}
      包含{item.category}的结果
    </Option>
  );
}


export default class THeader extends React.Component {
    constructor( props ) {
        super( props );
        this.state={
            isFullScreen:false,
            dataSource : [],
            searchValue:''
        }
        this.fullScreen.bind(this);
        this.exitScreen.bind(this);
    }

    fullScreen(ele) {
        console.log('ele', ele);
        this.setState({isFullScreen: true});
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        }
        else if (typeof window.ActiveXObject != "undefined") {
            //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    //退出全屏
    exitScreen(){
        this.setState({isFullScreen: false});
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        if(typeof cfs != "undefined" && cfs) {
            cfs.call(el);
        }
    }

    handleSearch = (value) => {
        /*this.setState({
            // dataSource: value ? searchResult(value) : [],
            dataSource: value
        });*/
        this.setState({
            dataSource: !value
                ? []
                : [
                    {value:'TManufactureTask',text:`包含${value}的订单`},
                    {value:'TManufactureTaskDispatch',text:`包含${value}的派工单`},
                    {value:'TWorkCenter',text:`包含${value}的工作中心`},
                    {value:'TUserList',text:`包含${value}的用户`},
                ],
            searchValue:value
        });
    }

    onSelect =(value,option)=>{
        console.log('props',value,option,this.props.handleSearch);
        // this.props.TPageOpen( e.key );
        this.props.handleSearch.TPageOpen(value,this.state.searchValue);
    }

    renderOptions=()=>{
        this.dataSource.map(()=>{

        })
        return (
          <Option key={item.category} text={item.category}>
            包含{item.category}的结果
        </Option>)
    }

    render(){
        const { dataSource } = this.state;
        // const { handleSearch } =this.props;
        const searchOptions=[
            (<Option key={1} value="TManufactureTask">包含<span className="searchtxt">{dataSource}</span>的订单</Option>),
            (<Option key={2} value="TManufactureTaskDispatch">包含<span className="searchtxt">{dataSource}</span>的派工单</Option>),
            (<Option key={3} value="TWorkCenter">包含<span className="searchtxt">{dataSource}</span>的工作中心</Option>),
            (<Option key={4} value="TUserList">包含<span className="searchtxt">{dataSource}</span>的用户</Option>)
        ];

        return (
            <Header className="header">
              {/* <div className="logo" /> */}
              <Row gutter={16}>
                  <Col span={0}>
                      <div className="header-title">
                            {/* <span>T-MES智能制造执行系统</span> */}
                            <img src={LOGO}
                              style={{
                                width:'100%',
                                // maxWidth:150
                              }}
                            />
                      </div>
                  </Col>
                  <Col span={9}>
                      <div className="header-title">
                            {/* <span>智能制造执行系统</span> */}
                            <img src={LOGO} style={{width:'100%',maxWidth:350}}/>
                      </div>
                  </Col>
                  <Col span={9}>
                      {/* <heard-seach>
                          <Search
                              placeholder="输入..."
                              onSearch={value => console.log(value)}
                              // enterButton
                              // style={{ width: 800 }}
                          />
                      </heard-seach> */}
                      {/* <div className="global-search-wrapper" style={{ width: '100%',height:"100%" }}> */}
                        {/* <AutoComplete
                          className="global-search"
                          size="large"
                          style={{ width: '100%',height:"100%" }}
                          // dataSource={dataSource.map(renderOption)}
                          // dataSource={searchOptions}
                          dataSource={dataSource}
                          onSelect={this.onSelect}
                          onSearch={this.handleSearch}
                          placeholder="输入关键字查询..."
                          optionLabelProp="text"
                        >
                          <Input
                            suffix={(
                              <Button className="search-btn" size="large" type="danger">
                                <Icon type="search" />
                              </Button>
                            )}
                          />
                        </AutoComplete> */}
                      {/* </div> */}
                  </Col>
                  {/* <Col span={1}>
                    <span className='menu-item'>
                        <Dropdown overlay={setMenu}>
                          <Icon type="appstore" className="header-menu-icon"/>
                        </Dropdown>
                    </span>
                  </Col> */}
                  <Col span={3} style={{border:'solid 0px'}}>
                      <div className="menu-item">
                          <Dropdown overlay={userMenu}>
                              <div>
                                  <span style={{width:"40%"}}>
                                      <span>
                                        <Avatar size="small" icon="user"/>
                                      </span>
                                  </span>
                                  <span style={{width:"60%",paddingLeft:"10%",color:'#fcfcfc',fontWeight:"bold"}}>
                                    欢迎你,<span style={{color:'#ecb44c'}}>系统管理员!</span>
                                  </span>
                              </div>
                          </Dropdown>
                      </div>
                  </Col>
                  <Col span={1}>
                    <div className="menu-item">
                          <span style={{width:"40%"}}>
                              <Icon type="exclamation-circle-o" className="header-menu-icon"/>
                          </span>
                          <span style={{width:"60%",paddingLeft:"10%",color:'#fcfcfc',fontWeight:"bold"}}>
                            关于
                          </span>
                    </div>
                  </Col>
                  <Col span={1}>
                    <div className="menu-item">
                          <span style={{width:"40%"}}>
                              <Icon type="logout" className="header-menu-icon"/>
                          </span>
                          <span style={{width:"60%",paddingLeft:"10%",color:'#fcfcfc',fontWeight:"bold"}}>
                            退出
                          </span>
                    </div>
                  </Col>
                  <Col span={1}>
                    <div className='menu-item'>
                        {
                            this.state.isFullScreen?
                            <Icon
                                onClick={this.exitScreen.bind(this)}
                                className="header-menu-icon"
                                type="shrink"/>:
                            <Icon
                                onClick={this.fullScreen.bind(this)}
                                className="header-menu-icon"
                                type="arrows-alt"/>
                        }
                    </div>
                  </Col>
              </Row>
            </Header>
        );
    }
};
THeader.propTypes = {

};
