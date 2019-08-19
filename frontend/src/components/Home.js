import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Input, Table, Popconfirm, Avatar, Icon, Button, Modal, Form, DatePicker, Upload, Spin, } from 'antd';
import InfiniteScroll from "react-infinite-scroller";
import moment from 'moment';
import { AddEmp } from './AddEmp';
import {getUsers, deleteUser} from '../actions/users';
import {getCurrentUser, editCurrentUser, } from '../actions/curUser';
import {getCurrentDR} from '../actions/curDR';

import {message, Select} from 'antd/lib/index'


const FormItem = Form.Item;
const Option = Select.Option;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}


class Home extends Component{

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      searchText: '',
      sort: null,
      delete: false,
      visible: false,
      confirmLoading: false,
      loading: false,
    };
  }

  componentDidMount () {
    this.props.getUsers();
  }

  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  }


  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }

  handleDelete = id => {
    this.props.deleteUser(id);
  }

  handleRowClick = id => {
    this.props.getCurrentUser(id);
  }


  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });

    this.props.form.validateFieldsAndScroll((err, values) => {

      if (!err) {
        let newUser = {
          _id: this.props.curUser.data._id,
          name: values.name,
          title: values.title,
          gender: values.gender,
          startDate: values.startDate,
          avatar: this.state.imageUrl ? this.state.imageUrl: values.avatar,
          officePhone: values.officePhone,
          cellPhone: values.cellPhone,
          email: values.email,
          manager: values.manager,
        }

        if (newUser.name === this.props.curUser.name
          && newUser.title === this.props.curUser.title
          && newUser.gender === this.props.curUser.gender
          && newUser.startDate === this.props.curUser.startDate
          && newUser.officePhone === this.props.curUser.officePhone
          && newUser.cellPhone === this.props.curUser.cellPhone
          && newUser.email === this.props.curUser.email
          && newUser.manager === this.props.curUser.manager
          && newUser.avatar === this.props.curUser.avatar
        ) {
          message.error('Did not change anything');
        } else {
          this.props.editCurrentUser(this.props.curUser.data._id, newUser);
          message.success('Update successfully!');
          this.props.form.resetFields();
          this.setState({ visible: false, confirmLoading: false });
        }

      } else {
        message.error('Enter all input areas');
        this.setState({ visible: false, confirmLoading: false });
      }
    });

  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }


  handleManagerClick = record => {
    if (record.manager){
      this.props.history.push(`/employees/${record.manager._id}`);
    }
  }

  handleDRClick = id => {
    if (id){
      this.props.history.push(`/dr/${id}`);
      this.props.getCurrentDR(id);
    }
  }

  validManager = (users) => {

  }

  findDR = users => {
    const map = new Map();
    if (users.length > 0) {
    users.forEach(ele1 => {
      users.forEach(ele2 => {
        if (ele2.manager.name === ele1.name) {
          if (map.get(ele1.name)) {
            map.get(ele1.name).push(ele2.name);
          } else {
            map.set(ele1.name, [ele2.name])
          }
        }
      });
    });
    }
  }

  render() {

    const {users} = this.props;

    let usersUI;
    if (users.isLoading) {
      usersUI = <p className="loading">Loading</p>;
    }
    else if (users.error) {
      usersUI = <p style={{ color: 'red' }}>{users.error}</p>;
    }
    else if (users.data.length !== 0) {
      const data = users.data;
   
      const columns = [{
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (avatar) => ( <Avatar src={avatar} alt="img"/>),
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div className="custom-filter-dropdown">
            <Input
              ref={ele => this.searchInput = ele}
              placeholder="Search name"
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={this.handleSearch(selectedKeys, confirm)}
            />
            <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
            <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
          </div>
        ),
        filterIcon: filtered => <Icon type="smile-o" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            });
          }
        },
        render: (text) => {
          const { searchText } = this.state;
          return searchText ? (
            <span>
            {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
              fragment.toLowerCase() === searchText.toLowerCase()
                ? <span key={i} className="highlight">{fragment}</span> : fragment// eslint-disable-line
            ))}
          </span>
          ) : <span className="edit-modal-cell">{text}</span>;
        },

        onCell: record => ({
          onClick: () => {
            this.handleRowClick(record._id);
            this.showModal();
          }
        })
      }, {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        filters: this.state.search,
      }, {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        render: gender => (<span>{gender === "null" ? null : gender}</span>)
      },{
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (startDate) => (<span>{startDate.substr(0,10)}</span>),
      }, {
          title: 'Office Phone',
          dataIndex: 'officePhone',
          key: 'officePhone',
          render: (officePhone) => (<a href='tel:' >{officePhone}</a>),
      }, {
          title: 'Cell Phone',
          dataIndex: 'cellPhone',
          key: 'cellPhone',
          render: (cellPhone) => (<a href='tel:' >{cellPhone}</a>),
      }, {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
        render: (email) => (<a href="mailto:">{email}</a>),
      },{
        title: 'Manager',
        dataIndex: 'manager.name',
        key: 'manager',
        onCell: record => ({
          onClick: () => {
            this.handleManagerClick(record);
          }
        }),
        render: manager => (<span className="table-manager">{manager}</span>)
      },{
        title: 'Direct Reports',
        dataIndex: 'directReports',
        key: 'directReports',
        onCell: record => ({
          onClick: () => {
            this.handleDRClick(record._id);
          }
        }),
        render: directReports => (<span className="table-manager">{directReports === 0 ? null : directReports}</span>)

      }, {
        title: '',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            data.length >= 1
              ? (
                <span>

                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record._id)}>
                  <Icon className="homepage-delete" type="close-circle" theme="twoTone" />
                </Popconfirm>
                </span>
              ) : null
          );
        },
      }];



      const { visible, confirmLoading, imageUrl } = this.state;
      const { getFieldDecorator } = this.props.form;

      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

      let editUI;
      const {curUser} = this.props;

      if (curUser.isLoading) {
        editUI = <p className="loading">Loading</p>;
      } else if (curUser.data.length !== 0) {
        let managerList = new Map();
        users.data.filter(ele => ele._id !== curUser.data._id).forEach(ele => managerList.set(ele._id, ele.name));
        let testManager = users.data.filter(ele => ele._id !== curUser.data._id);
        let validManager = null;

        editUI = (
          <div>
            <Form className="register-form">
              <FormItem
                {...formItemLayout}
                label="Name"
              >
                {getFieldDecorator('name', {

                  initialValue: curUser.data.name,
                  rules: [{ required: true, message: 'Please input name!', whitespace: true }],
                })(
                  <Input
                    placeholder="Name"
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Title"
              >
                {getFieldDecorator('title', {
                  initialValue: curUser.data.title,
                  rules: [{ required: true, message: 'Please input title!', whitespace: true }],
                })(
                  <Input
                    placeholder="Title"
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Gender"
                hasFeedback
              >
                {getFieldDecorator('gender', {
                  initialValue: curUser.data.gender,
                })(
                  <Select
                    placeholder="Please select your gender"
                  >
                    <Option value="Female">Female</Option>
                    <Option value="Male">Male</Option>
                    <Option value="null">Not To Say</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Start Date"
              >
                {getFieldDecorator('startDate',  {
                  initialValue: curUser.data.startDate ? moment(curUser.data.startDate.substr(0,10), 'YYYY/MM/DD') : null,
                })(
                  <DatePicker
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="E-mail"
              >
                {getFieldDecorator('email', {
                  initialValue: curUser.data.email,
                  rules: [{
                    type: 'email', message: 'The input is not valid E-mail!',
                  }, {
                    required: true, message: 'Please input your E-mail!',
                  }],
                })(
                  <Input placeholder="Please input your e-mail"/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Office Phone"
              >
                {getFieldDecorator('officePhone', {
                  initialValue: curUser.data.officePhone,
                  rules: [{ required: true, message: 'Please input Office Phone!', whitespace: true }],
                })(
                  <Input
                    placeholder="Office Phone"
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Cell Phone"
              >
                {getFieldDecorator('cellPhone', {
                  initialValue: curUser.data.cellPhone,
                  rules: [{ required: true, message: 'Please input Cell Phone!', whitespace: true }],
                })(
                  <Input
                    placeholder="Cell Phone"
                  />
                )}
              </FormItem>


              <FormItem
                {...formItemLayout}
                label="Manager"
                hasFeedback
              >
                {getFieldDecorator('manager', {
                  initialValue: curUser.data.manager ? curUser.data.manager._id : null ,
                })(
                  <Select
                    placeholder="Please select your Manager"
                  >
                    <Option value={null}>unknown manager</Option>
                    {testManager.map(ele => {
                      return (
                        <Option
                          key={ele._id}
                          value={ele._id}>
                          {ele.name}</Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="avatar"
              >
                {getFieldDecorator('avatar', {
                  initialValue: curUser.data.avatar,
                })(
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="//jsonplaceholder.typicode.com/posts/"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                  </Upload>
                )}
              </FormItem>

            </Form>
          </div>
        );
      }


      usersUI = (
        <div>

          <div className="mgmt-table">
            <Table

              rowKey={record => record._id}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </div>


          <Modal
            title="Edit Employee"
            visible={visible}
            onOk={this.handleOk}
            okText="Save"
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            {editUI}
          </Modal>

        </div>
      );
    }



    return(
      <div>
        <AddEmp/>
        {usersUI}
      </div>
    );
  }
}


const mapStateToProps = state => { 
  return {
    users: state.users,
    curUser: state.curUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUsers: () => {
      dispatch(getUsers());
    },
    deleteUser: (id) => { 
      dispatch(deleteUser(id));
    },
    getCurrentUser: id => {
      dispatch(getCurrentUser(id));
    },
    editCurrentUser: (id, user) => {
      dispatch(editCurrentUser(id, user));
    },
    getCurrentDR: (id) => {
      dispatch(getCurrentDR(id));
    },
  }
}

export default Home = connect(mapStateToProps, mapDispatchToProps)(Form.create()(Home));