// script options
const pageName = process.env.npm_config_name;
const fs = require("fs"); // 引入文件系统模块
const path = require("path");
const dir = path.join(__dirname, "..");

if (!pageName) {
  throw new Error("请输入name");
}

const UPageName = pageName.slice(0, 1).toUpperCase() + pageName.slice(1);

const jsContent = `
import { useState, useEffect } from "react";
import "./index.less";
import BackBtn from "@/components/back";
import { Link, useNavigate } from "react-router-dom";

function ${UPageName}(){
  return (
    <div className="${pageName}_page">
      <BackBtn></BackBtn>
    </div>
  )
}

export default ${UPageName};
`;

const lessContent = `
.${pageName}_page{

}
`


function writeUpdateFile(file, content) {
  if (!fs.existsSync(path.join(file, ".."))) {
    fs.mkdirSync(path.join(file, ".."));
  }
  fs.writeFileSync(file, content);
}

writeUpdateFile(path.join(dir, "src/pages/", pageName, "index.js"), jsContent);
writeUpdateFile(path.join(dir, "src/pages/", pageName, "index.less"), lessContent);
