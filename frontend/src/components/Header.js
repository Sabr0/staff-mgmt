import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import 'antd/dist/antd.css';
import { Layout, Menu, Icon } from 'antd';


export class Header extends React.Component{

  render() {
    const { Header } = Layout;

    return(

      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <img src={logo} className="App-logo" alt="logo" />

        <div className="logo">
          <Link to="/" ><p className="App-name">Employee List</p></Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1"><Link to="/"><Icon type="apple" />Home Page</Link></Menu.Item>

        </Menu>
      </Header>

    );
  }
}
export default Header;

