import { history } from 'umi';
import { fakeAccountLogin, layout } from '@/services/login';
import {message} from 'antd'
const Model = {
  namespace: 'login',
  state: {
  },
  effects: {
    *login({ payload }, { call, put }) {
      //发送请求，执行登录
      const response = yield call(fakeAccountLogin,payload);

      //判断是否登录成功
      if(response.status === undefined){
        //提示登录成功
        message.success('登录成功')

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        }); // Login successfully

        //跳转到首页
        history.replace('/');
      }
    },

    //退出登录
    *logout(_, {call}) {
      //loading
      const load = message.loading('退出中......')

      //请求API，退出登录
      const response = yield call(layout)

      //判断是否请求成功
      if(response.status === undefined){
        
        //删除本地存储的Token和userInfo
        localStorage.removeItem('userInfo')
        localStorage.removeItem('access_token')
        //提示退出成功
        message.success('退出成功')

        //重定向
        history.replace('/login');
      }
      load()
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      //将token存入localStorage
      localStorage.setItem('access_token', payload.access_token)
      return { ...state };
    },
  },
};
export default Model;
