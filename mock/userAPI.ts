const users = [
  { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
  { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
];

export default {
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'GET /api/generalProduct/tops': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  // 'GET /api/itemRankingList': (req: any, res: any) => {
  //   console.log('in')
  //   return res.json({
  //     success: true,
  //     data: { list: "list" },
  //     errorCode: 0,
  //   });
  // },
  // 'POST /api/itemRankingList/TShirt': (req: any, res: any) => {
  //   console.log('in')
  //   return res.json({
  //     success: true,
  //     data: { list: "list" },
  //     errorCode: 0,
  //   });
  // },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
    });
  },
};
