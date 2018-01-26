// import { Auth } from '../../utils/Api';

export default class Actions {
  public static LOGIN = {
    PENDING: `LOGIN_PENDING`,
    SUCCESS: `LOGIN_SUCCESS`,
    ERROR: `LOGIN_ERROR`
  };

  public static UPDATE = {
    USERNAME: 'LOGIN_UPDATE_USERNAME',
    PASSWORD: 'LOGIN_UPDATE_PASSWORD',

    FIRSTNAME: 'REGISTER_UPDATE_FIRSTNAME',
    LASTNAME: 'REGISTER_UPDATE_LASTNAME',
    PHONE: 'REGISTER_UPDATE_PHONE',
    EMAIL: 'REGISTER_UPDATE_EMAIL'
  };

  public static MODE = {
    LOGIN: 'LOGIN_MODE_LOGIN',
    REGISTER: 'LOGIN_MODE_REGISTER'
  };

  public static REGISTER = {
    FIRSTNAME: 'REGISTER_FIRSTNAME',
    LASTNAME: 'REGISTER_LASTNAME',
    PHONE: 'REGISTER_PHONE',
    EMAIL: 'REGISTER_EMAIL'
  };

  public static login(username: string, password: string) {
    let t = Actions.LOGIN;
    // return Auth.Login([ t.PENDING, t.SUCCESS, t.ERROR], {username, password});
  }

  public static changeUsername(username: string) {
    return {
      type: Actions.UPDATE.USERNAME,
      data: username
    };
  }

  public static SwitchToRegisterMenu() {
    return {
      type: Actions.MODE.REGISTER
    };
  }

  public static SwitchToSignInMenu() {
    return {
      type: Actions.MODE.LOGIN
    };
  }
}
