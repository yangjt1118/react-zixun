import React, {Component} from 'react';
import {Button, Table, Modal, Form, Input, Select, Radio,Icon} from 'antd';
import axios from '../utils/axios'
import config from "../utils/config";
import './InfoManage.css'

const {confirm} = Modal;
const {Option} = Select;
const {TextArea} = Input;
export default class InfoManage extends Component {
  state = {
    tableData: [],
    currentPage: 1,
    pagination: {
      pageSize: config.pageSize,
      total: 0
    },
    //批量删除的id数组
    ids: [],
    //模态框的显示与隐藏
    visible: false,
    //模态框需要遍历的栏目信息
    categoryData: [],
    form: {
      title: '',
      liststyle: '',
      content: '',
      categoryId: ''
    },
    modalTitle:'新增文章'
  };
  //获取数据
  findArticleByPage = () => {
    axios.get('/manager/article/findArticle', {
      params: {
        page: this.state.currentPage - 1,
        pageSize: this.state.pagination.pageSize
      }
    })
      .then((res) => {
        //res 是 axios 封装过后的数据 其中的data才是后台给的数据
        console.log(res.data);
        this.setState({
          tableData: res.data.list,
          pagination: {...this.state.pagination, total: res.data.total}
        })
      })
      .catch((error) => {
        console.log(error)
      })
  };

  componentDidMount() {
    this.findArticleByPage();
  }

  //页数更改事件处理程序
  pageChange = (pagination) => {
    console.log(pagination.current);
    this.setState({
      currentPage: pagination.current
    }, () => {
      this.findArticleByPage()
    })
  };
  toBatchDelete = () => {
    //发送state中的ids给后台 axios的post默认是JSON数据 我们使用的接口的参数需要表单形式,使用qs.stringify()转换
    axios.post('/manager/article/batchDeleteArticle', {ids: this.state.ids.toString()})
      .then(() => {
        //添加提示 提示用户删除成功
        this.findArticleByPage();
      })
      .catch((err) => {
        console.log(err);
      })
  };

  //控制模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  toSave = e => {
   //保存数据，并且关闭莫太快
    axios.post('/manager/article/saveOrUpdateArticle',this.state.form).then((res)=>{
        this.findArticleByPage();
        this.setState({
          visible:false
        })
      }).catch((err)=>{
        console.log(err)
      })
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  // 模态框显示  如果点了模态框的确定，再获取数据给state，再将state中的数据提交给后台
  toAdd = () => {
    this.setState({
      form: {},
      modalTitle:'新增文章'
    },() => {
      this.findAllCategory();
    });
  };

  //单个删除
  toDelete = (id, title) => {
    let that = this;
    confirm({
      title: '请确认',
      content: `是否删除${title}`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        axios.get('/manager/article/deleteArticleById', {params: {id}})
          .then(() => {
            that.findArticleByPage()
          })
          .catch((err) => {
            console.log(err)
          })
      },
      onCancel() {
      },
    });

  };

  //编辑
  toEdit = (record) => {
    //console.log(record);
    this.setState({
      modalTitle:'编辑文章'
    });
    let {form} = this.state;
    form = {
      ...form,
      id: record.id,
      title :record.title,
      liststyle: record.liststyle,
      content: record.content,
      categoryId: record.categoryId?record.categoryId:'',
      publishtime: config.parseDate(),
      readtimes:0
    };
    this.setState({form});
    this.findAllCategory()
  };
  //查找所有的栏目信息
  findAllCategory = () => {
    axios.get('/manager/category/findAllCategory').then((res) => {
      //console.log(res)
      //显示模态框
      this.setState({
        categoryData: res.data
      }, () => {
        this.showModal()
      })
    }).catch((err) => {
      console.log(err)
    })
  };

  //表单控件更改
  formChange = (attr,e) => {
    let {form} = this.state;
    form[attr] = e.target.value;
    this.setState({
      form
    })
  };
  //下拉列表控件更改 Select的change上直接携带了value值
  selectChange = (value) => {
    let {form} = this.state;
    form.categoryId = value;
    this.setState({form})
  };
  render() {
    const {form} = this.state;
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
        title: '文章标题',
        dataIndex: 'title',
      },
      {
        title: '所属栏目',
        dataIndex: 'category.name',
      },
      {
        title: '排列方式',
        dataIndex: 'liststyle',
      },
      {
        title: '发布时间',
        dataIndex: 'publishtime',
      },
      {
        title: '阅读次数',
        dataIndex: 'readtimes',
      },
      {
        title: '操作',
        dataIndex: '',
        render: (text, record) => {
          //text dataIndex对应的属性值
          //record 表格中的整个一行,对象
          return (
            <div>
              <Icon type='edit' style={{color:'green',marginRight:5}} onClick={this.toEdit.bind(this, record)}>编辑</Icon>
              <Icon type='delete' style={{color:'red'}} onClick={this.toDelete.bind(this, record.id, record.title)}>删除</Icon>
            </div>
          )
        }
      },
    ];
    return (
      <div className='article-manage'>
        <div className='btns-div'>
          <Button type='primary' onClick={this.toAdd}>新增</Button>
          <Button type='danger' onClick={this.toBatchDelete}>批量删除</Button>
        </div>
        <div className='table-div'>
          <Table
            rowKey='id'
            dataSource={this.state.tableData}
            rowSelection={rowSelection}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.pageChange}
          />
        </div>
        <div>
          <Modal
            title={this.state.modalTitle}
            visible={this.state.visible}
            onOk={this.toSave}
            onCancel={this.handleCancel}
            okText='确定'
            cancelText='取消'
          >
            {/*{JSON.stringify(form)}*/}
            <Form {...formItemLayout}>
              <Form.Item label="标题">
                <Input value={form.title} onChange={this.formChange.bind(this, 'title')}/>
              </Form.Item>
              <Form.Item label="所属栏目">
                <Select value={form.categoryId} onChange={this.selectChange}>
                  {
                    this.state.categoryData.map((item, index) => (
                      <Option value={item.id} key={index}>{item.name}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="排列方式">
                <Radio.Group>
                  <Radio
                    value="style-one"
                    checked={form.liststyle === 'style-one'}
                    onChange={this.formChange.bind(this, 'liststyle')}
                  >排列方式1</Radio>
                  <Radio
                    value="style-two"
                    checked={form.liststyle === 'style-two'}
                    onChange={this.formChange.bind(this, 'liststyle')}
                  >排列方式2</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="内容">
                <TextArea rows='4' value={form.content} onChange={this.formChange.bind(this, 'content')}/>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    )
  }
}
