import React, { Component  } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import Header from './Header';
import Home from './Home';
import ManagerDetail from './ManagerDetail';
import DR_Detail from './DR_Detail';

import 'antd/dist/antd.css';


const { Content, Footer } = Layout;

class App extends Component {

  render() {

    return (
      <BrowserRouter>
        <div className="App">
          <Layout className="layout">
            <Header/>

            <Content style={{ padding: '70px 50px 0', }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Employee List</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ background: '#fff', padding: 24, minHeight: 780 }}>
                <Switch>
                  <Route exact path="/" component={Home}/>
                  <Route exact path="/employees/:id" component={ManagerDetail}/>
                  <Route exact path="/dr/:id" component={DR_Detail}/>
                </Switch>
              </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </div>
      </BrowserRouter>
    );
  }
}

export default (App);