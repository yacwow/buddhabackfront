import { CheckOutlined, MailOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { Button, Image, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './UserEmailComp.less';

const App: React.FC = () => {
  const [userInfoList, setUserInfoList] = useState<any>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const handleSubmit = (id: string, solved: boolean) => {
    console.log(id);
    request('/admin/secure/changeSolvedStatus', {
      params: {
        userId: id,
        solved,
      },
    }).then((data) => {
      if (data.result) {
        //本地改变这个的状态
        let newUserInfoList = structuredClone(userInfoList);
        let finalUser = newUserInfoList.map((item: any) => {
          if (item.userEmailId === id) {
            item.solved = !item.solved;
            return item;
          }
          return item;
        });
        setUserInfoList(finalUser);
      }
    });
  };
  //每一个都变成一个展示组件
  const buildBody = () => {
    return userInfoList.map((item: any, index: number) => {
      let pictureSrc = item.picturesrc.split(';;');
      // eslint-disable-next-line array-callback-return
      let str = [];
      for (let i = 0; i < pictureSrc.length; i++) {
        if (pictureSrc[i] !== '') {
          str.push(pictureSrc[i]);
        }
      }
      return (
        <div key={index} className={styles.oneEmail}>
          {item.solved ? (
            <div className={styles.solved}>
              <CheckOutlined style={{ fontSize: 36, color: '#f40' }} />
            </div>
          ) : null}
          <div>
            <span className={styles.label}>{'用户email:'}</span>
            <a
              href={`mailto:${item.email}?subject=${item.title}-This is a reply.&amp;subject=This is the subject.&amp;body=This is the content.`}
              style={{ color: '#333' }}
            >
              <MailOutlined />
              {item.email}
            </a>
          </div>
          <div>
            <span className={styles.label}>{'用户主题:'}</span>
            {item.title}
          </div>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <span className={styles.label}>{'用户内容:'}</span>
            <div>{item.commentdetail}</div>
          </div>
          <div style={{ display: 'flex' }}>
            {str.map((item: string, index: number) => {
              return (
                <Image width={150} height={100} key={index} src={item} alt="" />
              );
            })}
          </div>
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              style={{ marginRight: '30px' }}
              onClick={() => {
                handleSubmit(item.userEmailId, item.solved ? true : false);
              }}
            >
              {!item.solved ? '标志为已解决' : '取消已解决'}
            </Button>
          </div>
        </div>
      );
    });
  };
  useEffect(() => {
    request('/admin/secure/getUserEmailDetailInfo', {
      params: {
        page,
      },
    }).then((data) => {
      if (data.result) {
        setUserInfoList(data.data.userEmailList);
        setCount(data.data.count);
      }
    });
  }, [page]);
  return (
    <div className={styles.container}>
      {userInfoList.length > 0 ? (
        buildBody()
      ) : (
        <div>{'目前没有任何用户的email'}</div>
      )}
      <Pagination
        defaultCurrent={1}
        total={count}
        current={page}
        onChange={(page, pageSize) => {
          setPage(page);
        }}
      />
    </div>
  );
};
export default App;
