import React, {Component} from 'react';
import './App.css';
import {HashRouter, Route, Switch, Link, Redirect} from 'react-router-dom'
import {Layout, Menu, Icon, Avatar,Button} from 'antd'
import avatar from './touxiang.png';

import Shouye from "./pages/shouye";
import InfoManage from "./pages/InfoManage";
import CategoryManage from "./pages/CategoryManage";
import UserManage from "./pages/userManage";

const {Header, Sider, Content} = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <div>
        {/*minHeight:'100vh'  布满全屏*/}
        <HashRouter>
          <Layout id='layout' style={{minHeight: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <div className="logo">
                <Icon type="fund"/>
                <span style={{color:"coral"}}>看点资讯</span>
              </div>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
                <Menu.Item key="0">
                  <Link to='/shouye'>
                    <Icon type="bank"/>
                    <span>首页</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="1">
                  <Link to='/article'>
                    <Icon type="read"/>
                    <span>文章管理</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to='/category'>
                    <Icon type="slack"/>
                    <span>栏目管理</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to='/user'>
                    <Icon type="user" />
                    <span>用户管理</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header style={{background: '#fff', padding: 0}}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
                <div className='user'>
                  <Avatar src={avatar}/>
                  <span>
                    <Icon type="poweroff"/>
                    <Button type='link' className='exitBtn'>注销</Button>
                  </span>
                </div>
              </Header>
              <Content
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  background: '#fff',
                  minHeight: 280,
                }}
              >
                <Switch>
                  <Redirect from='/' exact to='/shouye'/>
                  <Route from='/shouye' component={Shouye}/>
                  <Route path='/article' component={InfoManage}/>
                  <Route path='/category' component={CategoryManage}/>
                  <Route path='/user' component={UserManage}/>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </HashRouter>

      </div>
    );
  }
}


