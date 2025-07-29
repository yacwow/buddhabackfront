import { request } from '@umijs/max';
import { Button, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [options, setOptions] = useState([]);
  const [emailData, setEmailData] = useState<{
    content: string | null;
    description: string | null;
    descriptionchinese: string | null;
    emailmanagementid: number | null;
    firstline: string | null;
    title: string | null;
  }>({
    content: null,
    description: null,
    descriptionchinese: null,
    emailmanagementid: null,
    firstline: null,
    title: null,
  });
  useEffect(() => {
    request('/admin/secure/getAllEmailType').then((data) => {
      if (data.result) {
        let newOption = data.data.emailType.map((item: any) => {
          return {
            value: item.description,
            label: item.descriptionchinese,
          };
        });
        setOptions(newOption);
      }
    });
  }, []);
  const handleChange = (value: string) => {
    request('/admin/secure/getEmailByDescription', {
      params: {
        description: value,
      },
    }).then((data) => {
      if (data.result) {
        setEmailData(data.data.email);
      }
    });
  };
  const handleSubmitEmailTemplate = () => {
    request('/admin/secure/updateEmailById', {
      method: 'POST',
      data: {
        emailData: JSON.stringify(emailData),
      },
    }).then((data) => {
      if (data.result) {
        message.info({ content: '修改成功', style: { marginTop: '40vh' } }, 4);
      } else {
        message.error({ content: '修改失败', style: { marginTop: '40vh' } }, 4);
      }
    });
  };
  useEffect(() => {
    const container = document.getElementById('myEmailManagement');
    // container?.innerHTML = emailData.content;
    console.log(container);
    if (container) {
      container.innerHTML = emailData.content ? emailData.content : '';
    }
  }, [emailData.content]);
  return (
    <div>
      <label>请选择想要展示的邮件：</label>
      <Select
        style={{ width: 160 }}
        onChange={handleChange}
        options={options}
      />

      <div>以下所有为数据库保存内容</div>
      <div>
        <span>模板名称:</span>
        <span>{emailData.descriptionchinese}</span>
      </div>
      <div>以下部分为可修改部分</div>
      <div>
        <span>邮件主题:</span>
        <Input
          value={emailData.title ? emailData.title : ''}
          style={{ width: 800 }}
          onChange={(e) => {
            let newEmailData = structuredClone(emailData);
            newEmailData.title = e.target.value;
            setEmailData(newEmailData);
          }}
        />
      </div>
      <div>
        <span>内文预览:</span>
        <Input
          value={emailData.firstline ? emailData.firstline : ''}
          style={{ width: 800 }}
          onChange={(e) => {
            let newEmailData = structuredClone(emailData);
            newEmailData.firstline = e.target.value;
            setEmailData(newEmailData);
          }}
        />
      </div>
      <div style={{ display: 'flex', marginTop: 20 }}>
        <Input.TextArea
          value={emailData.content ? emailData.content : ''}
          style={{ width: 600, height: 800 }}
          onChange={(e) => {
            let newEmailData = structuredClone(emailData);
            newEmailData.content = e.target.value;
            setEmailData(newEmailData);
          }}
        />
        <div
          id="myEmailManagement"
          style={{
            width: 600,
            height: 800,
            marginLeft: 30,
            border: '1px solid black',
            overflow: 'scroll',
          }}
        ></div>
      </div>
      <div style={{ marginTop: 10 }}>
        <Button type="primary" onClick={handleSubmitEmailTemplate}>
          保存数据
        </Button>
      </div>
    </div>
  );
};
export default App;
