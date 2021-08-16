import request from "@/utils/request"

/**获取oss上传策略和签名
 * 
 * @returns 
 */
export function ossConfig(){
    return request('/auth/oss/token')
}