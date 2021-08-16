import request from '@/utils/request';



/**取分类列表
 * 
 */
export async function getCategory(){
  return request('/admin/category');
}

