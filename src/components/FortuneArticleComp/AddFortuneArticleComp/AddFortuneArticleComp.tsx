// import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import React, { useState, useEffect } from 'react';
// import { Editor, Toolbar } from '@wangeditor/editor-for-react';
// import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { request } from '@umijs/max';
import {
  Button,
  Input,
  message,
  Switch,
  Upload,
  UploadFile,
  Image,
  Modal,
  InputNumber,
  Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadProps } from 'antd/es/upload';
import styles from './AddFortuneArticleComp.less';
import './AddFortuneArticleComp.css';
import { history } from '@umijs/max';


const yearOptions: { value: string | number, label: string | number }[] = [];

for (let i = 2024; i <= 2050; i++) {
  yearOptions.push({ value: i, label: i });
}

const monthOptions: { value: string | number, label: string | number }[] = [];

for (let i = 1; i <= 12; i++) {
  monthOptions.push({ value: i, label: i });
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const MyEditor = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  // editor 实例
  // const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  const [successFileList, setSuccessFileList] = useState<
    {
      url: string;
    }[]
  >([]);

  // 编辑器内容
  const [html, setHtml] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [rank, setRank] = useState(0);
  const [month, setMonth] = useState<number | null>(null)
  const [year, setYear] = useState<number | null>(null)
  const [masked, setMasked] = useState<boolean>(false);
  const [active, setActive] = useState(true);
  const [fortuneId, setFortuneId] = useState('');
  const [update, setUpdate] = useState(false);
  const [homePageShowed, setHomePageShowed] = useState(false);

  const [error, setError] = useState("")

  useEffect(() => {
    let pathArr = location.pathname.split('/');
    // console.log(pathArr);
    if (pathArr.length > 3) {
      if (isNaN(+pathArr[3])) {
        messageApi.info(
          {
            content: 'url有问题',
            style: { marginTop: '40vh' },
          },
          5,
        );
        return;
      }
      setFortuneId(pathArr[3]);
      request('/admin/secure/getSingleFortuneArticle', {
        params: { fortuneId: pathArr[3] },
      }).then((data) => {
        if (data.result) {
          setUpdate(true);
          setSuccessFileList([{ url: data.data.imgSrc }]);
          setActive(data.data.active);
          setHtml(data.data.content);
          setIntroduction(data.data.introduction);
          setRank(data.data.rank);
          setMonth(data.data.month);
          setYear(data.data.year);
          setMasked(data.data.masked === null ? false : data.data.masked);
          setHomePageShowed(data.data.homePageShowed === null ? false : data.data.homePageShowed);
        } else {
          messageApi.info(
            {
              content: '没找到这篇文章，不知道哪里有问题，麻烦重进一次',
              style: { marginTop: '40vh' },
            },
            5,
          );
        }
      });
    } else {
      setUpdate(false);
    }
  }, []);
  const [modelOpen, setModelOpen] = useState(false)

  const uploadButton = (
    <div onClick={() => {
      if (masked) {
        messageApi.error('遮罩的图片不需要上传');
        return;
      }
    }}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };
  //处理上传
  const handleChange: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
  }) => {
    const { status, response } = file;
    console.log('in222', status, file);
    // 上传完成？
    if (status === 'done') {
      console.log('in123');
      // 服务端返回JSON：{result: true/false, url: ""}
      const { result, url } = response;
      console.log(url);
      console.log('in123');
      if (result !== 'false') {
        setSuccessFileList([
          {
            url,
          },
        ]);
        // antd的message方法
        messageApi.success('上传成功');
      } else {
        messageApi.error('上传失败');
      }
    }
    setFileList(newFileList);
  };
  const handleDeletePicture = (targetUrl: string) => {
    let url = require('url');
    let obj = url.parse(targetUrl, true);
    let delPath = obj.path;
    //删除该url
    request(`/admin/secure/deletePicture`, { params: { delPath } }).then(
      (data) => {
        if (data.result) {
          //删除成功
          messageApi.success('删除成功');
          setSuccessFileList([]);
        } else {
          messageApi.error('删除失败');
        }
      },
    );
  };
  const buildPicture = () => {
    return successFileList.map((item, index: number) => {
      return (
        <div key={index} className={styles.insideDiv}>
          <div>
            {!masked ? <Image
              style={{ display: 'inline-block' }}
              width={300}
              height={300}
              src={`${item.url}`}
            /> : <div className={styles.showMask}
              style={{
                '--start-year-angle': `${(year === null ? 1900 : year - 1900) % 12 * 30}deg`,
                '--start-month-angle': `${(month === null ? 0 : month - 1) % 12 * 30}deg`,
                backgroundImage: `url(${item.url})`,
              } as React.CSSProperties}></div>}
          </div>

          <div>
            <Button danger onClick={() => handleDeletePicture(item.url)} disabled={masked}>
              点击删除图片
            </Button>
          </div>
        </div>
      );
    });
  };

  const updateOrAddFortuneArticle = () => {
    if (successFileList.length === 0) {
      messageApi.error(
        { content: '必须要有跳转前的图片', style: { marginTop: '40vh' } },
        5,
      );
      return;
    }
    if (masked) {
      if (year === null || month === null) {
        message.info(
          { content: '遮罩的图片必须要有年和月', style: { marginTop: '40vh' } },
          5,
        );
        return;
      }
    }
    request('/admin/secure/updateOrAddFortuneArticle', {
      method: 'POST',
      data: {
        update,
        imgSrc: successFileList[0].url,
        active,
        introduction,
        rank,
        html,
        fortuneId,
        month,
        year,
        masked,
        homePageShowed
      },
    }).then((data) => {
      if (data.result) {
        messageApi.info({ content: '修改成功', style: { marginTop: '40vh' } }, 5);
        if (update) {
        } else {
          setFortuneId('' + data.data.id);
          setRank(data.data.rank);
          history.push(`/backend/addfortuneArticle/${data.data.id}`);
        }
        setUpdate(true);
      }
    });
  };
  // const [fixedHtml, setFixedHtml] = useState('');
  return (
    <>
      {contextHolder}
      <Modal
        title="Basic Modal"
        open={modelOpen}
        onOk={() => {
          console.log(active)
          setActive(!active);
          setModelOpen(false)
        }}
        onCancel={() => { setModelOpen(false) }}
      >
        <p>{error}</p>
      </Modal>
      <h2>图片，用于跳转前的小图</h2>
      <div>
        <h4>
          图片展示区，
          <span style={{ color: 'red' }}>删除图片点击该区域的删除按钮</span>
        </h4>
        <div className={styles.showPic}>
          {successFileList.length > 0 ? buildPicture() : <div> </div>}
        </div>
        <h4>图片上传</h4>
        <Upload
          action="/admin/secure/upload"
          listType="picture-card"
          maxCount={1}
          fileList={fileList}
          headers={{ token: localStorage.getItem('token') || '' }}
          onPreview={handlePreview}
          onChange={handleChange}
          disabled={masked}

        >
          {uploadButton}
        </Upload>
      </div>

      <h2>文章概述，用于跳转前简介</h2>
      <Input
        value={introduction}
        onChange={(e) => {
          setIntroduction(e.target.value);
        }}
      />
      <div style={{ display: 'flex', alignItems: "center" }}>
        <h2 >年</h2>
        <Select
          value={year}
          options={yearOptions}
          style={{ width: 120 }}
          placeholder="请选择年"
          onChange={(value) => {
            if (value === null || value === undefined) {
              setYear(null);
            } else {
              setYear(+value);
            }
          }}
        />
        <h2 style={{ marginLeft: 20 }}>月</h2>
        <Select
          value={month}
          options={monthOptions}
          style={{ width: 120 }}
          placeholder="请选择月"
          onChange={(value) => {
            if (value === null || value === undefined) {
              setMonth(null);
            } else {
              setMonth(+value);
            }
          }}
        />
        <h2 style={{ marginLeft: 20 }}>是否展示在首页</h2>
        <Switch
          checked={homePageShowed}
          checkedChildren="是" unCheckedChildren="否"
          onChange={(value) => {

            if (value && !active) {
              messageApi.error({ content: "不能展示一个在fortune主题页面都不展示的文章，请先勾选展示选项", style: { marginTop: "40vh" } }, 6)
              return;
            } else {
              setHomePageShowed(value)
            }
          }}
        />
      </div>

      <h2>是否遮罩（独立的图片不需要，主要是生肖那张图才需要）</h2>
      <Switch checked={masked} onChange={(checked) => {
        if (checked) {
          setSuccessFileList([{ url: "/businessIcon/fortune.webp" }]);
          if (fileList.length > 0) {
            setFileList([]);
          }
        } else {
          setSuccessFileList([]);
        }
        setMasked(checked)
      }} checkedChildren="有遮罩" unCheckedChildren="没有遮罩" />

      <h2>文章原文</h2>
      <div
        style={{
          marginTop: 15,
          border: '1px solid black',
          minHeight: 200,
          maxHeight: 800,
          maxWidth: 750,
          overflow: 'scroll',
        }}
        className={styles.contentContainer}
        dangerouslySetInnerHTML={{ __html: html }}
      />


      <h2>文章展示位置--数字越大，排序越前</h2>
      <InputNumber
        value={rank}
        onChange={(e) => {
          if (!e) {
            setRank(0);
          } else {
            if (!isNaN(+e)) {
              setRank(e);
            }
          }
        }}
      />

      <h2>是否在前端展示</h2>
      <Switch
        checkedChildren="展示"
        unCheckedChildren="不展示"
        checked={active}
        onChange={() => {
          if (!active) {
            if (month !== null && year !== null) {
              // 当前时间
              const now = new Date();
              const currentYear = now.getFullYear();
              const currentMonth = now.getMonth() + 1; // getMonth 返回 0-11，所以要 +1

              // 允许的最大年月 = 当前年月 + 1 个月
              let allowedYear = currentYear;
              let allowedMonth = currentMonth + 1;
              if (allowedMonth > 12) {
                allowedMonth = 1;
                allowedYear += 1;
              }

              // 判断是否超过允许的年月
              if (year > allowedYear || (year === allowedYear && month > allowedMonth)) {
                setError(`注意：展示的是 ${allowedYear} 年 ${allowedMonth} 月，这个月份在当前月之后两个月了。确定需要修改，则点击确认，否则取消`)
                setModelOpen(true)
                return;
              }
            }

          } else {
            setActive(!active)
            setHomePageShowed(!active)
          }

        }}
      />

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <div style={{ marginTop: 30 }}>
        {update ? (
          <Button type="primary" onClick={updateOrAddFortuneArticle}>
            修改文章
          </Button>
        ) : (
          <Button type="primary" onClick={updateOrAddFortuneArticle}>
            添加文章
          </Button>
        )}
      </div>

      <div style={{ marginTop: 500 }}>用不到的部分</div>
      <div>{html}</div>
      <Input.TextArea
        style={{ minHeight: 500 }}
        onChange={(e) => {
          console.log(e.target.value);
          // setFixedHtml(e.target.value);
          setHtml(e.target.value)
        }}
      />
      <Button
        // disabled={fortuneId === ''}
        onClick={() => {
          updateOrAddFortuneArticle()
          // if (!isNaN(+fortuneId)) {
          //   request('/admin/secure/updateFixedHtml', {
          //     method: 'POST',
          //     data: {
          //       fixedHtml,
          //       fortuneId,
          //     },
          //   }).then((data) => {
          //     if (data.result) {
          //       if (data.code === 20001) {
          //         message.info(
          //           {
          //             content: `${data.message}`,
          //             style: { marginTop: '40vh' },
          //           },
          //           5,
          //         );
          //       } else {
          //         message.info(
          //           { content: '修改成功', style: { marginTop: '40vh' } },
          //           5,
          //         );
          //       }
          //     } else {
          //       message.info(
          //         { content: '修改失败', style: { marginTop: '40vh' } },
          //         5,
          //       );
          //     }
          //   });
          // }
        }}
      >
        专用保存
      </Button>
    </>
  );
};

export default MyEditor;
