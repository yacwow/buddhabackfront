import React from 'react';
import LeftSideNavigate from '../LeftSideNavigate';
import styles from './LayOut.less';
interface Props {
  children: any;
}
const App: React.FC<Props> = (props) => {
  return (
    <div className={styles.display}>
      <LeftSideNavigate />
      <div className={styles.wrap}>{props.children}</div>
    </div>
  );
};
export default App;
