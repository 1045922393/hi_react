import axios from "axios";

let time = 0;

const apiVal = {
  categories: {
    100: "普通",
    "010": "动漫",
    "001": "人物",
  },
  purity: {
    100: "正常",
    "010": "开放",
    "001": "贤者",
  },
  sorting: {
    "date-added": "新增",
    random: "随机",
    views: "浏览",
    favorites: "收藏",
    toplist: "置顶",
  },
  atleast: {
    "1080p": "1920x1080",
    "2k": "2560x1440",
    "4k": "3840x2160",
  },
};
const isDev = process.env.NODE_ENV === "development"; // development|production
const baseUrl = isDev ? "/wallhaven" : "https://wallhaven.cc";
export const getPic = async (
  purity = "010",
  options = {
    categories: "100",
    sorting: "random",
    atleast: apiVal.atleast["4k"],
  },
) => {
  // 默认值
  const {
    categories = "100",
    sorting = "random",
    atleast = apiVal.atleast["4k"],
  } = options;
  let api =
    baseUrl +
    `/api/v1/search?purity=${purity}&categories=${categories}&sorting=${sorting}&atleast=${atleast}`;
  const res = await axios.get(api);
  console.log(`>>>>>>getPic|${api}| request times is>>>>>`, ++time);
  return res.data.data;
};
