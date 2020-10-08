import React, { PureComponent } from 'react';
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'


class Login extends PureComponent {


  onLogin = () => {
    this.props.auth.login();
  }

  render() {
    return (
      <div>
        <h1>Please log in</h1>

        <Button onClick={this.onLogin} size="huge" color="olive">
          Log in
        </Button>
      </div>
    )
  }
}

export default Login;