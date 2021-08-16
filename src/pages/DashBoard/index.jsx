import React, {useEffect, useState} from 'react'
import { Statistic, Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {fetchDashBoard} from '@/services/dashboard'

const DashBoard = () => {
    //定义组件状态，状态改变，会引起组件重新渲染
    let[data, setData] = useState({})

    useEffect( async ()=>{
        //发送请求，获取统计数据
        const resData = await fetchDashBoard()
        //得到数据之后，更新组件状态
        setData(resData)
    }, [])


    return (
        <div>
        <Row gutter={16}>
            <Col span={8}>
                <Card>
                <Statistic
                    title="用户数"
                    value={data.users_count}
                    precision={0}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<ArrowUpOutlined />}
                />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                <Statistic
                    title="商品数"
                    value={data.goods_count}
                    precision={0}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ArrowDownOutlined />}
                />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                <Statistic
                    title="订单数"
                    value={data.order_count}
                    precision={0}
                    valueStyle={{ color: '#234abc' }}
                    prefix={<ArrowDownOutlined />}
                />
                </Card>
            </Col>
        </Row>
        </div>
    )
}

export default DashBoard
