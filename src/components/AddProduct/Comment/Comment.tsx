import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Input, InputNumber, message, Popconfirm, Select, Switch, Table, DatePicker } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import dayjs from 'dayjs';
import './Comment.css'
import SmallImgUploadForComment from './SmallImgUploadForComment';
import { useModel } from '@umijs/max';

const type = 'row'; // This is a constant that represents the draggable item type

// let dragingIndex = -1;


//@ts-ignore
const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      //@ts-ignore
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      //@ts-ignore
      moveRow(item.index, index);
    },
  });

  const [{ }, drag] = useDrag({
    type,
    item: { index }, // No longer using the deprecated begin function
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(ref));

  return (
    <tr
      //@ts-ignore
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

type EditableTableProps = Parameters<typeof Table>[0];

export interface commentDataSourceType {
  key: React.Key;
  commentId: number | null;
  productId: number;
  invoiceId: string | null;
  name: string;
  mark: number;
  content: string;
  imgSrcList: string;
  active: boolean;
  createTime: string;
  audit: boolean;
  author: string | null;
  color: string | null;
  size: string | null;
  accurateFit: number;
  quality: number;
  affordability: number;
  style: number;
  helpful: boolean;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;





const DragSortingTable = () => {
  const {
    commentDataSource,
    setCommentDataSource,
    commentCount,
    setCommentCount,
    productId,
    commentScale,
    setCommentScale,
    successFileList,
    commentSummary,
    setCommentSummary,
  } = useModel('productUpdateData');
  const { tableData } = useModel('globalState');

  const [colorOptions, setColorOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [sizeOptions, setSizeOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (commentDataSource.length > 0) {
      //根据commentdatasource的变化来改变上面commentScale和commentSummary的值
      let commentFiveNum = 0, commentFourNum = 0, commentThreeNum = 0, commentTwoNum = 0, commentOneNum = 0;
      let trueToSizeTotal = 0, valueForMoneyTotal = 0, qualityTotal = 0, styleTotal = 0;
      for (let i = 0; i < commentDataSource.length; i++) {
        if (commentDataSource[i].active) {
          // console.log(commentDataSource[i])
          if (commentDataSource[i].mark === 5) {
            commentFiveNum++;
          } else if (commentDataSource[i].mark === 4) {
            commentFourNum++;
          } else if (commentDataSource[i].mark === 3) {
            commentThreeNum++;
          } else if (commentDataSource[i].mark === 2) {
            commentTwoNum++;
          } else if (commentDataSource[i].mark === 1) {
            commentOneNum++;
          }
        }
        trueToSizeTotal += commentDataSource[i].accurateFit;
        valueForMoneyTotal += commentDataSource[i].affordability;
        qualityTotal += commentDataSource[i].quality;
        styleTotal += commentDataSource[i].style;
      }
      let total = commentFiveNum + commentFourNum + commentThreeNum + commentTwoNum + commentOneNum;
      if (total > 0) {
        let newCommentScale = []
        newCommentScale.push({ starLevel: 5, num: commentFiveNum, scale: +(commentFiveNum / total).toFixed(2) * 100 });
        newCommentScale.push({ starLevel: 4, num: commentFourNum, scale: +(commentFourNum / total).toFixed(2) * 100 });
        newCommentScale.push({ starLevel: 3, num: commentThreeNum, scale: +(commentThreeNum / total).toFixed(2) * 100 });
        newCommentScale.push({ starLevel: 2, num: commentTwoNum, scale: +(commentTwoNum / total).toFixed(2) * 100 });
        newCommentScale.push({ starLevel: 1, num: commentOneNum, scale: +(commentOneNum / total).toFixed(2) * 100 });
        setCommentScale(newCommentScale);
      }

      let newCommentSummary = []
      if (total > 0) {
        let accurateFitMap: { name: string, score: number } = {
          name: "True to Size",
          score: +(trueToSizeTotal / total).toFixed(1)
        }
        newCommentSummary.push(accurateFitMap);
        let affordabilityMap: { name: string, score: number } = {
          name: "Value for Money",
          score: +(valueForMoneyTotal / total).toFixed(1)
        }
        newCommentSummary.push(affordabilityMap);
        let qualityMap: { name: string, score: number } = {
          name: "Quality",
          score: +(qualityTotal / total).toFixed(1)
        }
        newCommentSummary.push(qualityMap);

        let styleMap: { name: string, score: number } = {
          name: "Style",
          score: +(styleTotal / total).toFixed(1)
        }
        newCommentSummary.push(styleMap);
      }
    }
  }, [commentDataSource]);

  //各种数字的修改
  const handleScoreChange = (value: number | string | null, record: number, sort: string) => {
    if (!value || isNaN(+value)) return;
    const parts = value.toString().split(".");
    if (parts.length > 1 && parts[1].length > 2) return;
    console.log(value, sort)
    let newCommentDataSource = structuredClone(commentDataSource);
    if (sort === 'mark') {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, mark: +value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    } else if (sort === 'accurateFit') {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, accurateFit: +value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    } else if (sort === "quality") {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, quality: +value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    } else if (sort === "affordability") {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, affordability: +value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    } else if (sort === "style") {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, style: +value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    }

  }

  //名字和内容的修改
  const handleNameOrContentChange = (value: string, record: number, sort: string) => {
    console.log(value);

    let newCommentDataSource = structuredClone(commentDataSource);
    if (sort === "name") {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, name: value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    } else if (sort === "content") {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, content: value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    } else if (sort === "createTime") {
      const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      if (!regex.test(value)) {
        message.error({ content: "输入的时间格式有误", style: { marginTop: '50vh' } }, 5)
        return;
      }
      console.log(newCommentDataSource, record)
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, createTime: value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    }
  }

  //颜色和尺码选择
  const handleSelectChange = (value: string, record: number, sort: string) => {
    let newCommentDataSource = structuredClone(commentDataSource);
    if (sort === 'color') {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, color: value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    } else if (sort === 'size') {
      newCommentDataSource = newCommentDataSource.map((item) => {
        if (item.key === record) {
          return { ...item, size: value };
        }
        return item;
      });
      setCommentDataSource(newCommentDataSource);
    }
  };

  //当前行的删除
  const handleDelete = (key: React.Key) => {
    const newData = commentDataSource.filter((item) => {
      console.log(item, key);
      if (item.key === key && item.invoiceId !== '0') {
        message.info(
          {
            content: '不能删除真实的评论，只能取消展示',
            style: { marginTop: '40vh' },
          },
          4,
        );
      }
      return item.key !== key || item.invoiceId !== "0";
    });
    //真实的上传上去删除掉

    setCommentDataSource([...newData]);
  };
  //改变当前行是否活跃
  const handleChange = (needChangeItem: any) => {
    // console.log(needChangeItem);
    const newData = structuredClone(commentDataSource).filter((item) => {
      if (item.key !== needChangeItem.key) {
        return item;
      } else {
        item.active = !item.active;
        return item;
      }
    });
    setCommentDataSource([...newData]);
  };

  //改变当前行是否helpful
  const handleChangeHelpful = (needChangeItem: any) => {
    // console.log(needChangeItem);
    const newData = structuredClone(commentDataSource).filter((item) => {
      if (item.key !== needChangeItem.key) {
        return item;
      } else {
        item.helpful = !item.helpful;
        return item;
      }
    });

    setCommentDataSource([...newData]);
  };


  const columns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
      {
        title: '名字',
        dataIndex: 'name',
        // width: '7%',
        editable: false,
        render: (text, record,) => (
          <Input defaultValue={text} style={{ width: 100 }}
            disabled={record.invoiceId !== "0"}
            onChange={(e) => handleNameOrContentChange(e.target.value.trim(), record.key, 'name')}></Input>
        ),
      },
      {
        title: '总评分,自动为5',
        dataIndex: 'mark',
        // width: '7%',
        editable: false,
        render: (text, record,) => (
          <InputNumber defaultValue={text} min={1} max={5} style={{ width: 70 }}
            disabled={record.invoiceId !== "0"}
            onChange={(value) => handleScoreChange(value, record.key, 'mark')}></InputNumber>
        ),
      },
      {
        title: '尺码标准,自动为5',
        dataIndex: 'accurateFit',
        // width: '7%',
        editable: false,
        render: (text, record,) => (
          <InputNumber defaultValue={text} min={1} max={5} style={{ width: 70 }}
            disabled={record.invoiceId !== "0"}
            onChange={(value) => handleScoreChange(value, record.key, 'accurateFit')}></InputNumber>
        ),
      },
      {
        title: '品质,自动为5',
        dataIndex: 'quality',
        // width: '7%',
        editable: false,
        render: (text, record,) => (
          <InputNumber defaultValue={text} min={1} max={5} style={{ width: 70 }}
            disabled={record.invoiceId !== "0"}
            onChange={(value) => handleScoreChange(value, record.key, 'quality')}></InputNumber>
        ),
      },
      {
        title: '性价比,自动为5',
        dataIndex: 'affordability',
        // width: '7%',
        editable: false,
        render: (text, record,) => (
          <InputNumber defaultValue={text} min={1} max={5} style={{ width: 70 }}
            disabled={record.invoiceId !== "0"}
            onChange={(value) => handleScoreChange(value, record.key, 'affordability')}></InputNumber>
        ),
      },
      {
        title: '样式,自动为5',
        dataIndex: 'style',
        // width: '7%',
        editable: false,
        render: (text, record,) => (
          <InputNumber defaultValue={text} min={1} max={5} style={{ width: 70 }}
            disabled={record.invoiceId !== "0"}
            onChange={(value) => handleScoreChange(value, record.key, 'style')}></InputNumber>
        ),
      },
      {
        title: '购买颜色',
        dataIndex: 'color',
        // width: '10%',
        editable: false,
        render: (text, record,) => (
          <Select
            disabled={record.invoiceId !== "0"}
            defaultValue={text}
            onChange={(value) => handleSelectChange(value, record.key, 'color')}
            style={{ width: 120 }}
            options={colorOptions}
          ></Select>
        ),
      },
      {
        title: '购买尺寸',
        dataIndex: 'size',
        // width: "10%",
        editable: false,
        render: (text, record,) => (
          <Select
            disabled={record.invoiceId !== "0"}
            defaultValue={text}
            onChange={(value) => handleSelectChange(value, record.key, 'size')}
            style={{ width: 240 }}
            options={sizeOptions}
          ></Select>
        ),
      },
      {
        title: '内容',
        dataIndex: 'content',
        editable: false,
        render: (text, record,) => (
          <Input.TextArea defaultValue={text}
            disabled={record.invoiceId !== "0"}
            style={{ width: 160, height: 200 }}
            onChange={(e) => handleNameOrContentChange(e.target.value.trim(), record.key, 'content')}></Input.TextArea>
        ),
      },
      {
        title: '图片',
        dataIndex: 'imgSrcList',
        // width: '15%',
        //@ts-ignore
        render: (_, record: commentDataSourceType) => {
          // console.log(record);
          return <SmallImgUploadForComment record={record} disabled={record.invoiceId !== "0"} />;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '8%',
        editable: false,
        render: (text, record,) => (
          <div>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期时间"
              value={text ? dayjs(text) : null}
              disabled={record.invoiceId !== "0"}
              onChange={(_, dateString) => {
                console.log(dateString);
                handleNameOrContentChange(dateString, record.key, 'createTime')
              }}
            />
            <Button
              type="primary"
              disabled={record.invoiceId !== "0"}
              onClick={() => {
                const start = new Date('2024-09-01 00:00:00').getTime();
                const end = Date.now();

                const randomTime = start + Math.random() * (end - start);
                const date = new Date(randomTime);
                const randomDate = date.toISOString().slice(0, 19).replace('T', ' ');
                console.log(randomDate);
                handleNameOrContentChange(randomDate, record.key, 'createTime')
              }}>随机</Button>
          </div>

        ),
      },
      {
        title: '审核人',
        dataIndex: 'author',
        width: '8%',
        editable: false,
        render: (text,) => (
          <div style={{ width: 60 }}>{text === "system" ? "系统添加" : text}</div>
        ),
      },
      {
        title: '评论是否添标',
        dataIndex: 'helpful',
        width: '10%',
        render: (_, record: any) => (
          <>
            <div>该条评论是否helpful</div>
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              checked={record.helpful}
              onChange={() => handleChangeHelpful(record)}
            />
          </>
        ),
        sorter: (a: any, b: any) => {
          return a.active - b.active;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        // width: '10%',
        render: (_, record: any) => (
          <div style={{ width: 90 }}>
            <Popconfirm
              title="确定删除吗?"
              onConfirm={() => {
                console.log(record);
                handleDelete(record.key);
              }}
            >
              <a>删除</a>
            </Popconfirm>
            <div>是否开启该条评论</div>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked={record.active}
              onChange={() => handleChange(record)}
            />
          </div>
        ),
      },
    ];

  useEffect(() => {
    let newSize = [];
    
    for (let i = 0; i < tableData.length; i++) {
      let item = tableData[i];
      if (item.length > 0 && item[0]) {
        newSize.push({ value: item[0], label: item[0] });
      }
    }
    setSizeOptions(newSize);
  }, [tableData]);
  useEffect(() => {
   let colorMap = new Map();
    for (let i = 0; i < successFileList.length; i++) {
      let item = successFileList[i];
      if (item.color&&!colorMap.has(item.color)) {
        colorMap.set(item.color, { value: item.color, label: item.color });
      }
    }
    const newColor = Array.from(colorMap.values());
    setColorOptions(newColor);
  }, [successFileList]);

  //少点渲染
  const portion = useMemo(() => {
    let total = 0;
    for (let i = 0; i < commentScale.length; i++) {
      total += commentScale[i].num;
    }
    const portion = [];
    for (let i = 0; i < commentScale.length; i++) {
      portion.push(commentScale[i].num / total);
    }
    return portion;
  }, [commentScale]);

  //提取的setCommentSummary的计算
  const calCommentSummary = () => {
    let accurateFitNum = 0, qualityNum = 0, affordabilityNum = 0, styleNum = 0, activeNum = 0;
    for (let i = 0; i < commentDataSource.length; i++) {
      if (!commentDataSource[i].active) continue;
      activeNum++;
      accurateFitNum += commentDataSource[i].accurateFit
      qualityNum += commentDataSource[i].quality;
      affordabilityNum += commentDataSource[i].affordability
      styleNum += commentDataSource[i].style;
    }
    let newCommentSummary = [];
    if (activeNum > 0) {
      let accurateFitMap: { name: string, score: number } = {
        name: "True to Size",
        score: +(accurateFitNum / activeNum).toFixed(1)
      }
      newCommentSummary.push(accurateFitMap);
      let affordabilityMap: { name: string, score: number } = {
        name: "Value for Money",
        score: +(affordabilityNum / activeNum).toFixed(1)
      }
      newCommentSummary.push(affordabilityMap);
      let qualityMap: { name: string, score: number } = {
        name: "Quality",
        score: +(qualityNum / activeNum).toFixed(1)
      }
      newCommentSummary.push(qualityMap);

      let styleMap: { name: string, score: number } = {
        name: "Style",
        score: +(styleNum / activeNum).toFixed(1)
      }
      newCommentSummary.push(styleMap);
    }
    setCommentSummary(newCommentSummary)
  }

  //提取的setCommentScale的计算
  const calCommentScale = () => {
    let starOneNum = 0, starTwoNum = 0, starThreeNum = 0, starFourNum = 0, starFiveNum = 0;
    for (let i = 0; i < commentDataSource.length; i++) {
      if (!commentDataSource[i].active) continue;
      if (commentDataSource[i].mark === 5) {
        starFiveNum++;
      } else if (commentDataSource[i].mark === 4) {
        starFourNum++;
      } else if (commentDataSource[i].mark === 3) {
        starThreeNum++;
      } else if (commentDataSource[i].mark === 2) {
        starTwoNum++;
      } else if (commentDataSource[i].mark === 1) {
        starOneNum++;
      }
    }
    let total = starFiveNum + starFourNum + starThreeNum + starTwoNum + starOneNum;
    let newCommentScale = []
    if (total > 0) {
      let starFiveMap: {
        starLevel: number;
        num: number;
        scale: number;
      } = {
        starLevel: 5,
        num: starFiveNum,
        scale: +(starFiveNum / total).toFixed(2) * 100,
      };
      newCommentScale.push(starFiveMap);
      let starFourMap: {
        starLevel: number;
        num: number;
        scale: number;
      } = {
        starLevel: 4,
        num: starFourNum,
        scale: +(starFourNum / total).toFixed(2) * 100,
      };
      newCommentScale.push(starFourMap);
      let starThreeMap: {
        starLevel: number;
        num: number;
        scale: number;
      } = {
        starLevel: 3,
        num: starThreeNum,
        scale: +(starThreeNum / total).toFixed(2) * 100,
      };
      newCommentScale.push(starThreeMap);
      let starTwoMap: {
        starLevel: number;
        num: number;
        scale: number;
      } = {
        starLevel: 2,
        num: starTwoNum,
        scale: +(starTwoNum / total).toFixed(2) * 100,
      };
      newCommentScale.push(starTwoMap);
      let starOneMap: {
        starLevel: number;
        num: number;
        scale: number;
      } = {
        starLevel: 1,
        num: starOneNum,
        scale: +(starOneNum / total).toFixed(2) * 100,
      };
      newCommentScale.push(starOneMap);
    }
    setCommentScale(newCommentScale)
  }

  //commentScale和commentSummary的初始化以及后续的计算  可以优化（这样就不用size等变化，他也要计算了）
  useEffect(() => {
    // console.log(commentDataSource)
    if (commentDataSource.length > 0) {
      calCommentSummary()
      calCommentScale()
    } else if (commentDataSource.length === 0) {
      setCommentScale([])
      setCommentSummary([])
    }
  }, [commentDataSource])

  //下面2个一起搞了个随机创建时间
  const getRandomDate = () => {
    let maxdaterandom = new Date().getTime();
    // 由于当前环境为北京GMT+8时区，所以与GMT有8个小时的差值
    let mindaterandom = new Date(2023, 0, 1, 8).getTime();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    let randomdate = getRandom(mindaterandom, maxdaterandom);

    let newDate = new Date(randomdate);
    let year = newDate.getFullYear();
    let month = String(newDate.getMonth() + 1).padStart(2, '0'); // 修正月份
    let day = String(newDate.getDate()).padStart(2, '0'); // 修正日期
    let hour = String(newDate.getHours()).padStart(2, '0');
    let minutes = String(newDate.getMinutes()).padStart(2, '0');
    let seconds = String(newDate.getSeconds()).padStart(2, '0');
    let datestr = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    return datestr;
  };
  const getRandom = (min: any, max: any) => {
    let min1 = Math.ceil(min);
    let max1 = Math.floor(max);
    return Math.floor(Math.random() * (max1 - min1 + 1)) + min;
  };

  //添加一行虚拟
  const handleAdd = () => {
    if (!colorOptions || colorOptions.length === 0) {
      message.error({ content: "必须先有产品图片以及图片颜色，才能添加", style: { marginTop: '40vh' } }, 4)
      return;
    }
    if (!sizeOptions || sizeOptions.length === 0) {
      message.error({ content: "必须先有产品尺码，才能添加", style: { marginTop: '40vh' } }, 4)
      return;
    }
    const newData: commentDataSourceType = {
      key: commentCount,
      name: 'name',
      productId: +productId,
      audit: true,
      author: null,
      mark: 5,
      content: '占位',
      imgSrcList: '',
      active: false,
      commentId: null,
      invoiceId: "0",
      createTime: getRandomDate(),
      color: colorOptions[0].value !== null ? colorOptions[0].value : "",
      size: sizeOptions[0].value !== null ? sizeOptions[0].value : "",
      accurateFit: 5,
      quality: 5,
      affordability: 5,
      style: 5,
      helpful: false,
    };
    console.log(newData);
    setCommentDataSource([...commentDataSource, newData]);
    setCommentCount(commentCount + 1);
  };

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = commentDataSource[dragIndex];
      setCommentDataSource(
        update(commentDataSource, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        }),
      );
    },
    [commentDataSource],
  );

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h3>综合表现</h3>
        {commentSummary.map((item, index) => {
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
        })}
        <h3>评论人数</h3>
        {commentScale.map((item, index) => {
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
        })}
      </div>
      <div style={{ margin: '30px 0' }}>
        如果不想添加就删除该行,真实的评价建议改变活跃状态,虚假的评论里面图片不强制需要,最多五张
      </div>
      <Table
        size='middle'
        columns={columns}
        dataSource={commentDataSource}
        components={components}
        //@ts-ignore     antd自己网站示例就这么写的，估计他们ts文件没更新
        onRow={(record, index) => ({
          index,
          moveRow,
        })}
      />
      <Button
        onClick={handleAdd}
        type="primary"
        style={{ position: 'fixed', top: 600, zIndex: 10, left: 224 }}
      >
        添加一行
      </Button>
    </DndProvider >
  );
};

export default DragSortingTable;