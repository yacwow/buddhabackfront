import { useState } from 'react';

const useUser = () => {
  const [
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  ] = useState<
    {
      imgsrc: string;
      line?: number;
      webdataid: number;
      showednum: number;
      url: string;
      description?: string;
    }[]
  >([]);

  return {
    categorySpecialEventSuccessFileList,
    setCategorySpecialEventSuccessFileList,
  };
};

export default useUser;
