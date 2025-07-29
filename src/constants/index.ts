export const DEFAULT_NAME = 'Umi Max111111';

// // 放置url对应关系的地方,这个后端请求或者前端问题都不大 navigateline的数据，固定放在前端吧
// export const navLinkUrl = {
//     bestSeller: {
//         url: "bestSeller",
//         name: "売れ筋"
//     },
//     timeSeller: {
//         url: "timeSeller",
//         name: "タイムセール"
//     },
//     newProduct: {
//         url: "dailyNew",
//         name: "新入荷アイテム"
//     },
//     //所有对象的第一个是根路由 其他是子路由
//     generalProduct1: {
//         girlsLoveGeneral: {
//             url: "generalSale/girlsLoveGeneral",
//             name: "レディース",
//         },
//         girlsTops: {
//             url: "generalSale/girlsLoveGeneral/girlsTops",
//             name: "トップス",
//             hot: true
//         },
//         girlsOuter: {
//             url: "generalSale/girlsLoveGeneral/girlsOuter",
//             name: "アウター",
//             hot: true
//         },
//         girlsDress: {
//             url: "generalSale/girlsLoveGeneral/girlsDress",
//             name: "ワンピース",
//             hot: true
//         },
//         girlsBottom: {
//             url: "generalSale/girlsLoveGeneral/girlsBottom",
//             name: "ボトムス",
//         },
//         girlsSetUp: {
//             url: "generalSale/girlsLoveGeneral/girlsSetUp",
//             name: "セットアップ",
//         },
//         girlsShoes: {
//             url: "generalSale/girlsLoveGeneral/girlsShoes",
//             name: "ジュース",
//         },
//         girlsGoods: {
//             url: "generalSale/girlsLoveGeneral/girlsGoods",
//             name: "小物",
//         },
//         menFashion: {
//             url: "generalSale/girlsLoveGeneral/menFashion",
//             name: "メンズファッション",
//         },
//     },
//     top2: {
//         topGeneral: {
//             url: "generalSale/topGeneral",
//             name: "トップス"
//         },
//         topShirt: {
//             url: "generalSale/topGeneral/topBlouse",
//             name: "シャツ・ブラウス",
//             hot: true,
//         },
//         topTShirt: {
//             url: "generalSale/topGeneral/topTShirt",
//             name: "Ｔシャツ",
//         },
//         topHoodie: {
//             url: "generalSale/topGeneral/topHoodie",
//             name: "パーカー・スウェット",
//         },
//         topSweater: {
//             url: "generalSale/topGeneral/topSweater",
//             name: "セーター",
//         },
//         topNoSleeveTops: {
//             url: "generalSale/topGeneral/topNoSleeveTops",
//             name: "ノースリーブ・ベスト",
//         },
//     },
//     dress: {
//         dressGeneral: {
//             url: "generalSale/dressGeneral",
//             name: "ワンピース",
//         },
//         casualDress: {
//             url: "generalSale/dressGeneral/casualDress",
//             name: "カジュアルワンピース",
//         },
//         strapSkirt: {
//             url: "generalSale/dressGeneral/strapSkirt",
//             name: "サロペットスカート",
//         },
//         olDress: {
//             url: "generalSale/dressGeneral/olDress",
//             name: "通勤ワンピース",
//         },
//         shirtDress: {
//             url: "generalSale/dressGeneral/shirtDress",
//             name: "シャツワンピース",
//         },
//         knitDress: {
//             url: "generalSale/dressGeneral/knitDress",
//             name: "ニットワンピース",
//         },
//     },
//     bottom: {
//         bottomGeneral: {
//             url: "generalSale/bottomGeneral",
//             name: "ボトムス"
//         },
//         bottomCausal: {
//             url: "generalSale/bottomGeneral/bottomCausal",
//             name: "カジュアルパンツ"
//         },
//         bottomSkirt: {
//             url: "generalSale/bottomGeneral/bottomSkirt",
//             name: "スカート"
//         },
//         bottomDenim: {
//             url: "generalSale/bottomGeneral/bottomDenim",
//             name: "デニム"
//         },
//         bottomShortPants: {
//             url: "generalSale/bottomGeneral/bottomShortPants",
//             name: "ショートパンツ"
//         },
//         bottomAllInOne: {
//             url: "generalSale/bottomGeneral/bottomAllInOne",
//             name: "オールインワン"
//         }
//     },
//     outer: {
//         outerGeneral: {
//             url: "generalSale/outerGeneral",
//             name: "アウター"
//         },
//         outerCardigan: {
//             url: "generalSale/outerGeneral/outerCardigan",
//             name: "カーディガン"
//         },
//         outerSuit: {
//             url: "generalSale/outerGeneral/outerSuit",
//             name: "スーツ"
//         },
//         outerJacket: {
//             url: "generalSale/outerGeneral/outerJacket",
//             name: "ジャケット"
//         },
//         outerCoat: {
//             url: "generalSale/outerGeneral/outerCoat",
//             name: "コート"
//         },
//         outerDownCoat: {
//             url: "generalSale/outerGeneral/outerDownCoat",
//             name: "ダウンコート"
//         },
//     },
//     setUp: {
//         url: "generalSale/setUp",
//         name: "セットアップ"
//     },
//     shoes: {
//         generalShoes: {
//             url: "generalSale/generalShoes",
//             name: "シューズ"
//         },
//         pumpShoes: {
//             url: "generalSale/generalShoes/pumpShoes",
//             name: "パンプス"
//         },
//         flatShoes: {
//             url: "generalSale/generalShoes/flatShoes",
//             name: "フラットシューズ"
//         },
//         sandalShoes: {
//             url: "generalSale/generalShoes/sandalShoes",
//             name: "サンダル"
//         },
//         sneakerShoes: {
//             url: "generalSale/generalShoes/sneakerShoes",
//             name: "スニーカー"
//         },
//         bootShoes: {
//             url: "generalSale/generalShoes/bootShoes",
//             name: "ブーツ"
//         },
//     },
//     inner: {
//         generalInner: {
//             url: "generalSale/generalInner",
//             name: "下着"
//         },
//         swimwearInner: {
//             url: "generalSale/generalInner/swimwearInner",
//             name: "水着・ビキニ"
//         },
//         underwearInner: {
//             url: "generalSale/generalInner/underwearInner",
//             name: "ブラジャー＆ショートセット"
//         },
//         indoorWearInner: {
//             url: "generalSale/generalInner/indoorWearInner",
//             name: "ルームウェア・パジャマセット"
//         },
//         braInner: {
//             url: "generalSale/generalInner/braInner",
//             name: "ブラジャー"
//         },
//         shortsInner: {
//             url: "generalSale/generalInner/shortsInner",
//             name: "ショーツ"
//         },
//         accInner: {
//             url: "generalSale/generalInner/accInner",
//             name: "グッズ"
//         },
//     },
//     goods: {
//         generalGoods: {
//             url: "generalSale/generalGoods",
//             name: "小物"
//         },
//         bagGoods: {
//             url: "generalSale/generalGoods/bagGoods",
//             name: "バッグ"
//         },
//         accessoryGoods: {
//             url: "generalSale/generalGoods/accessoryGoods",
//             name: "アクセサリー"
//         },
//         hatGoods: {
//             url: "generalSale/generalGoods/hatGoods",
//             name: "帽子"
//         },
//         socksGoods: {
//             url: "generalSale/generalGoods/socksGoods",
//             name: "ソックス"
//         },
//         scarfGoods: {
//             url: "generalSale/generalGoods/scarfGoods",
//             name: "スカーフ"
//         },
//     }
// };

// export const navLinkUrl = {
//     bestSeller: {
//         url: "bestSeller",
//         name: "売れ筋"
//     },
//     timeSeller: {
//         url: "timeSeller",
//         name: "タイムセール"
//     },
//     newProduct: {
//         url: "dailyNew",
//         name: "新入荷アイテム"
//     },
//     //所有对象的第一个是根路由 其他是子路由
//     generalProduct1: {
//         girlsLoveGeneral: {
//             url: "generalSale?firstLevel=girlsLoveGeneral",
//             name: "レディース",
//         },
//         girlsTops: {
//             url: "generalSale?firstLevel=girlsLoveGeneral&secondLevel=girlsTops",
//             name: "トップス",
//             hot: true
//         },
//         girlsOuter: {
//             url: "generalSale?firstLevel=girlsLoveGeneral&secondLevel=girlsOuter",
//             name: "アウター",
//             hot: true
//         },
//         girlsDress: {
//             url: "generalSale?firstLevel=girlsLoveGeneral&secondLevel=girlsDress",
//             name: "ワンピース",
//             hot: true
//         },
//         girlsBottom: {
//             url: "generalSale?firstLevel=girlsLoveGeneral&secondLevel=girlsBottom",
//             name: "ボトムス",
//         },
//         girlsSetUp: {
//             url: "generalSale?firstLevel=girlsLoveGeneral&secondLevel=girlsSetUp",
//             name: "セットアップ",
//         },
//         girlsShoes: {
//             url: "generalSale?firstLevel=girlsLoveGeneral&secondLevel=girlsShoes",
//             name: "ジュース",
//         },
//         girlsGoods: {
//             url: "generalSale?firstLevel=girlsLoveGeneral&secondLevel=girlsGoods",
//             name: "小物",
//         },
//         menFashion: {
//             url: "generalSale?firstLevel=girlsLoveGeneral&secondLevel=menFashion",
//             name: "メンズファッション",
//         },
//     },
//     top2: {
//         topGeneral: {
//             url: "generalSale?firstLevel=topGeneral",
//             name: "トップス"
//         },
//         topShirt: {
//             url: "generalSale?firstLevel=topGeneral&secondLevel=topBlouse",
//             name: "シャツ・ブラウス",
//             hot: true,
//         },
//         topTShirt: {
//             url: "generalSale?firstLevel=topGeneral&secondLevel=topTShirt",
//             name: "Ｔシャツ",
//         },
//         topHoodie: {
//             url: "generalSale?firstLevel=topGeneral&secondLevel=topHoodie",
//             name: "パーカー・スウェット",
//         },
//         topSweater: {
//             url: "generalSale?firstLevel=topGeneral&secondLevel=topSweater",
//             name: "セーター",
//         },
//         topNoSleeveTops: {
//             url: "generalSale?firstLevel=topGeneral&secondLevel=topNoSleeveTops",
//             name: "ノースリーブ・ベスト",
//         },
//     },
//     dress: {
//         dressGeneral: {
//             url: "generalSale?firstLevel=dressGeneral",
//             name: "ワンピース",
//         },
//         casualDress: {
//             url: "generalSale?firstLevel=dressGeneral&secondLevel=casualDress",
//             name: "カジュアルワンピース",
//         },
//         strapSkirt: {
//             url: "generalSale?firstLevel=dressGeneral&secondLevel=strapSkirt",
//             name: "サロペットスカート",
//         },
//         olDress: {
//             url: "generalSale?firstLevel=dressGeneral&secondLevel=olDress",
//             name: "通勤ワンピース",
//         },
//         shirtDress: {
//             url: "generalSale?firstLevel=dressGeneral&secondLevel=shirtDress",
//             name: "シャツワンピース",
//         },
//         knitDress: {
//             url: "generalSale?firstLevel=dressGeneral&secondLevel=knitDress",
//             name: "ニットワンピース",
//         },
//     },
//     bottom: {
//         bottomGeneral: {
//             url: "generalSale?firstLevel=bottomGeneral",
//             name: "ボトムス"
//         },
//         bottomCausal: {
//             url: "generalSale?firstLevel=bottomGeneral&secondLevel=bottomCausal",
//             name: "カジュアルパンツ"
//         },
//         bottomSkirt: {
//             url: "generalSale?firstLevel=bottomGeneral&secondLevel=bottomSkirt",
//             name: "スカート"
//         },
//         bottomDenim: {
//             url: "generalSale?firstLevel=bottomGeneral&secondLevel=bottomDenim",
//             name: "デニム"
//         },
//         bottomShortPants: {
//             url: "generalSale?firstLevel=bottomGeneral&secondLevel=bottomShortPants",
//             name: "ショートパンツ"
//         },
//         bottomAllInOne: {
//             url: "generalSale?firstLevel=bottomGeneral&secondLevel=bottomAllInOne",
//             name: "オールインワン"
//         }
//     },
//     outer: {
//         outerGeneral: {
//             url: "generalSale?firstLevel=outerGeneral",
//             name: "アウター"
//         },
//         outerCardigan: {
//             url: "generalSale?firstLevel=outerGeneral&secondLevel=outerCardigan",
//             name: "カーディガン"
//         },
//         outerSuit: {
//             url: "generalSale?firstLevel=outerGeneral&secondLevel=outerSuit",
//             name: "スーツ"
//         },
//         outerJacket: {
//             url: "generalSale?firstLevel=outerGeneral&secondLevel=outerJacket",
//             name: "ジャケット"
//         },
//         outerCoat: {
//             url: "generalSale?firstLevel=outerGeneral&secondLevel=outerCoat",
//             name: "コート"
//         },
//         outerDownCoat: {
//             url: "generalSale?firstLevel=outerGeneral&secondLevel=outerDownCoat",
//             name: "ダウンコート"
//         },
//     },
//     setUp: {
//         url: "generalSale?firstLevel=setUp",
//         name: "セットアップ"
//     },
//     shoes: {
//         generalShoes: {
//             url: "generalSale?firstLevel=shoesGeneral",
//             name: "シューズ"
//         },
//         pumpShoes: {
//             url: "generalSale?firstLevel=shoesGeneral&secondLevel=pumpShoes",
//             name: "パンプス"
//         },
//         flatShoes: {
//             url: "generalSale?firstLevel=shoesGeneral&secondLevel=flatShoes",
//             name: "フラットシューズ"
//         },
//         sandalShoes: {
//             url: "generalSale?firstLevel=shoesGeneral&secondLevel=sandalShoes",
//             name: "サンダル"
//         },
//         sneakerShoes: {
//             url: "generalSale?firstLevel=shoesGeneral&secondLevel=sneakerShoes",
//             name: "スニーカー"
//         },
//         bootShoes: {
//             url: "generalSale?firstLevel=shoesGeneral&secondLevel=bootShoes",
//             name: "ブーツ"
//         },
//     },
//     inner: {
//         generalInner: {
//             url: "generalSale?firstLevel=generalInner",
//             name: "下着"
//         },
//         swimwearInner: {
//             url: "generalSale?firstLevel=generalInner&secondLevel=swimwearInner",
//             name: "水着・ビキニ"
//         },
//         underwearInner: {
//             url: "generalSale?firstLevel=generalInner&secondLevel=underwearInner",
//             name: "ブラジャー＆ショートセット"
//         },
//         indoorWearInner: {
//             url: "generalSale?firstLevel=generalInner&secondLevel=indoorWearInner",
//             name: "ルームウェア・パジャマセット"
//         },
//         braInner: {
//             url: "generalSale?firstLevel=generalInner&secondLevel=braInner",
//             name: "ブラジャー"
//         },
//         shortsInner: {
//             url: "generalSale?firstLevel=generalInner&secondLevel=shortsInner",
//             name: "ショーツ"
//         },
//         accInner: {
//             url: "generalSale?firstLevel=generalInner&secondLevel=accInner",
//             name: "グッズ"
//         },
//     },
//     goods: {
//         generalGoods: {
//             url: "generalSale?firstLevel=generalGoods",
//             name: "小物"
//         },
//         bagGoods: {
//             url: "generalSale?firstLevel=generalGoods&secondLevel=bagGoods",
//             name: "バッグ"
//         },
//         accessoryGoods: {
//             url: "generalSale?firstLevel=generalGoods&secondLevel=accessoryGoods",
//             name: "アクセサリー"
//         },
//         hatGoods: {
//             url: "generalSale?firstLevel=generalGoods&secondLevel=hatGoods",
//             name: "帽子"
//         },
//         socksGoods: {
//             url: "generalSale?firstLevel=generalGoods&secondLevel=socksGoods",
//             name: "ソックス"
//         },
//         scarfGoods: {
//             url: "generalSale?firstLevel=generalGoods&secondLevel=scarfGoods",
//             name: "スカーフ"
//         },
//     }
// };

//第一个轮播图，请求过来的数据
// export const newsBanner = [
//     {
//         url: "/newProduct",
//         imgSrc: "/img/banner1.jpg",
//     },
//     {
//         url: "/generalProduct",
//         imgSrc: "img/banner2.jpg",
//     },
//     {
//         url: "/newProduct",
//         imgSrc: "img/banner3.jpg",
//     },
//     {
//         url: "/generalProduct",
//         imgSrc: "img/banner1.jpg",
//     }
// ]

// //第二个轮播图,同理
// export const discountBanner = [
//     {
//         url: "/newProduct",
//         imgSrc: "img/secondBanner1.jpg",
//     },
//     {
//         url: "/generalProduct",
//         imgSrc: "img/secondBanner2.jpg",
//     },
//     {
//         url: "/newProduct",
//         imgSrc: "img/secondbanner3.jpg",
//     },
//     {
//         url: "/generalProduct",
//         imgSrc: "img/secondBanner4.jpg",
//     }
// ]

// //item 这个基本上就是固定的，那就先固定吧 里面的url用于发送后端请求的时候判断是1级还是2级
// export const itemRankingList = {
//     topGeneral: {
//         url: "topGeneral-1",
//         name: "トップス"
//     },
//     outerGeneral: {
//         url: "outerGeneral-1",
//         name: "アウター"
//     },
//     dressGeneral: {
//         url: "dressGeneral-1",
//         name: "ワンピース"
//     },
//     bottomGeneral: {
//         url: "bottomGeneral-1",
//         name: "ボトムス"
//     },
//     setUp: {
//         url: "setUp-1",
//         name: "セットアップ"
//     },
//     generalShoes: {
//         url: "generalShoes-1",
//         name: "シューズ"
//     },
//     bagGoods: {
//         url: "bagGoods-2",
//         name: "バッグ"
//     },
//     indoorWearInner: {
//         url: "indoorWearInner-2",
//         name: "パジャマ"
//     },
//     generalGoods: {//这个就是小物
//         url: "generalGoods-1",
//         name: "ACC"
//     },
//     swimwearInner: {
//         url: "swimwearInner-2",
//         name: "水着・ビキニ"
//     },
// }

// //BestSellerAndNewProduct 这里的url是指向某个选项，不是导航，不需要请求
// export const BestSellerAndNewProduct = {
//     newProduct: {
//         url: "newProduct",
//         name: "新作"
//     },
//     bestSeller: {
//         url: "bestSeller",
//         name: "売れ筋"
//     }
// }
// //RecommendAndTimeSeller 这里的url是指向某个选项，不是导航，不需要请求
// export const RecommendAndTimeSeller = {
//     bestSeller: {
//         url: "bestSeller",
//         name: "売れ筋商品"
//     },
//     timeSeller: {
//         url: "timeSeller",
//         name: "タイムセール"
//     }
// }
//
// //单个商品主页的展示列表,最后一个评论数会加上请求过来的正确评论数量 这个暂时固定的，就放这里
// export const BodyHeaderList = ['商品詳細', '素材サイズ', '注意事項', '交換返品', 'レビュー']

// export const MustBuy = {
//     bestSeller: {
//         url: "bestSeller",
//         name: "ヒット商品"
//     },
//     generalGoods: {
//         url: "generalGoods",
//         name: "人気コーデ"
//     },
//     topGeneral: {
//         url: "topGeneral",
//         name: "好評トップス"
//     },
//     dressGeneral: {
//         url: "dressGeneral",
//         name: "高人気ワンピース"
//     }
// }

// //Time sale main comp   一次请求，把所有的数据都请求回来就好了
// //time sale sort comp,用于给category header的 这个和下面一个的url都不是href，只是一个用于select选择的value，到时候可能会改
// export const CategoryHeaderDateList = [
//     {
//         url: "ALL",
//         name: "ALL"
//     },
//     {
//         url: "topGeneral",
//         name: "トップス"
//     },
//     {
//         url: "dressGeneral",
//         name: "ワンピース"
//     },
//     {
//         url: "bottomGeneral",
//         name: "ボトムス"
//     },
//     {
//         url: "outerGeneral",
//         name: "アウター"
//     },
//     {
//         url: "setUp",
//         name: "セット"
//     },
//     {
//         url: "generalShoes",
//         name: "ジュース"
//     },
//     {
//         url: "other",
//         name: "そのほか"
//     }
// ]
// //time sale sort comp,用于给ordertype header的 固定数据
// export const OrderTypeHeaderDataList = [
//     {
//         url: "recommend",
//         name: "おすすめ"
//     },
//     {
//         url: "priceUp",
//         name: "価格↑"
//     },
//     {
//         url: "priceDown",
//         name: "価格↓"
//     },
//     {
//         url: "stockNumUp",
//         name: "残り↑"
//     },
//     {
//         url: "stockNumDown",
//         name: "残り↓"
//     }
// ]

// // 放置url对应关系的地方,这个后端请求或者前端问题都不大 generalproductmainbody的数据,和navigateline的数据几乎一样，这里的url其实是物品类别，可以到时候换掉
// export const generalProductMainBodyUrl = {
//     generalProduct: {
//         generalproduct: {
//             url: "generalproduct",
//             name: "レディース",
//         },
//         topGeneral: {
//             url: "topGeneral",
//             name: "トップス",
//             hot: true
//         },
//         outerGeneral: {
//             url: "outerGeneral",
//             name: "アウター",
//             hot: true
//         },
//         dressGeneral: {
//             url: "dressGeneral",
//             name: "ワンピース",
//             hot: true
//         },
//         bottomGeneral: {
//             url: "bottomGeneral",
//             name: "ボトムス",
//         },
//         setUp: {
//             url: "setup",
//             name: "セットアップ",
//         },
//         generalShoes: {
//             url: "generalShoes",
//             name: "ジュース",
//         },
//         generalGoods: {
//             url: "generalGoods",
//             name: "小物",
//         },
//         menFashion: {
//             url: "menFashion",
//             name: "メンズファッション",
//         },
//     },
//     topgeneral: {
//         topGeneral: {
//             url: "topGeneral",
//             name: "トップス"
//         },
//         topShirt: {
//             url: "topShirt",
//             name: "シャツ・ブラウス",
//             hot: true,
//         },
//         topTShirt: {
//             url: "topTShirt",
//             name: "Ｔシャツ",
//         },
//         topHoodie: {
//             url: "topHoodie",
//             name: "パーカー・スウェット",
//         },
//         topSweater: {
//             url: "topSweater",
//             name: "セーター",
//         },
//         topNoSleeveTops: {
//             url: "topNoSleeveTops",
//             name: "ノースリーブ・ベスト",
//         },
//     },
//     dressgeneral: {
//         dressGeneral: {
//             url: "dressGeneral",
//             name: "ワンピース",
//         },
//         casualDress: {
//             url: "casualDress",
//             name: "カジュアルワンピース",
//         },
//         strapSkirt: {
//             url: "strapSkirt",
//             name: "サロペットスカート",
//         },
//         olDress: {
//             url: "olDress",
//             name: "通勤ワンピース",
//         },
//         shirtDress: {
//             url: "shirtDress",
//             name: "シャツワンピース",
//         },
//         knitDress: {
//             url: "knitDress",
//             name: "ニットワンピース",
//         },
//     },
//     bottomgeneral: {
//         bottomGeneral: {
//             url: "bottomGeneral",
//             name: "ボトムス"
//         },
//         bottomCausal: {
//             url: "bottomCausal",
//             name: "カジュアルパンツ"
//         },
//         bottomSkirt: {
//             url: "bottomSkirt",
//             name: "スカート"
//         },
//         bottomDenim: {
//             url: "bottomDenim",
//             name: "デニム"
//         },
//         bottomShortPants: {
//             url: "bottomShortPants",
//             name: "ショートパンツ"
//         },
//         bottomAllInOne: {
//             url: "bottomAllInOne",
//             name: "オールインワン"
//         }
//     },
//     outergeneral: {
//         outerGeneral: {
//             url: "outerGeneral",
//             name: "アウター"
//         },
//         outerCardigan: {
//             url: "outerCardigan",
//             name: "カーディガン"
//         },
//         outerSuit: {
//             url: "outerSuit",
//             name: "スーツ"
//         },
//         outerJacket: {
//             url: "outerJacket",
//             name: "ジャケット"
//         },
//         outerCoat: {
//             url: "outerCoat",
//             name: "コート"
//         },
//         outerDownCoat: {
//             url: "outerDownCoat",
//             name: "ダウンコート"
//         },
//     },
//     setup: {
//         url: "setUp",
//         name: "セットアップ"
//     },
//     generalshoes: {
//         generalShoes: {
//             url: "shoesGeneral",
//             name: "シューズ"
//         },
//         pumpShoes: {
//             url: "pumpShoes",
//             name: "パンプス"
//         },
//         flatShoes: {
//             url: "flatShoes",
//             name: "フラットシューズ"
//         },
//         sandalShoes: {
//             url: "sandalShoes",
//             name: "サンダル"
//         },
//         sneakerShoes: {
//             url: "sneakerShoes",
//             name: "スニーカー"
//         },
//         bootShoes: {
//             url: "bootShoes",
//             name: "ブーツ"
//         },
//     },
//     generalinner: {
//         generalInner: {
//             url: "generalInner",
//             name: "下着"
//         },
//         swimwearInner: {
//             url: "swimwearInner",
//             name: "水着・ビキニ"
//         },
//         underwearInner: {
//             url: "underwearInner",
//             name: "ブラジャー＆ショートセット"
//         },
//         indoorWearInner: {
//             url: "indoorWearInner",
//             name: "ルームウェア・パジャマセット"
//         },
//         braInner: {
//             url: "braInner",
//             name: "ブラジャー"
//         },
//         shortsInner: {
//             url: "shortsInner",
//             name: "ショーツ"
//         },
//         accInner: {
//             url: "accInner",
//             name: "グッズ"
//         },
//     },
//     generalgoods: {
//         generalGoods: {
//             url: "generalGoods",
//             name: "小物"
//         },
//         bagGoods: {
//             url: "bagGoods",
//             name: "バッグ"
//         },
//         accessoryGoods: {
//             url: "accessoryGoods",
//             name: "アクセサリー"
//         },
//         hatGoods: {
//             url: "hatGoods",
//             name: "帽子"
//         },
//         socksGoods: {
//             url: "socksGoods",
//             name: "ソックス"
//         },
//         scarfGoods: {
//             url: "scarfGoods",
//             name: "スカーフ"
//         },
//     }
// };

//checkout省的选择，固定的
export const checkOutOptions = [
  { value: '東京都', label: '東京都' },
  { value: '愛知県', label: '愛知県' },
  { value: '秋田県', label: '秋田県' },
  { value: '青森県', label: '青森県' },
  { value: '千葉県', label: '千葉県' },
  { value: '愛媛県', label: '愛媛県' },
  { value: '福井県', label: '福井県' },
  { value: '福岡県', label: '福岡県' },
  { value: '福島県', label: '福島県' },
  { value: '岐阜県', label: '岐阜県' },
  { value: '群馬県', label: '群馬県' },
  { value: '広島県', label: '広島県' },
  { value: '北海道', label: '北海道' },
  { value: '兵庫県', label: '兵庫県' },
  { value: '茨城県', label: '茨城県' },
  { value: '石川県', label: '石川県' },
  { value: '岩手県', label: '岩手県' },
  { value: '香川県', label: '香川県' },
  { value: '鹿児島県', label: '鹿児島県' },
  { value: '神奈川県', label: '神奈川県' },
  { value: '高知県', label: '高知県' },
  { value: '熊本県', label: '熊本県' },
  { value: '京都府', label: '京都府' },
  { value: '三重県', label: '三重県' },
  { value: '宮城県', label: '宮城県' },
  { value: '長野県', label: '長野県' },
  { value: '奈良県', label: '奈良県' },
  { value: '新潟県', label: '新潟県' },
  { value: '大分県', label: '大分県' },
  { value: '岡山県', label: '岡山県' },
  { value: '沖縄県', label: '沖縄県' },
  { value: '大阪府', label: '大阪府' },
  { value: '佐賀県', label: '佐賀県' },
  { value: '埼玉県', label: '埼玉県' },
  { value: '滋賀県', label: '滋賀県' },
  { value: '島根県', label: '島根県' },
  { value: '静岡県', label: '静岡県' },
  { value: '栃木県', label: '栃木県' },
  { value: '徳島県', label: '徳島県' },
  { value: '鳥取県', label: '鳥取県' },
  { value: '富山県', label: '富山県' },
  { value: '和歌山県', label: '和歌山県' },
  { value: '山形県', label: '山形県' },
  { value: '山口県', label: '山口県' },
  { value: '山梨県', label: '山梨県' },
  { value: '宮崎県', label: '宮崎県' },
  { value: '長崎県', label: '長崎県' },
];
