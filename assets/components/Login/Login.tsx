import * as React from 'react';

import { connect } from 'react-redux';

import * as style from './Login.scss';

// import { Image } from 'web-components';

import Actions from './Actions';

class Login extends React.Component<any, {}> {
  renderLogin(): JSX.Element {
    const { dispatch } = this.props;
    return (
      <div className={style.LoginForm}>
        <div className={style.phoneStyle}>
          <div className={style.topPhoneStyle}>
            {/* <Image
              className={style.brandLogo}
              src="/res/division/WG-header.svg"
            /> */}
            <div className={style.InputStyle}>
              <input
                onChange={e => dispatch(Actions.changeUsername(e.target.value))}
                type="text"
                placeholder="User Email"
              />
            </div>
            <div className={style.InputStyle}>
              <input type="password" placeholder="Password" />
            </div>
          </div>
          <div className={style.buttomPhoneStyle}>
            <div className={style.FromButton}>
              <button>Login </button>
            </div>
            <a href="#">
              <p>Forgot Password?</p>
            </a>
            <a href="onClick={() => dispatch(Actions.SwitchToRegisterMenu())}">
              <p>Create An Account </p>
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderRegistr(): JSX.Element {
    return (
      <div className={style.LoginForm}>
        <div className={style.InputStyle}>
          <input type="text" placeholder="First Name" />
        </div>
        <div className={style.InputStyle}>
          <input type="text" placeholder="Last Name" />
        </div>
        <div className={style.InputStyle}>
          <input type="phone" placeholder="Phone Number" />
        </div>
        <div className={style.InputStyle}>
          <input type="email" placeholder="Email" />
        </div>
        <div className={style.InputStyle}>
          <input type="password" placeholder="Password" />
        </div>
        <div className={style.InputStyle}>
          <input type="password" placeholder="Repeat Password" />
        </div>
        <div className={style.FromButton}>
          <button>REGISTER </button>
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    const { dispatch, register } = this.props;
    console.log(this.props);
    return (
      <div className={style.container}>
        <div className={style.LoginBox}>
          <div className={style.LoginBoxTitles}>
            <button
              onClick={() => dispatch(Actions.SwitchToSignInMenu())}
              className={`${style.title} ${register ? '' : style.active}`}
            >
              Sign In
            </button>
            <button
              onClick={() => dispatch(Actions.SwitchToRegisterMenu())}
              className={`${style.title} ${register ? style.active : ''}`}
            >
              Register
            </button>
          </div>
          {register ? this.renderRegistr() : this.renderLogin()}

          <hr />
          <div className={style.loginGuest}>
            <a href="#">
              <p>Or continue as Guest</p>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({ ...state.Login }))(Login);
