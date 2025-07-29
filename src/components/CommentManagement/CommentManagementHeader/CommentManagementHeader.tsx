import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker,  message, Select } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import React, { Dispatch, SetStateAction } from 'react';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { request } from '@umijs/max';
import { commentDataSourceType } from '@/components/AddProduct/Comment/Comment';


dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
const { RangePicker } = DatePicker;
const rangePresets: {
  label: string;
  value: [Dayjs, Dayjs];
}[] = [
    { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];
interface Props {
  afterUpdateTime: string | null | undefined;
  setAfterUpdateTime: Dispatch<SetStateAction<string | null | undefined>>;
  beforeUpdateTime: string | null | undefined;
  setBeforeUpdateTime: Dispatch<SetStateAction<string | null | undefined>>;
  commentStatus: string;
  setCommentStatus: Dispatch<SetStateAction<string>>;
  page: number;
  pageSize: number;
  setCommentDataSource: Dispatch<SetStateAction<any[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  commentDataSource: commentDataSourceType[];
  auditStatus: string;
  setAuditStatus: Dispatch<SetStateAction<string>>;
}

const App: React.FC<Props> = (props) => {
  const {
    afterUpdateTime,
    setAfterUpdateTime,
    beforeUpdateTime,
    setBeforeUpdateTime,
    commentStatus,
    setCommentStatus,
    page,
    pageSize,
    setCommentDataSource,
    setTotal,
    setPage,
    setPageSize,
    commentDataSource,
    auditStatus,
    setAuditStatus,
  } = props;

  //时间的选择
  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[],
  ) => {
    if (dates) {
      setAfterUpdateTime(dateStrings[0]);
      setBeforeUpdateTime(dateStrings[1]);
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      setAfterUpdateTime(null);
      setBeforeUpdateTime(null);
    }
  };

  const dateFormat = 'YYYY-MM-DD';

  const handleCommentStatusChange = (value: string) => {
    console.log(`selected ${value}`);
    setCommentStatus(value);
  };
  const handleAuditStatusChange = (value: string) => {
    console.log(`selected ${value}`);
    setAuditStatus(value);
  };
  //提交搜索请求
  const handleSearch = () => {
    request('/admin/secure/getAllCommentByParams', {
      params: {
        afterUpdateTime,
        beforeUpdateTime,
        commentStatus,
        auditStatus,
        page,
        pageSize,
      },
    }).then((data) => {
      if (data.result) {
        let commentList = data.data.commentList.map(
          (item: any, index: number) => {
            item.key = index;
            return item;
          },
        );
        setCommentDataSource(commentList);
        setTotal(data.data.total);
      }
    });
  };
  //全条件的搜
  const handleResetSearch = () => {
    setBeforeUpdateTime(null);
    setAfterUpdateTime(null);
    setCommentStatus('all');
    setAuditStatus('all');
    setPageSize(40);
    setPage(1);
    request('/admin/secure/getAllCommentByParams', {
      params: {
        afterUpdateTime: null,
        beforeUpdateTime: null,
        commentStatus: 'all',
        auditStatus: 'all',
        page: 1,
        pageSize: 40,
      },
    }).then((data) => {
      if (data.result) {
        let commentList = data.data.commentList.map(
          (item: any, index: number) => {
            item.key = index;
            return item;
          },
        );
        setCommentDataSource(commentList);
        setTotal(data.data.total);
      }
    });
  };
  const submitChange = () => {
    let commentList = commentDataSource.reduce((acc, item) => {
      const { productId, commentId, helpful, active } = item;
      // 如果 commentId 为空，则跳过该项
      if (!commentId) return acc;

      if (!acc[productId]) {
        acc[productId] = [];
      }

      acc[productId].push({ commentId, helpful, active });

      return acc;
    }, {} as Record<string, { commentId: number; helpful: boolean; active: boolean }[]>);
    console.log(commentList)
    // return;
    request('/admin/secure/changeCustomerComment', {
      method: 'POST',
      data: { commentList: commentList },
    }).then((data) => {
      if (data.result) {
        if (data.code === 20001) {
          message.error(
            {
              content: '部分/全部未修改成功，稍后刷新看看',
              style: {
                marginTop: 200,
              },
            },
            3,
          );
        } else {
          message.info(
            {
              content: '修改成功',
              style: {
                marginTop: 200,
              },
            },
            3,
          );
          let newCommentDataSource=structuredClone(commentDataSource)
          newCommentDataSource.map ((item)=>{
            item.audit=true;
            return item;
          })
          setCommentDataSource(newCommentDataSource)
        }
      }
    });
  };
  return (
    <div
      style={{ position: 'sticky', top: 0, zIndex: 99, background: '#fff' }}
    >
      <div style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={handleSearch}>
          <SearchOutlined />
          按条件检索
        </Button>
        <Button style={{ marginLeft: 20 }} onClick={handleResetSearch}>
          <SearchOutlined />
          重置所有条件
        </Button>
        <Button style={{ marginLeft: 100 }} danger onClick={submitChange}>
          保存修改结果
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <label>写评论的时间:</label>
        <RangePicker
          allowClear
          presets={rangePresets}
          onChange={(dates: any, dateStrings) =>
            onRangeChange(dates, dateStrings)
          }
          value={
            afterUpdateTime && beforeUpdateTime
              ? [
                dayjs(afterUpdateTime, dateFormat),
                dayjs(beforeUpdateTime, dateFormat),
              ]
              : null
          }
        />
        <div style={{ marginLeft: 200 }}>
          <label>评论状态:</label>
          <Select
            value={commentStatus}
            style={{ width: 120 }}
            onChange={handleCommentStatusChange}
            options={[
              { value: 'all', label: '全部' },
              { value: 'show', label: '展示' },
              { value: 'notshow', label: '不展示' },
            ]}
          />
          <label>审核状态</label>
          <Select
            value={auditStatus}
            style={{ width: 120 }}
            onChange={handleAuditStatusChange}
            options={[
              { value: 'all', label: '全部' },
              { value: 'audited', label: '已审核' },
              { value: 'unaudited', label: '未审核' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
