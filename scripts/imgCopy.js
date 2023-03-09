const fs = require("fs");
const path = require("path");
const { pictureConfig } = require("./config/imgsConfig");
const { pPictureConfig } = require("./config/pimgsConfig");
const { pictureConfig: lxyPicture } = require("./config/imgsConfig.lxy.js");

function writeUpdateFile(file, content) {
  fs.writeFileSync(file, content);
}

const isForLxy = process.env.BUILD_PATH === "lxy";

function shuffle(arr, start = 3) {
  let len = arr.length;
  for (let i = 3; i < len - start; i++) {
    let index = parseInt(Math.random() * (len - start - i) + start);
    let temp = arr[index];
    arr[index] = arr[len - i - 1];
    arr[len - i - 1] = temp;
  }
  return arr;
}

const files = (isNsfw) => {
  // 如果是给xy的 则拿imgsConfig.lxy.js》public/config下的两个img.js
  if (isForLxy) {
    return [
      {
        header: `window.${isNsfw ? "pP" : "p"}ictureConfig = {
          data: [
        `,
        footer: `],
    };`,
        path: path.resolve(
          __dirname,
          `../public/config/${isNsfw ? "p" : ""}imgs.js`,
        ),
      },
    ];
  }
  return [
    // 重写public>config
    {
      header: `window.${isNsfw ? "pP" : "p"}ictureConfig = {
      data: [
    `,
      footer: `],
};`,
      path: path.resolve(
        __dirname,
        `../public/config/${isNsfw ? "p" : ""}imgs.js`,
      ),
    },
    // 重写scripts>config
    {
      header: `const ${isNsfw ? "pP" : "p"}ictureConfig = {
      data: [
    `,
      footer: `],
};

module.exports = {
  ${isNsfw ? "pP" : "p"}ictureConfig,
};
`,
      path: path.resolve(
        __dirname,
        `./config/${isNsfw ? "pimgsconfig" : "imgsConfig"}.js`,
      ),
    },
  ];
};

// not safe for work true 001
function run(isNsfw = false) {
  files(isNsfw).forEach((fileItem, index) => {
    let pathList = (
      isForLxy ? lxyPicture : isNsfw ? pPictureConfig : pictureConfig
    ).data.map((item) => {
      return item.path;
    });
    pathList = Array.from(new Set(pathList));
    // 只对public>config乱序
    if (index === 0) {
      // 如果是for xy 则全部打乱
      // 否则从第三张开始打乱
      pathList = shuffle(pathList, isForLxy ? 0 : 3);
    }
    let content = fileItem.header;
    pathList.forEach((item) => {
      content += `{ path: "${item}" },
    `;
    });
    content += fileItem.footer;
    writeUpdateFile(fileItem.path, content);
  });
}

run();
run(true);
