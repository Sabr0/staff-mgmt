import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Table, Avatar, } from 'antd';

import {getCurrentUser, } from '../actions/curUser';


class ManagerDetail extends Component {

  componentDidMount() {
    this.props.getCurrentUser(this.props.match.params.id);
  }


  render () {
    const {curUser} = this.props;
    let curUserUI;
    if (curUser.isLoading) {
      curUserUI = <p className="loading">Loading</p>;
    }
    else if (curUser.data.length !== 0) {
      const data = [curUser.data];

      const columns = [{
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (avatar) => ( <Avatar src={avatar} alt="img"/>),
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
      },{
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (startDate) => (<span>{startDate ? startDate.substr(0,10) : null}</span>),
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
        render: (email) => (<a href='mailto:' >{email}</a>),
      },{
        title: 'Manager',
        dataIndex: 'manager.name',
        key: 'manager',
      },{
        title: 'Direct Reports',
        dataIndex: 'directReports',
        key: 'directReports',
      }];

      curUserUI = (
        <Table
          rowKey={record => record._id}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      );

    }

    return (
      <div>
        {curUserUI}
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    curUser: state.curUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: (id) => {
      dispatch(getCurrentUser(id));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagerDetail);