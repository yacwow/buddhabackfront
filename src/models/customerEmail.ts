import { useState } from 'react';

const useUser = () => {
  const [emailInput, setEmailInput] = useState(''); //邮箱地址
  const [title, setTitle] = useState(''); //文本的title

  return {
    emailInput,
    setEmailInput,
    title,
    setTitle,
  };
};

export default useUser;
