import React, {Component} from 'react';
import {Button, Table, Modal, Form, Input, Select,Icon} from "antd";
import axios from "../utils/axios";

import './InfoManage.css'

const {confirm} = Modal;
const {TextArea} = Input;
const {Option} = Select;
export default class CategoryManage extends Component {
  state = {
    //放栏目信息的数组
    categoryData: [],
    //控制模态框的显隐
    visible: false,
    //新增和修改提交的数据
    form: {
      name: '',
      comment: '',
      parentId: ''
    },
    //模态框的标题
    modalText: '新增栏目',
    //批量删除选择的id
    ids:[]
  };

  //组件加载完毕后查询所有栏目
  componentDidMount() {
    this.findAllCategory();
  }

  //查询所有栏目函数
  findAllCategory = () => {
    axios.get('/manager/category/findAllCategory').then((res) => {
      console.log(res.data);
      this.setState({
        categoryData: res.data
      })
    }).catch((err) => {
      console.log(err)
    })
  };

  //单个删除
  toDelete = (id, name) => {
    let that = this;
    confirm({
      title: '请确认',
      content: `是否删除${name}`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        axios.get('/manager/category/deleteCategoryById', {params: {id}})
          .then((res) => {
            console.log(res)
            that.findAllCategory()
          })
          .catch((err) => {
            console.log(err)
          })
      },
      onCancel() {
      },
    });
  };
  //新增
  toAdd = () => {
    this.setState({
      form: {},
      modalText: '新增栏目'
    }, () => {
      this.showModal()
    });


    /* axios.post('/manager/category/saveOrUpdateCategory',obj).then((res) => {
       console.log(res)
       this.findAllCategory()
     }).catch(err => {
       console.log(err)
     })*/
  };

  //控制模态框的函数
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    axios.post('/manager/category/saveOrUpdateCategory', this.state.form).then(res => {
      console.log(res);
      this.setState({
        visible: false
      }, () => {
        this.findAllCategory()
      })
    }).catch(err => {
      console.log(err)
    })
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  //改变模态框的栏目input和textarea
  formChange = (attr, e) => {
    let {form} = this.state;
    form[attr] = e.target.value;
    this.setState({
      form
    })
  };

  //select的onChange上默认携带value值
  selectChange = (value) => {
    let {form} = this.state;
    form.parentId = value;
    this.setState({form})
  };

  //编辑
  toEdit = (record) => {
    this.setState({
      modalText: '编辑栏目'
    });
    let {form} = this.state;
    form = {
      ...form,
      name: record.name,
      comment: record.comment,
      parentId: record.parent?record.parent.id:'',
      id:record.id
    };
    this.setState({
      form
    },()=>{
      this.showModal()
    })
  };

  //批量删除
  toBatchDelete = () => {
    //console.log(this.state.ids)
    const {ids} = this.state;
    axios.post('/manager/category/batchDeleteCategory',{ids:ids.toString()}).then(res => {
      console.log(res)
      this.findAllCategory()
    })
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //selectedRowKeys 就是选中的元素的id数组 selectedRows是选中的行
        this.setState({
          ids: selectedRowKeys
        })
      },
    };
    const columns = [
      {
        title: '栏目名称',
        dataIndex: 'name',
      },
      {
        title: '父栏目',
        dataIndex: 'parent.name',
      },
      {
        title: '描述',
        dataIndex: 'comment',
      },
      {
        title: '操作',
        dataIndex: '',
        render: (text, record) => {
          //text dataIndex对应的属性值
          //record 表格中的整个一行,对象
          return (
            <div>
              <Icon type='edit' style={{color:'green',marginRight:5}} title='编辑' onClick={this.toEdit.bind(this, record)}>编辑</Icon>
              <Icon type='delete' style={{color:'red'}} title='删除' onClick={this.toDelete.bind(this, record.id, record.name)}>删除</Icon>
            </div>
          )
        }
      },
    ];
    const {form} = this.state;
    return (
      <div className='article-manage'>
        <div className='btns-div'>
          <Button type='primary' onClick={this.toAdd}>新增</Button>
          <Button type='danger'onClick={this.toBatchDelete}>批量删除</Button>
        </div>
        <div className='table-div'>
          <Table
            rowKey='id'
            dataSource={this.state.categoryData}
            rowSelection={rowSelection}
            columns={columns}
            /*pagination={this.state.pagination}*/
            /*onChange={this.pageChange}*/
          />
        </div>
        <div>
          <Modal
            title={this.state.modalText}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText='确定'
            cancelText='取消'
          >
            {/*{JSON.stringify(form)}*/}
            <Form {...formItemLayout}>
              <Form.Item label="栏目名称">
                <Input value={form.name} onChange={this.formChange.bind(this, 'name')}/>
              </Form.Item>
              <Form.Item label="父栏目">
                <Select value={form.parentId} onChange={this.selectChange}>
                  {
                    this.state.categoryData.map((item, index) => (
                      <Option value={item.id} key={index}>{item.name}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="内容">
                <TextArea rows='4' value={form.comment} onChange={this.formChange.bind(this, 'comment')}/>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    )
  }
}
