const fs = require("fs");
const path = require("path");
const { pictureConfig } = require("./config/imgsConfig");
const { pPictureConfig } = require("./config/pimgsConfig");

function writeUpdateFile(file, content) {
  fs.writeFileSync(file, content);
}

const files = (isNsfw)=> [
  // public>config
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
  // scripts>config
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

// not safe for work true 001
function run(isNsfw = false) {
  files(isNsfw).forEach((fileItem) => {
    let pathList = (isNsfw ? pPictureConfig : pictureConfig).data.map(
      (item) => {
        return item.path;
      },
    );
    pathList = Array.from(new Set(pathList));
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
