import React, { useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd'

export default ({ id, text, index, changePosition, className }) => {
    const ref = useRef(null)
    // 因为没有定义收集函数，所以返回值数组第一项不要
    const [, drop] = useDrop({ 
        accept: 'DragDropBox', // 只对useDrag的type的值为DragDropBox时才做出反应
        hover: (item, monitor) => { // 这里用节流可能会导致拖动排序不灵敏
            if (!ref.current) return
            let dragIndex = item.index
            let hoverIndex = index
            if (dragIndex === hoverIndex) return // 如果回到自己的坑，那就什么都不做
            changePosition(dragIndex, hoverIndex)  // 调用传入的方法完成交换
            item.index = hoverIndex // 将当前当前移动到Box的index赋值给当前拖动的box，不然会出现两个盒子疯狂抖动！
        }
    })
    
const [{ isDragging }, drag] = useDrag({
      item: {
          type: 'DragDropBox',
          id,
          index,
          text
      },
      collect: monitor => ({
          isDragging: monitor.isDragging() // css样式需要
      })
  })
    return (
    	// ref 这样处理可以使得这个组件既可以被拖动也可以接受拖动
        <div ref={ drag(drop(ref)) } style={{ opacity: isDragging ? 0.5 : 1 }} className={ className.dragBox }>
            <h2>{`第 ${ index + 1 } 屏`}</h2>
            <h2 style={{ fontSize: '30px' }}>{ id + '.' + text }</h2>
        </div>
    )
}

