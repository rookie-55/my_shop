import request from '@/utils/request';
//执行登录，获取token
export async function fakeAccountLogin(data) {
  //若想走mock，就用这个
  //return request('/login/account', {
  return request('/auth/login', {
    method: 'POST',
    data,
  });
}

//退出登录
export async function layout(){
  return request.post('/auth/logout')
}



// export async function getFakeCaptcha(mobile) {
//   return request(`/login/captcha?mobile=${mobile}`);
// }
