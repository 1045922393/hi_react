const axios = require("axios");
const fs = require("fs"); //引入文件读取模块
const path = require("path");

const validate = (reg = new RegExp(/^[01]{3}$/));

// script options
const purityOption = process.env.npm_config_pur;
const categoriesOption = process.env.npm_config_cate;

let time = 0;
function random(maxNum) {
  return (Math.random() * (maxNum + 1)) | 0;
}
const apiEnums = {
  purity: {
    0: "100", //"正常"
    1: "010", //"开放"
    2: "001", // "贤者" 需要apiKey
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
const defaultVal = {
  purity: apiEnums.purity[random(2)],
  categories: apiEnums.categories[random(2)],
  sorting: apiEnums.sorting[random(4)],
  atleast: apiEnums.atleast[random(2)],
};

const getPic = async (
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
    "https://wallhaven.cc" +
    `/api/v1/search?apikey=cbSjyOZcDBn5jitF2AwLg8vnueiPa9zo&purity=${purity}&categories=${categories}&sorting=${sorting}&atleast=${atleast}`;
  console.log("Debugger ~ file: downloadImg.js:54 ~ api:", api);
  const res = await axios.get(api);
  console.log(`>>>>>>getPic|${api}| request times is>>>>>`, ++time);
  return res.data.data;
};

const download = async () => {
  const purity =
    purityOption && validate.test(purityOption)
      ? purityOption
      : defaultVal.purity;
  const categories =
    purityOption && validate.test(categoriesOption)
      ? categoriesOption
      : defaultVal.categories;

  getPic(purity, { categories })
    .then((res) => {
      console.log("getPic finfish");
      res.forEach((imgInfo, index) => {
        axios({ url: imgInfo.path, responseType: "arraybuffer" })
          .then(({ data }) => {
            console.log("开始下载", index);
            fs.writeFileSync(
              path.join(__dirname, `../downloads/${imgInfo.id}.jpg`),
              data,
              "binary",
            );
          })
          .catch((err) => {
            console.log("下载失败", index, ",地址:", imgInfo.path);
          });
      });
    })
    .catch((err) => {
      console.log("获取pic链接错误", err);
    });
};
download();
