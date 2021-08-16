import request from '@/utils/request';

/**
 * 关于request第二个参数options，常用的两个传参方式：
 * 
 * 1.param传参， 也是query传参，多用于get请求，查询数据时使用，类型时对象或者url
 * 2.data传参，也就是body传参，多用于提交表单数据，类型是any，推荐使用对象
 */


// 获取当前用户登录信息
export async function queryCurrent() {
  return request('/admin/user');
  // return request.post('/auth/login');
}

export async function getUsers(params){
  return request('/admin/users', {params});
}

/**
 * 禁用和启用用户
 * @param {*} uid 用户id
 * @returns 
 */
export async function lockUser(uid){
  return request.patch(`/admin/users/${uid}/lock`);
}

/**添加用户
 * 
 * @param {*} values 
 */
export async function addUser(data){
  return request.post('/admin/users', {data})
}

/**用户详情
 * 
 * @param {*} values 
 */
 export async function showUser(editId){
  return request.get(`/admin/users/${editId}`)
}

/**更新用户
 * 
 * @param {*} values 
 */
export async function upDateUser(editId, data){
  return request.put(`/admin/users/${editId}`, {data})
}