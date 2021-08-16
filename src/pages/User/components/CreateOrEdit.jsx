import React, {useEffect, useState} from 'react'
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message, Modal, Skeleton} from 'antd';
import { upDateUser, showUser, addUser } from '@/services/user';


const CreateOrEdit = (props) => {

    //将表单初始化的值设置为状态，在编辑的时候，使用这个状态
    const [initialValues, setInitialValues] = useState(undefined)

    const {isModalVisible} = props//模态框是否显示
    const {isShowModal} = props//操作模态框显示或隐藏
    const {actionRef} = props//父组件传过来的表格的引用，可以用来操作表格，比如刷新表格
    const {editId} = props//要编辑的ID，添加的时候是undefined，只有编辑采用

    //添加或者编辑的描述文本
    const type = editId === undefined ? '添加' : '编辑'

    //当组件挂载完成后运行
    useEffect( async ()=>{
        //发送请求，获取用户详情
        if(editId !== undefined){
            const response = await showUser(editId)
            //获取数据之后，修改状态，状态改变，组件重新渲染，骨架屏消失，表单出现
            setInitialValues({
                name:response.name,
                email:response.email
            })
        }

    },[])

    /**提交表单，执行编辑或者添加
     * 
     * @param {*} values 
     */
    const handleSubmit = async (values) => {
        let response1 = {}
        if(editId === undefined){//执行添加
            //发送请求，添加用户
            response1 = await addUser(values)
        }else{//执行编辑
            //发送请求，更新用户
            response1 = await upDateUser(editId, values)
        }

        if(response1.status === undefined){
            message.success(`${type}成功`)
            actionRef.current.reload()
            isShowModal(false)
        }else{
            message.error(`${type}失败`)
        } 
    }

    return (
        <Modal 
                title={`${type}用户`} 
                visible={isModalVisible} 
                onCancel={() => isShowModal(false)}
                footer={null}
                destroyOnClose={true}
            >
                {
                    //只有在编辑的情况下，并且要显示的数据还没有返回，这时候才显示骨架屏
                    initialValues === undefined && editId !== undefined ? <Skeleton active={true} paragraph={ { rows: 4 } } /> :
                    <ProForm
                        initialValues={ initialValues }
                        onFinish={ values => handleSubmit(values)}
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
                        
                        {
                            //只有添加有密码框
                            editId !== undefined ? '' :
                                <ProFormText.Password
                                    name="password"
                                    label="密码"
                                    placeholder="请输入密码"
                                    rules={[
                                        {required: true, message: '请输入密码'},
                                        {min: 6, message: '密码最小6位'}
                                    ]}
                                />
                        }
                    </ProForm>
                }
                
            </Modal>
    )
}


export default CreateOrEdit