import React, {Component} from 'react';
import { Layout } from 'antd';


class Footer extends Component{

  render() {

    const { Footer } = Layout;
    return(
      <div>
        <Layout>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </div>
    );
  }
}
export default Footer;