import React, { Dispatch, SetStateAction, useState } from 'react';
import { message, Button, Input } from 'antd';
import styles from './HeaderLink.less';
import { request } from '@umijs/max';
import { headerlistDataType } from '../type';

import ColorPicker from 'antd/es/color-picker';
interface Props {
  line: number;
  successFileList: headerlistDataType[];
  setSuccessFileList: Dispatch<SetStateAction<headerlistDataType[]>>;
}
const App: React.FC<Props> = (props) => {
  const { successFileList, setSuccessFileList, line } = props;

  const [count, setCount] = useState(-1); //用来给newsbanner加id的,往下减1

  const handleUrlLink = (e: any, id: number) => {
    let newSuccessFileList = structuredClone(successFileList);
    for (let i = 0; i < newSuccessFileList.length; i++) {
      if (newSuccessFileList[i].newsbannerid === id) {
        newSuccessFileList[i].url = e.target.value;
      }
    }
    setSuccessFileList(newSuccessFileList);
  };
  const handleDescriptionChange = (e: any, id: number) => {
    let newSuccessFileList = structuredClone(successFileList);
    for (let i = 0; i < newSuccessFileList.length; i++) {
      if (newSuccessFileList[i].newsbannerid === id) {
        newSuccessFileList[i].description = e.target.value;
      }
    }
    setSuccessFileList(newSuccessFileList);
  };

  const handleDeleteLine = (targetUrl: string) => {
    let newSuccessFileList = successFileList.filter((item) => {
      return item.url !== targetUrl;
    });
    setSuccessFileList(newSuccessFileList);
  };
  const handleColorChange = (e: any, id: number) => {
    console.log(e.toHexString());
    let newSuccessFileList = structuredClone(successFileList);
    for (let i = 0; i < newSuccessFileList.length; i++) {
      if (newSuccessFileList[i].newsbannerid === id) {
        newSuccessFileList[i].color = e.toHexString();
      }
    }
    setSuccessFileList(newSuccessFileList);
  };

  const buildPicture = () => {
    return successFileList.map((item, index: number) => {
      return (
        <div key={index} className={styles.insideDiv}>
          <div>
            <Button danger onClick={() => handleDeleteLine(item.url)}>
              点击删除该列
            </Button>
          </div>
          <div> 跳转的页面</div>
          <input
            type="text"
            value={item.url}
            style={{ width: 160 }}
            onChange={(e) => {
              handleUrlLink(e, item.newsbannerid);
            }}
          />
          <div></div>
          {line === 4 || line === 0 ? (
            <>
              <div>介绍</div>
              <Input.TextArea
                style={{ width: 160, height: 70 }}
                value={item.description}
                onChange={(e) => {
                  handleDescriptionChange(e, item.newsbannerid);
                }}
              />
            </>
          ) : null}
          {line === 0 ? (
            <ColorPicker
              value={item.color}
              onChange={(e) => {
                handleColorChange(e, item.newsbannerid);
              }}
              format={'hex'}
            />
          ) : null}
        </div>
      );
    });
  };
  const handleAddNewLine = () => {
    let newLine = { line: 0, newsbannerid: count, url: '', description: '' };
    setCount(count + 1);
    setSuccessFileList([...successFileList, newLine]);
  };
  const handleHomePageBannerSave = () => {
    let allDeleted = false;
    if (successFileList === undefined || successFileList.length === 0) {
      allDeleted = true;
    }
    console.log(successFileList);
    request('/admin/updateHomePageBannerSave', {
      params: {
        allDeleted,
        line: line,
        successFileList: JSON.stringify(successFileList),
      },
    }).then((data) => {
      if (data.result) {
        message.info({ content: '保存成功', style: { marginTop: '40vh' } }, 3);
      }
    });
  };
  return (
    <div style={{ width: 1000 }}>
      <div className={styles.showPic}>
        {successFileList.length > 0 ? buildPicture() : <div> </div>}
      </div>
      <Button onClick={handleAddNewLine}>新增跳转的链接</Button>
      <div style={{ marginBottom: 10 }}></div>

      <Button type="primary" onClick={handleHomePageBannerSave}>
        保存
      </Button>
    </div>
  );
};

export default App;
