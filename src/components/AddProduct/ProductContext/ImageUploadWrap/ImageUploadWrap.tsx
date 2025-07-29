import React, { useEffect, useState } from 'react';
import styles from './ImageUploadWrap.less';
import { useModel } from '@umijs/max';
import { Input, InputNumber, message } from 'antd';

const ImageUploadWrap: React.FC<{
    groupIndex: number, children: React.ReactNode,
    priceVariate: string, variateValue: number,
    setDraggableState: React.Dispatch<React.SetStateAction<boolean>>;
    draggableState: boolean
}> =
    ({ variateValue, priceVariate, groupIndex, children, draggableState, setDraggableState }) => {

        const [variateInputValue, setVariateInputValue] = useState(variateValue);//具体数值
        const [priceInputVariate, setPriceInputVariate] = useState<string | null>(priceVariate);//是加还是减

        const { setBigImgSuccessList, smallImgSuccessList,
            setSmallImgSuccessList } = useModel('productUpdateData');
        const handleDragStart = (e: any) => {
            // console.log(productId);
            // console.log(e);
            // e.dataTransfer.setData('productId', productId);
            // console.log(e.nativeEvent.target);
            e.nativeEvent.target.style.opacity = '0.9';
            e.dataTransfer.setData('groupIndex', groupIndex);
            // console.log(groupIndex + "  groupIndex")
            e.dataTransfer.effectAllowed = 'move';
        };
        const handleDragEnd = (e: any) => {
            e.nativeEvent.target.style.opacity = '1';
        };
        const handleDragOver = (e: any) => {
            e.preventDefault();
        };

        // 移动第二组件的某个图片到另一个第一组件
        const copyItemBetweenGroups = (fromGroupIndex: number, fromItemIndex: number, toGroupIndex: number) => {
            let newSmallImgSuccessList = structuredClone(smallImgSuccessList);

            // 检查源组是否有效
            if (!newSmallImgSuccessList[fromGroupIndex] || newSmallImgSuccessList[fromGroupIndex].length === 0) {
                console.error("源组无效或为空");
                return;
            }

            // 获取源组的项
            const sourceItem = newSmallImgSuccessList[fromGroupIndex][fromItemIndex];

            // 检查目标组是否已存在相同 url 的项
            if (newSmallImgSuccessList[toGroupIndex]?.some(item => item.url === sourceItem.url)) {
                message.error("目标组已存在相同 url 的项，复制操作无效");
                return;
            }

            // 深拷贝源项
            const copiedItem = structuredClone(sourceItem);

            // 获取目标组的颜色
            const targetGroupColor = newSmallImgSuccessList[toGroupIndex]?.[0]?.color || "";

            // 更新复制项的颜色为目标组的颜色
            copiedItem.color = targetGroupColor;

            // 如果目标组不存在，初始化为空数组
            if (!newSmallImgSuccessList[toGroupIndex]) {
                newSmallImgSuccessList[toGroupIndex] = [];
            }

            // 将复制项添加到目标组
            newSmallImgSuccessList[toGroupIndex].push(copiedItem);

            // 更新状态
            setSmallImgSuccessList(newSmallImgSuccessList);
            setBigImgSuccessList([{ url: newSmallImgSuccessList[0][0].url, size: 0 }]);
        };

        const [forceUpdate, setForceUpdate] = useState(0);
        const handleDropDom = (e: any) => {

            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            const newGroupIndex = e.dataTransfer.getData('groupIndex');
            const newItemIndex = e.dataTransfer.getData('itemIndex');
            // console.log(groupIndex, newGroupIndex, newItemIndex)

            // 如果拖拽源是内部的单个照片组件
            if (newItemIndex !== undefined && newItemIndex !== null && newItemIndex !== "") {
                // 执行第二组件的移动逻辑
                copyItemBetweenGroups(newGroupIndex, newItemIndex, groupIndex);
                return;
            }

            if (+newGroupIndex === groupIndex) return;
            let newSmallImgSuccessList = structuredClone(smallImgSuccessList)
            let a = structuredClone(newSmallImgSuccessList[groupIndex]);
            let b = structuredClone(newSmallImgSuccessList[+newGroupIndex]);
            // console.log(a, b)
            newSmallImgSuccessList[groupIndex] = b;
            newSmallImgSuccessList[+newGroupIndex] = a;
            // console.log(newSmallImgSuccessList)
            setSmallImgSuccessList(newSmallImgSuccessList)
            setBigImgSuccessList([{ url: newSmallImgSuccessList[0][0].url, size: 0 }]);
            setForceUpdate(prev => prev + 1); // 触发重新渲染
        };

        const handlePriceChange = (arg: string) => {
            let newSmallSuccessList = structuredClone(smallImgSuccessList);
            if (newSmallSuccessList[groupIndex]) {
                if (arg === "priceVariate") {
                    newSmallSuccessList[groupIndex] = newSmallSuccessList[groupIndex].map(item => ({
                        ...item,
                        priceVariate: "" + priceInputVariate
                    }));
                } else if (arg === "variateValue") {
                    newSmallSuccessList[groupIndex] = newSmallSuccessList[groupIndex].map(item => ({
                        ...item,
                        variateValue: "" + variateInputValue
                    }));
                }
            }
            console.log(newSmallSuccessList)
            setSmallImgSuccessList(newSmallSuccessList)
        }
        // 监听父组件传递的 priceVariate 和 variateValue
        useEffect(() => {
            setPriceInputVariate(priceVariate);
        }, [priceVariate]);

        useEffect(() => {
            setVariateInputValue(variateValue);
        }, [variateValue]);

        return (
            <div
                draggable={draggableState}
                className={styles.container}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDropDom}
                onDragEnd={handleDragEnd}
                key={forceUpdate}
            >
                <div >拖动</div>
                <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {children}
                    </div>
                    <div style={{ display: 'flex', justifyContent: "center", flexDirection: "column" }} key={groupIndex}>
                        价格变化(只能+/-)：
                        <Input style={{ width: 140 }} value={priceInputVariate ? priceInputVariate : ""}
                            onChange={(e) => {
                                const value = e.target.value.trim();
                                // 只获取最后一位字符
                                const lastChar = value[value.length - 1];
                                console.log(value, lastChar);
                                // // 如果最后一位字符是 '+' 或者 '-'
                                if (lastChar === '+' || lastChar === '-') {
                                    setPriceInputVariate(lastChar)
                                } else if (!lastChar) {
                                    setPriceInputVariate(null)
                                }
                            }}
                            onBlur={() => {
                                handlePriceChange("priceVariate")
                            }}/>
                        值:
                        <InputNumber min={0} style={{ width: 140 }} value={variateInputValue}
                            onChange={(value) => {
                                if (!value) {
                                    setVariateInputValue(0);
                                    return;
                                }
                                console.log(value)
                                // 让 value 保持最多 2 位小数（但不强制补 0）
                                const formattedValue = value.toString().match(/^\d+(\.\d{0,2})?/)?.[0] || "";
                                console.log(formattedValue)
                                setVariateInputValue(+formattedValue);
                            }}
                            onBlur={() => {
                                handlePriceChange("variateValue")
                            }}
                        />
                    </div>
                </div>

            </div>
        );
    };

export default ImageUploadWrap;