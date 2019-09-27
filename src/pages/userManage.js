import React, {Component} from 'react';
import {Card, Col, Row, Avatar, Form, Switch, Button, Modal, Input,message,Icon} from 'antd';
import axios from 'axios';
import config from '../utils/config';

import './userManage.css'

const {Meta} = Card;
export default class UserManage extends Component {
  state = {
    //放置用户的信息
    userData: [],
    //控制模态框的显隐
    visible: false,
    //添加用户信息
    form: {
      username: '',
      password: '',
      nickname: '',
      email: '',
      regTime: ''
    }
  };

  //组件挂载完成后查询用户
  componentDidMount() {
    this.findAllUser()
  }

  //查询所有用户的函数
  findAllUser = () => {
    axios.get('/manager/user/findAllUser').then(res => {
      console.log(res.data);
      this.setState({
        userData: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  };

  //改变状态
  toChangeStatus = (id, status) => {
    let obj = {
      id,
      status: !status
    };
    axios.post('/manager/user/changeStatus', obj).then(res => {
      console.log(res);
      this.findAllUser();
    })
  };

  //模态框的函数
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    axios.post('/manager/user/saveOrUpdateUser', this.state.form).then(res => {
      console.log(res);
      this.setState({
        visible: false,
      });
      this.findAllUser();
    })

  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  //点击添加
  toAdd = () => {
    //清空表单后显示模态框
    this.setState({
      form: {
        username: '',
        password: '',
        nickname: '',
        email: '',
        regTime: config.parseDate()
      }
    }, () => {
      this.showModal();
    });
  };

  //获取表单中的数据
  inputChange = (attr, e) => {
    let {form} = this.state;
    form[attr] = e.target.value;
    this.setState({
      form
    })
  };

  //删除
  toDelete = (id,e) => {
    if(id <= 20){
      message.error('系统用户，无法删除',1);
    }else{
      axios.get('/manager/user/deleteUserById',{params: {id}}).then(res=>{
        message.success('删除成功',1);
        this.findAllUser();
      }).catch(err=>{
        console.log(err)
      })
    }
  };

  render() {
    const {form} = this.state;
    const formItemLayout = {
      labelCol: {span: 10},
      wrapperCol: {span: 10},
    };
    const formItemLayout1 = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
    return (
      <div>
        <div className='btns-div'>
          <Button type='primary' onClick={this.toAdd}>新增</Button>
        </div>
        <div style={{background: '#ECECEC', padding: '30px'}}>
          <Row gutter={16}>
            {
              this.state.userData.map((item, index) => (
                <Col span={8} key={index}>
                  <Card avatar='true' active='true' className='user-card'>
                    <Meta
                      avatar={
                        <Avatar src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" style={{height:100,width:100,marginLeft:100,marginTop:10,borderRadius:"50%",}}/>
                      }
                      
                    />
                    <Icon className='delete-btn' type='close' onClick={this.toDelete.bind(this, item.id)}>X</Icon>
                    <Form className='user-info'>
                    <Form.Item className='info-nickname' {...formItemLayout} label="用户名:">
                        {item.username}
                      </Form.Item>
                      <Form.Item className='info-nickname' {...formItemLayout} label="真实姓名:">
                        {item.nickname}
                      </Form.Item>
                      <Form.Item className='info-nickname' {...formItemLayout} label="注册时间:">
                        {item.regTime ? item.regTime : '无'}
                      </Form.Item>
                      <Form.Item className='info-nickname' {...formItemLayout} label="邮箱:">
                        {item.email ? item.email : '无'}
                      </Form.Item>
                      <Form.Item className='info-nickname' {...formItemLayout} label="状态:">
                        <Switch checkedChildren="ON" unCheckedChildren="OFF" checked={item.enabled}
                                onChange={this.toChangeStatus.bind(this, item.id, item.enabled)}/>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
              ))
            }
          </Row>
        </div>
        <div>
          <Modal
            title="新增用户"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            {/*{JSON.stringify({form})}*/}
            <Form {...formItemLayout1}>
              <Form.Item label="用户名">
                <Input value={form.username} onChange={this.inputChange.bind(this, 'username')}/>
              </Form.Item>
              <Form.Item label="密码">
                <Input value={form.password} onChange={this.inputChange.bind(this, 'password')}/>
              </Form.Item>
              <Form.Item label="真实姓名">
                <Input value={form.nickname} onChange={this.inputChange.bind(this, 'nickname')}/>
              </Form.Item>
              <Form.Item label="邮箱">
                <Input value={form.email} onChange={this.inputChange.bind(this, 'email')}/>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    )
  }
}
