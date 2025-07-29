// import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
// import { InputNumber, InputRef, message, Select, Switch, Upload } from 'antd';
// import { Button, Form, Input, Popconfirm, Table } from 'antd';
// import type { FormInstance } from 'antd/es/form';
// import './Comment.css';
// import { useModel } from '@umijs/max';
// import { PlusOutlined } from '@ant-design/icons';
// import SmallImgUploadForComment from './SmallImgUploadForComment';
// import { request } from '@umijs/max';
// import { formatTimeWithHours } from '@/utils/format';
// const EditableContext = React.createContext<FormInstance<any> | null>(null);

// interface Item {
//   key: string;
//   name: string;
//   age: string;
//   address: string;
// }

// interface EditableRowProps {
//   index: number;
// }

// const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
//   const [form] = Form.useForm();
//   return (
//     <Form form={form} component={false}>
//       <EditableContext.Provider value={form}>
//         <tr {...props} />
//       </EditableContext.Provider>
//     </Form>
//   );
// };

// interface EditableCellProps {
//   title: React.ReactNode;
//   editable: boolean;
//   children: React.ReactNode;
//   dataIndex: keyof Item;
//   record: Item;
//   handleSave: (record: Item) => void;
// }

// const EditableCell: React.FC<EditableCellProps> = ({
//   title,
//   editable,
//   children,
//   dataIndex,
//   record,
//   handleSave,
//   ...restProps
// }) => {
//   const [editing, setEditing] = useState(false);
//   const inputRef = useRef<InputRef>(null);
//   const form = useContext(EditableContext)!;

//   useEffect(() => {
//     if (editing) {
//       inputRef.current!.focus();
//     }
//   }, [editing]);

//   const toggleEdit = () => {
//     setEditing(!editing);
//     form.setFieldsValue({ [dataIndex]: record[dataIndex] });
//   };

//   const save = async () => {
//     try {
//       const values = await form.validateFields();

//       toggleEdit();
//       handleSave({ ...record, ...values });
//     } catch (errInfo) {
//       console.log('Save failed:', errInfo);
//     }
//   };

//   let childNode = children;

//   if (editable) {
//     childNode = editing ? (
//       <Form.Item
//         style={{ margin: 0 }}
//         name={dataIndex}
//         rules={[
//           {
//             required: true,
//             validator(rule, value, callback) {
//               console.log(dataIndex, rule, value);
//               //@ts-ignore
//               if (dataIndex === 'createTime') {
//                 // 修正：去掉 createTime 后面的空格
//                 const regex =
//                   /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
//                 const matches = value.match(regex);
//                 if (matches) {
//                   callback(); // 修正：使用 callback() 表示验证通过
//                 } else {
//                   callback('时间的格式不太对'); // 修正：使用 callback() 表示验证失败，并传递错误信息
//                 }
//               } else {
//                 callback(); // 修正：如果不是 createTime 字段，直接调用 callback() 表示验证通过
//               }
//             },
//             message: `${title}不能为空`,
//           },
//         ]}
//       >
//         <Input.TextArea ref={inputRef} onPressEnter={save} onBlur={save} />
//       </Form.Item>
//     ) : (
//       <div
//         className="editable-cell-value-wrap"
//         style={{ paddingRight: 24 }}
//         onClick={toggleEdit}
//       >
//         {children}
//       </div>
//     );
//   }

//   return <td {...restProps}>{childNode}</td>;
// };

// type EditableTableProps = Parameters<typeof Table>[0];

// export interface commentDataSourceType {
//   key: React.Key;
//   commentId: number | null;
//   productId: number;
//   invoiceId: number | null;
//   name: string;
//   mark: number;
//   content: string;
//   imgSrcList: string;
//   active: boolean;
//   createTime: string;
//   audit: boolean;
//   author: string | null;
//   color: string | null;
//   size: string | null;
//   accurateFit: number;
//   quality: number;
//   affordability: number;
//   style: number;
// }

// type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

// const App: React.FC = () => {
//   const {
//     commentDataSource,
//     setCommentDataSource,
//     commentCount,
//     setCommentCount,
//     productId,
//     commentScale,
//     setCommentScale,
//     successFileList,
//     setSuccessFileList,
//     commentSummary,
//     setCommentSummary,
//   } = useModel('productUpdateData');
//   const { tableData } = useModel('globalState');

//   const [colorOptions, setColorOptions] = useState<
//     { label: string; value: string }[]
//   >([]);
//   const [sizeOptions, setSizeOptions] = useState<
//     { label: string; value: string }[]
//   >([]);
//   useEffect(() => {
//     let newSize = [];
//     for (let i = 0; i < tableData.length; i++) {
//       let item = tableData[i];
//       if (item.length > 0 && item[0]) {
//         newSize.push({ value: item[0], label: item[0] });
//       }
//     }
//     setSizeOptions(newSize);
//   }, [tableData]);
//   useEffect(() => {
//     let newColor = [];
//     for (let i = 0; i < successFileList.length; i++) {
//       let item = successFileList[i];
//       if (item.color) {
//         newColor.push({ value: item.color, label: item.color });
//       }
//     }
//     setColorOptions(newColor);
//   }, [successFileList]);

//   // const [count, setCount] = useState(commentDataSource.length);

//   const handleDelete = (key: React.Key) => {
//     console.log(commentDataSource, key);
//     const newData = commentDataSource.filter((item) => {
//       console.log(item, key);
//       if (item.key === key && item.invoiceId) {
//         message.info(
//           {
//             content: '不能删除真实的评论，只能取消展示',
//             style: { marginTop: '40vh' },
//           },
//           4,
//         );
//       }
//       return item.key !== key || item.invoiceId;
//     });
//     //真实的上传上去删除掉

//     console.log(newData);
//     setCommentDataSource([...newData]);
//   };
//   //改变当前行是否活跃
//   const handleChange = (needChangeItem: any) => {
//     console.log(needChangeItem);
//     const newData = structuredClone(commentDataSource).filter((item) => {
//       if (item.key !== needChangeItem.key) {
//         return item;
//       } else {
//         item.active = !item.active;
//         return item;
//       }
//     });
//     setCommentDataSource([...newData]);
//   };
//   //颜色和尺码选择
//   const handleSelectChange = (value: string, record: number, sort: string) => {
//     let newCommentDataSource = structuredClone(commentDataSource);
//     if (sort === 'color') {
//       newCommentDataSource = newCommentDataSource.map((item) => {
//         if (item.key === record) {
//           return { ...item, color: value };
//         }
//         return item;
//       });
//       setCommentDataSource(newCommentDataSource);
//     } else if (sort === 'size') {
//       newCommentDataSource = newCommentDataSource.map((item) => {
//         if (item.key === record) {
//           return { ...item, size: value };
//         }
//         return item;
//       });
//       setCommentDataSource(newCommentDataSource);
//     }
//   };
//   //各种数字的修改
//   const handleScoreChange = (value: number | string, record: number, sort: string) => {
//     if (isNaN(+value)) return;
//     const parts = value.toString().split(".");
//     if (parts.length > 1 && parts[1].length > 2) return;
//     console.log(value, sort)
//     let newCommentDataSource = structuredClone(commentDataSource);
//     if (sort === 'mark') {
//       newCommentDataSource = newCommentDataSource.map((item) => {
//         if (item.key === record) {
//           return { ...item, mark: +value };
//         }
//         return item;
//       });
//       setCommentDataSource(newCommentDataSource);
//     } else if (sort === 'accurateFit') {
//       newCommentDataSource = newCommentDataSource.map((item) => {
//         if (item.key === record) {
//           return { ...item, accurateFit: +value };
//         }
//         return item;
//       });
//       setCommentDataSource(newCommentDataSource);
//     } else if (sort === "quality") {
//       newCommentDataSource = newCommentDataSource.map((item) => {
//         if (item.key === record) {
//           return { ...item, quality: +value };
//         }
//         return item;
//       });
//       setCommentDataSource(newCommentDataSource);
//     } else if (sort === "affordability") {
//       newCommentDataSource = newCommentDataSource.map((item) => {
//         if (item.key === record) {
//           return { ...item, affordability: +value };
//         }
//         return item;
//       });
//       setCommentDataSource(newCommentDataSource);
//     } else if (sort === "style") {
//       newCommentDataSource = newCommentDataSource.map((item) => {
//         if (item.key === record) {
//           return { ...item, style: +value };
//         }
//         return item;
//       });
//       setCommentDataSource(newCommentDataSource);
//     }

//   }
//   const defaultColumns: (ColumnTypes[number] & {
//     editable?: boolean;
//     dataIndex: string;
//   })[] = [
//       {
//         title: '名字',
//         dataIndex: 'name',
//         width: '10%',
//         editable: true,
//       },
//       {
//         title: '总评分,自动为5',
//         dataIndex: 'mark',
//         width: '7%',
//         editable: false,
//         render: (text, record, index) => (
//           <InputNumber defaultValue={text} min={1} max={5}
//             onChange={(value) => handleScoreChange(value, record.key, 'mark')}></InputNumber>
//         ),
//       },
//       {
//         title: '尺码标准,自动为5',
//         dataIndex: 'accurateFit',
//         width: '7%',
//         editable: false,
//         render: (text, record, index) => (
//           <InputNumber defaultValue={text} min={1} max={5}
//             onChange={(value) => handleScoreChange(value, record.key, 'accurateFit')}></InputNumber>
//         ),
//       },
//       {
//         title: '品质,自动为5',
//         dataIndex: 'quality',
//         width: '7%',
//         editable: false,
//         render: (text, record, index) => (
//           <InputNumber defaultValue={text} min={1} max={5}
//             onChange={(value) => handleScoreChange(value, record.key, 'quality')}></InputNumber>
//         ),
//       },
//       {
//         title: '性价比,自动为5',
//         dataIndex: 'affordability',
//         width: '7%',
//         editable: false,
//         render: (text, record, index) => (
//           <InputNumber defaultValue={text} min={1} max={5}
//             onChange={(value) => handleScoreChange(value, record.key, 'affordability')}></InputNumber>
//         ),
//       },
//       {
//         title: '样式,自动为5',
//         dataIndex: 'style',
//         width: '7%',
//         editable: false,
//         render: (text, record, index) => (
//           <InputNumber defaultValue={text} min={1} max={5}
//             onChange={(value) => handleScoreChange(value, record.key, 'style')}></InputNumber>
//         ),
//       },
//       {
//         title: '购买颜色',
//         dataIndex: 'color',
//         width: '10%',
//         editable: false,
//         render: (text, record, index) => (
//           <Select
//             defaultValue={text}
//             onChange={(value) => handleSelectChange(value, record.key, 'color')}
//             style={{ width: 120 }}
//             options={colorOptions}
//           ></Select>
//         ),
//       },
//       {
//         title: '购买尺寸',
//         dataIndex: 'size',
//         width: "15%",
//         editable: false,
//         render: (text, record, index) => (
//           <Select
//             defaultValue={text}
//             onChange={(value) => handleSelectChange(value, record.key, 'size')}
//             style={{ width: 240 }}
//             options={sizeOptions}
//           ></Select>
//         ),
//       },
//       {
//         title: '内容',
//         dataIndex: 'content',
//         width: '15%',
//         editable: true,
//       },
//       {
//         title: '图片',
//         dataIndex: 'imgSrcList',
//         width: '30%',
//         //@ts-ignore
//         render: (_, record: commentDataSourceType) => {
//           // console.log(record);
//           return <SmallImgUploadForComment record={record} />;
//         },
//       },
//       {
//         title: '创建时间,注意格式，例：2023-0-1 2:57:56',
//         dataIndex: 'createTime',
//         width: '15%',
//         editable: true,
//       },
//       {
//         title: '操作',
//         dataIndex: 'operation',
//         width: '10%',
//         render: (_, record: any) => (
//           <>
//             <Popconfirm
//               title="确定删除吗?"
//               onConfirm={() => {
//                 console.log(record);
//                 return;
//                 handleDelete(record.key);
//               }}
//             >
//               <a>删除</a>
//             </Popconfirm>
//             <div>是否开启该条评论</div>
//             <Switch
//               checkedChildren="开启"
//               unCheckedChildren="关闭"
//               defaultChecked={record.active}
//               onChange={() => handleChange(record)}
//             />
//           </>
//         ),
//       },
//     ];
//   //下面2个一起搞了个随机创建时间
//   const getRandomDate = () => {
//     let maxdaterandom = new Date().getTime();
//     // 由于当前环境为北京GMT+8时区，所以与GMT有8个小时的差值
//     let mindaterandom = new Date(2023, 0, 1, 8).getTime();
//     let randomdate = getRandom(mindaterandom, maxdaterandom);

//     let newDate = new Date(randomdate);
//     let year = newDate.getFullYear();
//     let month = String(newDate.getMonth() + 1).padStart(2, '0'); // 修正月份
//     let day = String(newDate.getDate()).padStart(2, '0'); // 修正日期
//     let hour = String(newDate.getHours()).padStart(2, '0');
//     let minutes = String(newDate.getMinutes()).padStart(2, '0');
//     let seconds = String(newDate.getSeconds()).padStart(2, '0');
//     let datestr = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
//     return datestr;
//   };
//   const getRandom = (min: any, max: any) => {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   };
//   const handleAdd = () => {
//     const newData: commentDataSourceType = {
//       key: commentCount,
//       name: '占位',
//       productId: +productId,
//       audit: true,
//       author: null,
//       mark: 5,
//       content: '占位',
//       imgSrcList: '',
//       active: false,
//       commentId: null,
//       invoiceId: null,
//       createTime: getRandomDate(),
//       color: '',
//       size: '',
//       accurateFit: 5,
//       quality: 5,
//       affordability: 5,
//       style: 5
//     };
//     console.log(newData);
//     setCommentDataSource([...commentDataSource, newData]);
//     setCommentCount(commentCount + 1);
//   };

//   const handleSave = (row: commentDataSourceType) => {
//     const newData = [...commentDataSource];
//     const index = newData.findIndex((item) => row.key === item.key);
//     const item = newData[index];
//     newData.splice(index, 1, {
//       ...item,
//       ...row,
//     });
//     setCommentDataSource(newData);
//   };

//   const components = {
//     body: {
//       row: EditableRow,
//       cell: EditableCell,
//     },
//   };
//   const columns = defaultColumns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }
//     return {
//       ...col,
//       onCell: (record: commentDataSourceType) => ({
//         record,
//         editable: col.editable,
//         dataIndex: col.dataIndex,
//         title: col.title,
//         handleSave,
//       }),
//     };
//   });
//   useEffect(() => {
//     console.log(commentSummary, commentScale);
//   }, [commentScale, commentSummary]);

//   const portion = useMemo(() => {
//     let total = 0;
//     for (let i = 0; i < commentScale.length; i++) {
//       total += commentScale[i].num;
//     }
//     const portion = [];
//     for (let i = 0; i < commentScale.length; i++) {
//       portion.push(commentScale[i].num / total);
//     }
//     return portion;
//   }, [commentScale]);

//   //提取的setCommentSummary的计算
//   const calCommentSummary = () => {
//     let accurateFitNum = 0, qualityNum = 0, affordabilityNum = 0, styleNum = 0, activeNum=0;
//     for (let i = 0; i < commentDataSource.length; i++) {
//       if (!commentDataSource[i].active) continue;
//       activeNum++;
//       accurateFitNum += commentDataSource[i].accurateFit
//       qualityNum += commentDataSource[i].quality;
//       affordabilityNum += commentDataSource[i].affordability
//       styleNum += commentDataSource[i].style;
//     }

//     let newCommentSummary = [];
//     let accurateFitMap: { name: string, score: number } = {
//       name: "True to Size",
//       score: +(accurateFitNum / activeNum).toFixed(1)
//     }
//     newCommentSummary.push(accurateFitMap);
//     let affordabilityMap: { name: string, score: number } = {
//       name: "Value for Money",
//       score: +(affordabilityNum / activeNum).toFixed(1)
//     }
//     newCommentSummary.push(affordabilityMap);
//     let qualityMap: { name: string, score: number } = {
//       name: "Quality",
//       score: +(qualityNum / activeNum).toFixed(1)
//     }
//     newCommentSummary.push(qualityMap);

//     let styleMap: { name: string, score: number } = {
//       name: "Style",
//       score: +(styleNum / activeNum).toFixed(1)
//     }
//     newCommentSummary.push(styleMap);
//     setCommentSummary(newCommentSummary)
//   }

//   //提取的setCommentScale的计算
//   const calCommentScale = () => {
//     let starOneNum = 0, starTwoNum = 0, starThreeNum = 0, starFourNum = 0, starFiveNum = 0;
//     for (let i = 0; i < commentDataSource.length; i++) {
//       if (!commentDataSource[i].active) continue;
//       if (commentDataSource[i].mark === 5) {
//         starFiveNum++;
//       } else if (commentDataSource[i].mark === 4) {
//         starFourNum++;
//       } else if (commentDataSource[i].mark === 3) {
//         starThreeNum++;
//       } else if (commentDataSource[i].mark === 2) {
//         starTwoNum++;
//       } else if (commentDataSource[i].mark === 1) {
//         starOneNum++;
//       }
//     }
//     let total = starFiveNum + starFourNum + starThreeNum + starTwoNum + starOneNum;
//     let newCommentScale = []
//     let starFiveMap: {
//       starLevel: number;
//       num: number;
//       scale: number;
//     } = {
//       starLevel: 5,
//       num: starFiveNum,
//       scale: +(starFiveNum / total).toFixed(2) * 100,
//     };
//     newCommentScale.push(starFiveMap);
//     let starFourMap: {
//       starLevel: number;
//       num: number;
//       scale: number;
//     } = {
//       starLevel: 4,
//       num: starFourNum,
//       scale: +(starFourNum / total).toFixed(2) * 100,
//     };
//     newCommentScale.push(starFourMap);
//     let starThreeMap: {
//       starLevel: number;
//       num: number;
//       scale: number;
//     } = {
//       starLevel: 3,
//       num: starThreeNum,
//       scale: +(starThreeNum / total).toFixed(2) * 100,
//     };
//     newCommentScale.push(starThreeMap);
//     let starTwoMap: {
//       starLevel: number;
//       num: number;
//       scale: number;
//     } = {
//       starLevel: 2,
//       num: starTwoNum,
//       scale: +(starTwoNum / total).toFixed(2) * 100,
//     };
//     newCommentScale.push(starTwoMap);
//     let starOneMap: {
//       starLevel: number;
//       num: number;
//       scale: number;
//     } = {
//       starLevel: 1,
//       num: starOneNum,
//       scale: +(starOneNum / total).toFixed(2) * 100,
//     };
//     newCommentScale.push(starOneMap);
//     setCommentScale(newCommentScale)

//   }

//   //commentScale和commentSummary的初始化以及后续的计算  可以优化（这样就不用size等变化，他也要计算了）
//   useEffect(() => {
//     console.log(commentDataSource)
//     if (commentDataSource.length > 0) {
//       calCommentSummary()
//       calCommentScale()
//     } else if (commentDataSource.length === 0) {
//       setCommentScale([])
//       setCommentSummary([])
//     }
//   }, [commentDataSource])
//   return (
//     <div style={{ width: 1200, margin: '0 auto' }}>
//       <div>
{/* <h3>综合表现</h3>
{
  commentSummary.map((item, index) => {
    return (
      <div key={index}>
        <span style={{ minWidth: 120, display: 'inline-block' }}>
          {item.name}:
        </span>
        <input
          value={item.score}
          type="number"
          step={'0.1'}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            console.log(newValue, e.target.value);
            if (!isNaN(newValue)) {
              let newCommentSummary = structuredClone(commentSummary);
              newCommentSummary.map((item1, index1) => {
                if (index1 === index) {
                  item1.score = newValue;
                  return item1;
                } else {
                  return item1;
                }
              });
              setCommentSummary(newCommentSummary);
            }
          }}
        />
      </div>
    );
  })
}
<h3>评论人数</h3>
{
  commentScale.map((item, index) => {
    return (
      <div key={index}>
        <span style={{ minWidth: 120, display: 'inline-block' }}>
          {item.starLevel}星:
        </span>
        <input
          value={item.num}
          type="number"
          onChange={(e) => {
            let newCommentScale = structuredClone(commentScale);
            newCommentScale.map((item1, index1) => {
              if (index1 === index) {
                item1.num = +e.target.value;
                return item1;
              } else {
                return item1;
              }
            });
            setCommentScale(newCommentScale);
          }}
        />
        <span>
          具体比例：{portion[index] !== 0 ? portion[index].toFixed(2) : 0}
        </span>
      </div>
    );
  })
}
      </div >
  <div style={{ margin: '30px 0' }}>
    如果不想添加就删除该行,真实的评价建议改变活跃状态,虚假的评论里面图片不强制需要,最多五张
  </div> */}
//       <Button
//         onClick={handleAdd}
//         type="primary"
//         style={{ position: 'fixed', top: 600, zIndex: 10, left: 224 }}
//       >
//         添加一行
//       </Button>
//       {commentDataSource.length > 0 ? (
//         <Table
//           style={{ width: 1400 }}
//           components={components}
//           rowClassName={() => 'editable-row'}
//           bordered
//           dataSource={commentDataSource}
//           tableLayout="fixed"
//           pagination={false}
//           columns={columns as ColumnTypes}
//         />
//       ) : null}
//     </div>
//   );
// };

// export default App;
// // useEffect(() => {
// //   let path = location.pathname.split('/');
// //   if (path.length >= 5) {
// //     setProductId(path[4]);
// //     request(`/admin/getProductCommentDetail/${path[4]}`).then((data) => {
// //       if (data.result) {
// //         let commentTable = data.data.commentTable;
// //         for (let i = 0; i < commentTable.length; i++) {
// //           commentTable[i]['createTime'] = formatTimeWithHours(
// //             commentTable[i]['createTime'],
// //           );
// //         }
// //         setCommentDataSource(commentTable);
// //         setCount(data.data.commentTable.length);
// //       }
// //     });
// //   }
// // }, []);
