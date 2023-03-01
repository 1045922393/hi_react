import axios from "axios";

let time = 0;
function random(maxNum){
  return Math.random() * (maxNum + 1)  | 0;
}

export const apiEnums = {
  purity: {
    0: "100", //"正常"
    1: "010", //"开放"
    2: "001", // "贤者" 似乎已废弃
  },
  categories: {
    0: 100, // "普通"
    1: "010", // "动漫"
    2: "001", //"人物"
  },
  sorting: {
    0: "date-added", // "新增"
    1: "random", // "随机"
    2: "views", // "浏览"
    3: "favorites", // "收藏"
    4: "toplist", // "置顶"
  },
  atleast: {
    0: "1920x1080",
    1: "2560x1440",
    2: "3840x2160",
  },
};
const isDev = process.env.NODE_ENV === "development"; // development|production
const baseUrl = isDev ? "/wallhaven" : "https://wallhaven.cc";

const defaultVal = {
  purity: apiEnums.purity[random(1)],
  categories: apiEnums.categories[random(2)],
  sorting: apiEnums.sorting[random(4)],
  atleast: apiEnums.atleast[random(2)],
}

export const getPic = async (
  purity = defaultVal.purity,
  options = {
    categories: defaultVal.categories,
    sorting: defaultVal.sorting,
    atleast: defaultVal.atleast,
  },
) => {
  // 默认值
  const {
    categories = defaultVal.categories,
    sorting = defaultVal.sorting,
    atleast = defaultVal.atleast,
  } = options;
  let api =
    baseUrl +
    `/api/v1/search?purity=${purity}&categories=${categories}&sorting=${sorting}&atleast=${atleast}`;
  const res = await axios.get(api);
  console.log(`>>>>>>getPic|${api}| request times is>>>>>`, ++time);
  return res.data.data;
};
