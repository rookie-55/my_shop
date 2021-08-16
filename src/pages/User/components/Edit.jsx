import React, {useEffect, useState} from 'react'
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message, Modal, Skeleton} from 'antd';
import { upDateUser, showUser } from '@/services/user';


const Edit = (props) => {

    const [initialValues, setInitialValues] = useState(undefined)

    const {isModalVisible} = props
    const {isShowModal} = props
    const {actionRef} = props
    const {editId} = props


    //当组件挂载完成后运行x
    useEffect( async ()=>{
        //发送请求，获取用户详情
        if(editId !== undefined){
            const response = await showUser(editId)
            setInitialValues({
                name:response.name,
                email:response.email
            })
        }
    },[])


    /**修改用户
     * 
     * @param {*} value 表单数据 
     */
    const editUser = async values => {
        console.log('values :>> ', values);
        //发送请求，更新用户
        const response1 = await upDateUser(editId, values)
        if(response1.status === undefined){
            message.success('更新成功')
            actionRef.current.reload()
            isShowModal(false)
        }else{
            message.error('更新失败')
        }
    }

    return (
        <Modal 
                title="编辑用户" 
                visible={isModalVisible} 
                onCancel={() => isShowModal(false)}
                footer={null}
                destroyOnClose={true}
            >
                {
                    initialValues === undefined ? <Skeleton active={true} paragraph={ { rows: 4 } } /> :
                    <ProForm
                        initialValues={ initialValues }
                        onFinish={ values => editUser(values)}
                    >
                        <ProFormText
                            name="name"
                            label="昵称"
                            placeholder="请输入昵称"
                            rules={[
                                {required: true, message: '请输入昵称'}
                            ]}
                        />
                        <ProFormText
                            name="email"
                            label="邮箱"
                            placeholder="请输入邮箱"
                            rules={[
                                {required: true, message: '请输入邮箱'},
                                {type: 'email', message: '邮箱格式不正确'}
                            ]}
                        />
                        
                    </ProForm>
                }
                
            </Modal>
    )
}


export default Edit