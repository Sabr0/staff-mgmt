import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Table, Avatar, } from 'antd';

import {getCurrentDR} from '../actions/curDR';


class DR_Detail extends Component {

  componentDidMount() {
    this.props.getCurrentDR(this.props.match.params.id);
  }


  render () {
    const {curDR} = this.props;
    let curUserUI;
    if (curDR.isLoading) {
      curUserUI = <p className="loading">Loading</p>;
    }
    else if (curDR.data.length !== 0) {
      const data = [curDR.data];
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
        render: (startDate) => (<span>{startDate}</span>),
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
          dataSource={curDR.data}
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
    curDR: state.curDR
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCurrentDR: (id) => {
      dispatch(getCurrentDR(id));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DR_Detail);