import React, { useEffect, useState } from 'react';
import styles from './SendSubscriptionEmailComp.less';
import { Button, Image, Input, InputNumber, message } from 'antd';
import { request } from '@umijs/max';
import { formatTimeFromStr } from '@/utils/format';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

type EmailContent = {
    productId: number;
    listPrice: number;
    price: number;
    imgSrc: string;
    Date: string | null;
    rank: number;
};
type EmailContentWithNumber = EmailContent & {
    number: number;
};
type EmailContentWithDate = Omit<EmailContent, 'Date'> & {
    Date: string;
};

const SendSubscriptionEmailComp: React.FC = () => {
    const [unEmailContent, setUnEmailContent] = useState<EmailContent[]>([]);// 用于存储未邮寄的产品的一维数组
    const [unEmailInformation, setUnEmailInformation] = useState<EmailContentWithNumber[]>([]); // 用于存储未邮寄的产品的信息，包括历史记录用过几次等


    const [emailedContent, setEmailedContent] = useState<EmailContentWithDate[][] | []>([]);// 用于存储已邮寄的产品的二维数组
    const [originEmailedContent, setOriginEmailedContent] = useState<EmailContentWithDate[]>([]); // 用于存储已邮寄的产品的一维数组


    const [productId, setProductId] = useState<string | number | null>('');//添加产品编号
    const [email, setEmail] = useState<string>('');//测试邮箱地址

    useEffect(() => {
        request('/admin/secure/getUnusedSubscriptionInfo').then((data) => {
            if (data.result) {
                // setUnEmailContent(data.data.subscriptionEmailInfoList);
                let serverUnEmailContent = data.data.subscriptionEmailInfoList;
                serverUnEmailContent = serverUnEmailContent.sort((a: EmailContent, b: EmailContent) => { return b.rank - a.rank });
                setUnEmailContent(serverUnEmailContent);
            } else {
                // message.error('获取未发送产品信息失败');
            }
        })

        request('/admin/secure/getAllEmailedSubscriptionInfo').then((data) => {
            if (data.result) {
                let serverEmailedContent: EmailContentWithDate[] = data.data.subscriptionEmailInfoList;
                setOriginEmailedContent(serverEmailedContent);
                const map = new Map<string, typeof serverEmailedContent>();

                serverEmailedContent.forEach(item => {
                    if (!map.has(item.Date)) {
                        map.set(item.Date, []);
                    }
                    map.get(item.Date)!.push(item);
                });

                // 先把 date 排序（从近到远）
                const sortedDates = Array.from(map.keys()).sort((a, b) => {
                    return new Date(b).getTime() - new Date(a).getTime();
                });

                // 再按排好序的 date 顺序取出分组好的数组
                const result = sortedDates.map(date => map.get(date)!);
                setEmailedContent(result);
            } else {
                // message.error('获取已发送产品信息失败');
            }
        })
    }, []);
    useEffect(() => {
        // 计算未发送产品信息的数量
        const productCountMap: { [key: string]: number } = {};
        originEmailedContent.forEach(item => {
            if (productCountMap[item.productId]) {
                productCountMap[item.productId]++;
            } else {
                productCountMap[item.productId] = 1;
            }
        });

        // 转换为数组形式
        const unEmailInfoArray: EmailContentWithNumber[] = [];
        unEmailContent.forEach(item => {
            if (productCountMap[item.productId]) {
                unEmailInfoArray.push({
                    ...item,
                    number: productCountMap[item.productId],
                })
            } else {
                unEmailInfoArray.push({
                    ...item,
                    number: 0,
                });
            }
        })

        setUnEmailInformation(unEmailInfoArray);
    }, [unEmailContent, originEmailedContent]);

    const addNewProduct = () => {
        if (productId === null || productId === '' || isNaN(+productId)) {
            message.error('请输入产品编号');
            return;
        }
        request('/admin/secure/getPromotionProductInfoById', {
            method: 'POST',
            data: { productId: + productId }
        }).then((data) => {
            if (data.result) {
                setUnEmailContent([...unEmailContent, data.data])
            } else {
                message.error('未找到该产品信息');
            }
        })
    }

    const handleDragStart = (e: any, index: number) => {
        e.nativeEvent.target.style.opacity = '0.9';
        e.dataTransfer.setData('originIndex', index);
        // console.log(groupIndex, itemIndex)
        e.dataTransfer.effectAllowed = 'move';
    };
    const handleDragEnd = (e: any) => {
        e.nativeEvent.target.style.opacity = '1';
        // 新增：强制重置拖拽状态
        e.dataTransfer.clearData();
        e.dataTransfer.setDragImage(document.createElement("img"), 0, 0); // 清除拖拽预览
    };
    const handleDragOver = (e: any) => {
        e.preventDefault();
    };
    const handleDropDom = (e: any, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation(); // 阻止事件冒泡
        const originIndex = +e.dataTransfer.getData('originIndex');
        if (targetIndex === originIndex) return;
        let newEmailContent = structuredClone(unEmailContent);
        let sourceItem = newEmailContent[originIndex];
        let targetItem = newEmailContent[targetIndex];
        newEmailContent[targetIndex] = sourceItem;
        newEmailContent[originIndex] = targetItem;

        setUnEmailContent(newEmailContent);
    };

    const updatePromotionInfo = () => {
        const productIds = unEmailContent.map(item => item.productId);
        request('/admin/secure/updateUnusedSubscriptionInfo', {
            method: 'POST', data: {
                productIds
            }
        }).then((data) => {
            if (data.result) {
                message.success('更新成功');
            } else {
                message.error('更新失败');
            }
        })
    }
    return (
        <div className={styles.container}>
            <h2>本期订阅发送附带的产品</h2>
            <div className={styles.imgWrap}>
                {unEmailInformation.map((item, index) => {
                    return (
                        <div key={index} className={styles.productItem}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDropDom(e, index)}
                            onDragEnd={handleDragEnd}
                            draggable={true}
                        >
                            <Image src={item.imgSrc} alt="产品图片" style={{ width: 200, height: 200, position: "relative" }} />
                            <div>产品编号：{item.productId}</div>
                            <div>原价：{item.listPrice}</div>
                            <div>现价：{item.price}</div>
                            <div>已发送次数：{item.number}</div>
                            <Button type='primary' onClick={() => {
                                let newUnEmailInformation = structuredClone(unEmailInformation);
                                newUnEmailInformation = newUnEmailInformation.filter(insideItem => {
                                    return insideItem.productId !== item.productId;
                                })
                                setUnEmailInformation(newUnEmailInformation)
                            }}>删除</Button>
                        </div>
                    );
                })}
            </div>

            <InputNumber placeholder='添加产品编号' style={{ width: 200 }}
                value={productId} onChange={setProductId} />
            <Button onClick={addNewProduct} type='primary'>添加产品编号</Button>
            <br />
            <Button type='primary' onClick={updatePromotionInfo}>保存状态</Button>
            <br />

            <h2>发送推广邮件</h2>
            <Input placeholder="测试邮箱地址" style={{ width: 400 }}
                value={email} onChange={(e) => setEmail(e.target.value.trim())} />
            <Button type='primary' onClick={() => {
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                if (email === '' || !emailRegex.test(email)) {
                    message.error('请输入正确的测试邮箱地址');
                    return;
                }
                request('/admin/secure/sendTestSubscriptionEmail', {
                    method: 'POST',
                    data: { email }
                }).then((data) => {
                    if (data.result) {
                        message.success('测试邮件发送成功');
                    } else {
                        message.error(data.message || '测试邮件发送失败');
                    }
                })


            }}>发送测试邮件</Button>
            <br />

            <Button type='primary' onClick={() => {
                // 获取当前温哥华时间
                const nowInVancouver = dayjs().tz('America/Vancouver')

                // 获取小时（24小时制）
                const hour = nowInVancouver.hour()

                // 判断是否在 9 到 18（不含 18）
                const isWorkingHour = hour >= 9 && hour < 18

                console.log(`当前温哥华时间：${nowInVancouver.format('YYYY-MM-DD HH:mm:ss')}`)
                console.log(`是否工作时间：${isWorkingHour}`)
                if (!isWorkingHour) {
                    message.error('请在温哥华时间的工作时间（9:00-18:00）内发送邮件');
                    return;
                } else {
                    request('/admin/secure/sendSubscriptionEmail', {
                        method: 'POST'
                    }).then((data) => {
                        if (data.result) {
                            message.success('邮件发送成功');
                            // 更新已发送的内容
                            setEmailedContent([unEmailContent.map(item => ({ ...item, Date: nowInVancouver.format('YYYY-MM-DD HH:mm:ss') })), ...emailedContent,]);
                            setOriginEmailedContent([...unEmailContent.map(item => ({ ...item, Date: nowInVancouver.format('YYYY-MM-DD HH:mm:ss') })), ...originEmailedContent,]);
                            setUnEmailContent([]);
                        } else {
                            message.error('邮件发送失败');
                        }
                    })
                }
            }}>发送邮件</Button>注：接受过类似邮件的两天内不会再次收到邮件



            <h2>历史记录每次发送的时候附带了哪些推广的产品</h2>
            <div>
                {emailedContent.length > 0 ? emailedContent.map((group, groupIndex) => {
                    return (
                        <div key={groupIndex} className={styles.emailGroup}>
                            <h3>发送日期：{formatTimeFromStr(group[0].Date)}</h3>
                            <div className={styles.emailContent}>
                                {group.map((item, itemIndex) => {
                                    return (
                                        <div key={itemIndex} className={styles.productItem}>
                                            <Image src={item.imgSrc} alt="产品图片" style={{ width: 200, height: 200, position: "relative" }} />
                                            <div>产品编号：{item.productId}</div>
                                            <div>原价：{item.listPrice}</div>
                                            <div>现价：{item.price}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }) : <p>暂无历史记录</p>}
            </div>

        </div>
    );
};

export default SendSubscriptionEmailComp;