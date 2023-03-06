const fs = require("fs");
const path = require("path");
const { pictureConfig } = require("./config/imgsConfig");
const { pPictureConfig } = require("./config/pimgsConfig");

function writeUpdateFile(file, content) {
  fs.writeFileSync(file, content);
}
// not safe for work true 001
function run(isNsfw = false) {
  const header = `window.${isNsfw ? "pP" : "p"}ictureConfig = {
  data: [
    `;

  const footer = `
  ],
};`;
  let pathList = (isNsfw ? pPictureConfig : pictureConfig).data.map((item) => {
    return item.path;
  });
  pathList = Array.from(new Set(pathList));
  let content = header;
  pathList.forEach((item) => {
    content += `{path: "${item}"},
    `;
  });
  content += footer;
  writeUpdateFile(
    path.resolve(__dirname, `../public/config/${isNsfw ? "p" : ""}imgs.js`),
    content,
  );
}

run();
run(true);
