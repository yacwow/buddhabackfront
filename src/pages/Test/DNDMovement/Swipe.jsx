import React, { useState, useEffect } from 'react'
import style from './Swipe.module.scss'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DragDropBox from './DragDropBox'
import { cloneDeep } from 'lodash'
// import Card from '@/component/card/card' // 类似饿了么ui的el-card，把他当成div吧

import {
    MinusOutlined
} from '@ant-design/icons'
import { Button, Popconfirm, message } from 'antd'

const initData = [
    {
        id: 1,
        text: '111'
    },
    {
        id: 2,
        text: '222'
    },
    {
        id: 3,
        text: '333'
    },
    {
        id: 4,
        text: '444'
    },
    {
        id: 5,
        text: '555'
    },
    {
        id: 6,
        text: '666'
    }
]

const Swipe = () => {
    const [isChangePosition, setIsChangePosition] = useState(false)
    const [boxList, setBoxList] = useState(initData)

    useEffect(() => {
        sessionStorage.initData = JSON.stringify(initData)
        return () => {
            sessionStorage.removeItem('initData')
        }
    }, [])

    const changePosition = (dragIndex, hoverIndex) => {
        let data = cloneDeep(boxList)
        let temp = data[dragIndex]
        // 交换位置
        data[dragIndex] = data[hoverIndex]
        data[hoverIndex] = temp
        setBoxList(data)
    }

    // 更换顺序按钮
    const changePositionBtn = () => {
        message.info('请拖拽图片进行排序！')
        setIsChangePosition(true)
    }

    // 取消交换位置
    const cancelChangePosition = () => {
        setIsChangePosition(false)
        setBoxList(JSON.parse(sessionStorage.getItem('initData')))
    }

    // 保存修改
    const saveChangePosition = () => {
        setIsChangePosition(false)
        sessionStorage.initData = JSON.stringify(boxList)
        // 在这里发送请求更新后端数据
        message.success('已更新顺序！')
    }

    const deleteImgOne = id => {
        console.log(id)
    }

    return (
        <div style={{ height: '100%' }}>
            {/* <Card bottom>
                {
                    isChangePosition ?
                        <>
                            <Button onClick={ cancelChangePosition } style={{ marginRight: '15px' }}>取消</Button>
                            <Button type="primary" onClick={ saveChangePosition }>保存</Button>
                        </>
                        :
                        <Button type="primary" onClick={ changePositionBtn }>更换顺序</Button>
                }
            </Card> */}
            <div>
                {
                    isChangePosition ?
                        <DndProvider backend={HTML5Backend}>
                            <div className={style.dragBoxContainer}>
                                {
                                    boxList.map((value, i) =>
                                        <DragDropBox
                                            className={style}
                                            key={value.id}
                                            index={i}
                                            id={value.id}
                                            text={value.text}
                                            changePosition={changePosition}
                                        />
                                    )
                                }
                            </div>
                        </DndProvider>
                        :
                        <div className={style.dragBoxContainer}>
                            {
                                boxList.map(value => (
                                    <div
                                        key={value.id}
                                        className={[style.dragBox, style.deleteIcon].join(' ')}
                                    >
                                        {/* <Popconfirm
                                            title="确定要删除这张图片吗？"
                                            placement="top"
                                            onConfirm={() => deleteImgOne(value.id)}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <div className={style.deleteIconBox}>
                                                <MinusOutlined className={style.deleteIcon} />
                                            </div>
                                        </Popconfirm> */}
                                        {value.id} - {value.text}
                                    </div>
                                ))
                            }
                            <div className={[style.dragBox, style.addImgBox].join(' ')} />
                        </div>
                }
            </div>
        </div>
    )
}

export default Swipe
