import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import styles from './AddProductHeader.less';
// 狗日的输入法问题
// let isComposition = false;
// const isChrome = navigator.userAgent.indexOf('Chrome') > -1;
const App: React.FC = () => {
  const {
    value,
    setValue,
    value1,
    setValue1,
    value2,
    setValue2,
    setProductId,
    href,
    title2,
    setTitle2,
  } = useModel('productUpdateData');
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(value1.length + value2.length);
  }, [value, value1, value2]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div>标题，当前共{length}个字符【标题主体必填】</div>
        <div>
          <span style={{ color: '#f40' }}>产品title：必填</span>
          <input
            type="text"
            placeholder="产品title--必填"
            value={value1}
            onChange={(e) => {
              setValue1(e.target.value);
            }}
          />
        </div>

        <div>
          <span style={{ color: '#f40' }}>产品title2：不出现在前端选填</span>
          <input
            type="text"
            placeholder="产品title2--选填"
            value={title2}
            onChange={(e) => {
              setTitle2(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="标题后缀，目前填了也没用"
            value={value2}
            onChange={(e) => {
              setValue2(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.link}>
        <div>固定链接【目前不用填，自动添加】</div>
        <div>
          <input
            disabled={href === ''}
            style={{ color: '#1677ff' }}
            value={href}
            onChange={(e) => {
              e.preventDefault();
              // setHref(e.target.value);
            }}
            onClick={() => {
              window.open('https://www.karmaandchi.com' + href, '_blank');
            }}
            type="text"
            placeholder="目前不用填"
          />
        </div>
      </div>
    </div>
  );
};
export default App;
