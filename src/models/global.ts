import { history, request } from '@umijs/max';
import { MenuTheme } from 'antd';
import { useState, useEffect } from 'react';

const useUser = () => {
  const [theme, setTheme] = useState<MenuTheme>('light');
  const [selectedKey, setSelectedKey] = useState([]);
  const [userName, setUserName] = useState('');
  const [level, setLevel] = useState('');
  const [treeDataArr, setTreeDataArr] = useState<
    {
      imgSrc: string;
      title: string;
      value: string;
      categoryId: number;
      author: string;
      updateTime: string;
      children: {
        imgSrc: string;
        title: string;
        value: string;
        categoryId: number;
        author: string;
        updateTime: string;
        children: {
          imgSrc: string;
          title: string;
          value: string;
          categoryId: number;
          author: string;
          updateTime: string;
        }[];
      }[];
    }[]
  >([]);
  const [homeBottomCategoryInfo, setHomeBottomCategoryInfo] =
    useState<string>();
  useEffect(() => {
    request('/admin/secure/getAdminInfo').then(async (data) => {
      if (data.code !== 20000) {
        history.push('/backend/login');
        return;
      }

      await setUserName(data.data.nickname);
      await setLevel(data.data.level);
    });
  }, []);
  const [openKeys, setOpenKeys] = useState([
    'sub1',
    'sub2',
    'sub3',
    'sub4',
    'sub6',
  ]);
  return {
    theme,
    setTheme,
    selectedKey,
    setSelectedKey,
    userName,
    level,
    setUserName,
    setLevel,
    openKeys,
    setOpenKeys,
    treeDataArr,
    setTreeDataArr,
    homeBottomCategoryInfo,
    setHomeBottomCategoryInfo,
  };
};

export default useUser;
