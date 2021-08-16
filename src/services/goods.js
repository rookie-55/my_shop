import request from '@/utils/request';



/**取商品列表
 * 
 */
export async function getGoods(params){
  return request('/admin/goods', {params});
}

/**上架和下架商品
 * 
 * @param {*} goodsId 商品id
 * @returns 
 */
export async function isOn(goodsId){
  return request.patch(`/admin/goods/${goodsId}/on`);
}
/**推荐和不推荐商品
 * 
 * @param {*} goodsId 商品id
 * @returns 
 */
export async function isRecommend(goodsId){
  return request.patch(`/admin/goods/${goodsId}/recommend`);
}

/**添加商品
 * 
 * @param {*} values 
 */
export async function addGoods(data){
  return request.post('/admin/goods', {data})
}

/**商品详情
 * 
 * @param {*} values 
 */
 export async function showGoods(editId){
  return request.get(`/admin/goods/${editId}?include=category`)
}

/**更新商品
 * 
 * @param {*} values 
 */
export async function upDateGoods(editId, data){
  return request.put(`/admin/goods/${editId}`, {data})
}