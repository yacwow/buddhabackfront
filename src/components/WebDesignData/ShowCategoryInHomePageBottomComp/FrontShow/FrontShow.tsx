import { RightOutlined, UpOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styles from './FrontShow.less';
import { NavLink } from '@umijs/max';
interface Props {
  selectedCategoryTitle: {
    title: string;
    firstLevelIndex: number;
    secondLevelIndex: number;
    value: string;
    imgSrc: string;
    sub?: {
      title: string;
      value: string;
    }[];
  }[];
}
const App: React.FC<Props> = ({ selectedCategoryTitle }) => {
  const [active, setActive] = useState<boolean[]>([]);

  useEffect(() => {
    let newActive = selectedCategoryTitle.map((item) => {
      return false;
    });
    setActive(newActive);
    console.log(newActive);
    console.log(selectedCategoryTitle)
  }, [selectedCategoryTitle]);
  return (
    <div className={styles.wrap}>
      {selectedCategoryTitle.map((item, index) => {
        return (
          <li className={styles.categoryLi} key={index}>
            <div className={styles.levelOne}>
              <div className={styles.levelOneName}>
                <div className={styles.thumb}>
                  <div>
                    <img src={item.imgSrc} />
                  </div>
                </div>
                {item.title}
              </div>
              <UpOutlined
                className={styles.close}
                style={
                  active[index]
                    ? { transform: 'rotate(180deg)' }
                    : { transform: 'rotate(0deg)' }
                }
                onClick={() => {
                  let newActive = structuredClone(active);
                  newActive[index] = !newActive[index];
                  setActive(newActive);
                }}
              />
            </div>
            <ul
              style={active[index] ? { display: 'flex' } : { display: 'none' }}
            >
              <li className={styles.levelTwo}>
                <NavLink to={item.value}>
                  <span>ALL</span>
                  <RightOutlined />
                </NavLink>
              </li>
              {item.sub?.map((item1, index1) => {
                return (
                  <li className={styles.levelTwo} key={index1}>
                    <NavLink to={item1.value}>
                      <span>{item1.title}</span>
                      <RightOutlined />
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </div>
  );
};
export default App;
