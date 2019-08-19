import React,{Component} from 'react';
import {connect} from 'react-redux';
import { Modal, Button, Form, Input, Select, message, DatePicker, Upload, Icon, } from 'antd';
import moment from 'moment';

import {getUsers, addUser} from '../actions/users';


import 'antd/dist/antd.css';
import defaultFemaleImg from '../consts/img'

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

class AddEmpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      loading: false,
    }
  }

  componentDidMount() {
    this.props.getUsers();
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
          name: values.name,
          title: values.title,
          gender: values.gender,
          startDate: values.startDate,
          avatar: this.state.imageUrl ? this.state.imageUrl : (values.gender === 'Female' ? defaultFemaleImg : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"),
          officePhone: values.officePhone,
          cellPhone: values.cellPhone,
          email: values.email,
          manager: values.manager,
        }

        message.success('Created a new Employee successfully!');
        this.props.form.resetFields();
        this.setState({ visible: false, confirmLoading: false });
        this.props.addUser(newUser);

      } else {
        message.error('Enter all input areas');
        this.setState({ visible: false, confirmLoading: false });
      }
    });

  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }


  render() {
    const { visible, confirmLoading } = this.state;
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
    const imageUrl = this.state.imageUrl;

    const {users} = this.props;
    let addUser;

    if (users.isLoading) {
      addUser = <p className="loading">Loading</p>;
    }
    else if (users.data.length !== 0) {
      addUser = (
        <div>
          <Form className="register-form">

            <FormItem
              {...formItemLayout}
              label="Name"
            >
              {getFieldDecorator('name', {
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
                initialValue: moment(new Date(), 'DD/MM/YYYY'),
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
              })(
                <Select
                  placeholder="Please select your Manager"
                >
                  <Option value={ null }>unknown manager</Option>
                  {users.data.map(ele => {
                    return (
                      <Option
                        key={ele._id}
                        value={ele._id}>
                        {ele.name + " [" + ele.title + "]"}</Option>
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

    return (
      <div className="add-mech">
        <Button type="primary" onClick={this.showModal}>
          Add New Employee
        </Button>

        <Modal title="Add Employee"
               visible={visible}
               onOk={this.handleOk}
               okText="Add Employee"
               confirmLoading={confirmLoading}
               onCancel={this.handleCancel}
        >
          {addUser}
        </Modal>
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    users: state.users
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUsers: () => {
      dispatch(getUsers());
    },
    addUser: (user) => {
      dispatch(addUser(user));
    },
  }
}

export const AddEmp = connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddEmpForm));