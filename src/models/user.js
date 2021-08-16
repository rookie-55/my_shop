import { queryCurrent } from '@/services/user';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    //获取当前登录用户信息
    *fetchCurrent(_, { call, put }) {
      //看本地是否有用户信息，没有再请求
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))

      console.log(`userInfo`, userInfo)

      if(!userInfo){
        userInfo = yield call(queryCurrent);
 
        //判断是否获取到用户信息
        if(userInfo.id !== undefined){
          //把用户信息存入localStorage
          localStorage.setItem('userInfo',JSON.stringify(userInfo))
        }

      }

      yield put({
        type: 'saveCurrentUser',
        payload: userInfo,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default UserModel;
