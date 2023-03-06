const fs = require("fs");
const path = require("path");
const { pictureConfig } = require("./config/imgsConfig");

const header = `window.pictureConfig = {
  data: [
    `;

const footer = `
  ],
};`;

function writeUpdateFile(file, content) {
  fs.writeFileSync(file, content);
}

function run() {
  let pathList = pictureConfig.data.map((item) => {
    return item.path;
  });
  pathList = Array.from(new Set(pathList));
  let content = header;
  pathList.forEach((item) => {
    content += `{path: "${item}"},
    `;
  });
  content += footer;
  writeUpdateFile(path.resolve(__dirname, "../public/config/imgConfig.js"), content);
}

run();
