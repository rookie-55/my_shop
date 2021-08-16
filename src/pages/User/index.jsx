import React, {useRef, useState} from 'react'
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, Avatar, Switch, message} from 'antd';
import {PlusOutlined, UserOutlined} from '@ant-design/icons';
import { getUsers, lockUser } from '@/services/user';
import CreateOrEdit from './components/CreateOrEdit';

const Index = () => {

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editId, setEditId] = useState(undefined)

    //表格的ref，便于自定义操作表格
    const actionRef = useRef()
    
    //获取用户列表数据
    const getData = async (params) =>{
        const responce = await getUsers(params)
        return {
            data: responce.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: responce.meta.pagination.total,
          };
    }

    /**封禁和启用用户
     * 
     * 
     * @param {*} uid 
     */
    const handlelockUser = async (uid) => {
        const response = await lockUser(uid)
        if(response.status === undefined){
            message.success('操作成功')
        }else{
            message.error('操作失败')
        }
    }

    /**控制模态框显示和隐藏
     * 
     */
    const isShowModal = (show, id = undefined) => {
        setEditId(id)
        setIsModalVisible(show)
    }



    const columns = [
        {
            title: '头像',
            dataIndex: 'avatar_url',
            hideInSearch: true,
            render:(_, record) =>  <Avatar src={record.avatar_url} size={32} icon={<UserOutlined />} />
        },
        {
            title: '姓名',
            dataIndex: 'name'
        },
        {
            title: '邮箱',
            dataIndex : 'email'
        },
        {
            title: '是否禁用',
            dataIndex: 'is_locked',
            hideInSearch: true,
            render:(_, record) =>  <Switch 
                checkedChildren="启用" 
                unCheckedChildren="禁用" 
                defaultChecked={record.is_locked === 0}
                onChange={ ()=> handlelockUser(record.id)}
            />
        },
        {
            title: '创建时间',
            dataIndex : 'created_at',
            hideInSearch: true
        },
        {
            title: '操作',
            render:(_, record) =>  <a onClick={()=> isShowModal(true, record.id) }>编辑</a>
        },
    ]


    return (
        <PageContainer>
            <ProTable
                columns={columns}
                actionRef={actionRef}
                request={async (params = {}) => getData(params)}
                rowKey="id"
                search={ {
                    labelWidth: 'auto',
                } }
                // form={{
                //     // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                //     syncToUrl: (values, type) => {
                //     if (type === 'get') {
                //         return {
                //         ...values,
                //         created_at: [values.startTime, values.endTime],
                //         };
                //     }
                //     return values;
                //     },
                // }}
                pagination={{
                    pageSize: 10,
                }}
                dateFormatter="string"
                headerTitle="用户列表"
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={()=>{isShowModal(true)}}>
                        新建
                    </Button>,
                ]}
            />
           
            {
                //模态框隐藏的时候不挂载组件，模态框显示的时候再挂载组件，这样是为了触发子组件的生命周期
                isModalVisible ?
                <CreateOrEdit 
                isModalVisible={isModalVisible}
                isShowModal={isShowModal}
                actionRef={actionRef}
                editId={editId}
                />
                : ''
            }
        </PageContainer>
    )
}

export default Index
