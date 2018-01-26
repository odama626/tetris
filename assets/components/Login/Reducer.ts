import Actions from './Actions';

const initialState = {
  username: '',
  register: false,
  login: false,
}


export default function (state:any=initialState, action) {
  switch (action.type) {
    case Actions.UPDATE.USERNAME:
      return {
        ...state,
        username: action.data

      }
      case Actions.MODE.REGISTER:
        return{
          ...state,
         register: true
        }


          case Actions.MODE.LOGIN:
            return{
              ...state,
             register: false
            }



  }
  return state;
}
