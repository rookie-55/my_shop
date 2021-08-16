import React, {useEffect, useState} from 'react'
import ProForm, { ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-form';
import { UploadOutlined } from '@ant-design/icons';
import { message, Modal, Skeleton, Cascader, Button, Image } from 'antd';
import { upDateGoods, showGoods, addGoods } from '@/services/goods';
import { getCategory } from '@/services/category';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import Editor from '@/components/Editor';


const CreateOrEdit = (props) => {

    //将表单初始化的值设置为状态，在编辑的时候，使用这个状态
    const [initialValues, setInitialValues] = useState(undefined)
    const [options, setOptions] = useState([])

    //定义Form实例，用来操作表单
    const [formObj] = ProForm.useForm()
    //设置表单的值
    //formObj.setFieldsValue({fieldName:value})

    const {isModalVisible} = props//模态框是否显示
    const {isShowModal} = props//操作模态框显示或隐藏
    const {actionRef} = props//父组件传过来的表格的引用，可以用来操作表格，比如刷新表格
    const {editId} = props//要编辑的ID，添加的时候是undefined，只有编辑采用

    //添加或者编辑的描述文本
    const type = editId === undefined ? '添加' : '编辑'

    //当组件挂载完成后运行
    useEffect( async ()=>{
        //查询分类数据
        const resCategory = await getCategory()//这里有个问题，用了await后，选择框会出现白屏的情况
        if(resCategory.status === undefined) setOptions(resCategory)

        //发送请求，获取商品详情
        if(editId !== undefined){
            const response = await showGoods(editId)
            //获取数据之后，修改状态，状态改变，组件重新渲染，骨架屏消失，表单出现
            const {pid, id} = response.category
            const defaultCategory = pid === 0 ? [id] : [pid, id]
            setInitialValues({...response, category_id: defaultCategory})
        }

    },[])

    /**文件上传成功后，设置cover字段的value
     * 
     * @param {*} fileKey 
     */
    const setConverKey = (fileKey) => {
        formObj.setFieldsValue({'cover':fileKey})
    }
    /**编辑器输入内容后，设置details字段的value
     * 
     * @param {*} fileKey 
     */
    const setDeatils = (content) => {
        formObj.setFieldsValue({'details':content})
    }

    /**提交表单，执行编辑或者添加
     * 
     * @param {*} values 
     */
    const handleSubmit = async (values) => {
        let response1 = {}
        if(editId === undefined){//执行添加
            //发送请求，添加用户
            response1 = await addGoods({...values, category_id: values.category_id[1]})
        }else{//执行编辑
            //发送请求，更新商品
            response1 = await upDateGoods(editId, {...values, category_id: values.category_id[1]})
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
                title={`${type}商品`} 
                visible={isModalVisible} 
                onCancel={() => isShowModal(false)}
                footer={null}
                destroyOnClose={true}
            >
                {
                    //只有在编辑的情况下，并且要显示的数据还没有返回，这时候才显示骨架屏
                    initialValues === undefined && editId !== undefined ? <Skeleton active={true} paragraph={ { rows: 4 } } /> :
                    <ProForm
                        form = {formObj}
                        initialValues={ initialValues }
                        onFinish={ values => handleSubmit(values)}
                    >
                        <ProForm.Item
                            name="category_id"
                            label="分类"
                            rules={[
                                {required: true, message: '请选择分类'},
                            ]}
                        >
                            <Cascader fieldNames={ { label: 'name', value: 'id' } } options={options} placeholder="请选择分类" />
                        </ProForm.Item>

                        <ProFormText
                            name="title"
                            label="商品名"
                            placeholder="请输入商品名"
                            rules={[
                                {required: true, message: '请输入商品名'},
                            ]}
                        />
                        <ProFormTextArea
                            name="description"
                            label="描述"
                            placeholder="请输入描述"
                            rules={[
                                {required: true, message: '请输入描述'},
                            ]}
                        />
                        <ProFormDigit 
                            name="price"
                            label="价格"
                            placeholder="请输入价格"
                            min={0}
                            max={99999999}
                            rules={[
                                {required: true, message: '请输入价格'},
                            ]}
                        />
                        <ProFormDigit 
                            name="stock"
                            label="库存"
                            placeholder="请输入库存"
                            min={0}
                            max={99999999}
                            rules={[
                                {required: true, message: '请输入库存'},
                            ]}
                        />

                        <ProFormText name="cover" hidden={true}/>

                        <ProForm.Item
                            name="cover"
                            label="商品主图"
                            rules={[
                                {required: true, message: '请上传图片'},
                            ]}
                        >
                            <div>
                                <AliyunOSSUpload
                                    accept="image/*"
                                    setConverKey={setConverKey}
                                    showUploadList={true}
                                >
                                    <Button icon={<UploadOutlined />}>点击上传商品主图</Button>
                                </AliyunOSSUpload>
                                {
                                    initialValues === undefined || !initialValues.cover_url ? '' :
                                    <Image width={200} src={initialValues.cover_url} />
                                }
                            </div>
                        </ ProForm.Item>

                        <ProForm.Item
                            name="details"
                            label="商品详情"
                            
                            rules={[
                                {required: true, message: '请输入详情'},
                            ]}
                        >
                            <Editor 
                                setDeatils = {setDeatils}
                                content = {initialValues === undefined ? '' : initialValues.details}
                            />
                        </ ProForm.Item>

                        

                    </ProForm>
                }
                
            </Modal>
    )
}


export default CreateOrEdit