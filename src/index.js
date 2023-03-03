import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter,Routes,Route } from "react-router-dom";

// import Picture from "@/pages/picture";
// import Pho from "@/pages/photos";
// import Content from '@/pages/content/index';
// 优化
const Picture = React.lazy(()=>import("@/pages/picture"));
const Pho = React.lazy(()=>import("@/pages/photos"));
const Content = React.lazy(()=>import("@/pages/content/index"));

 const config = {
  homepage: "/picture",
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path={config.homepage + "/"} element={<Content />}></Route>
      <Route path={config.homepage + "/photo"} element={<Pho />}></Route>
      <Route path={config.homepage + "/picture"} element={<Picture />}></Route>
      <Route path={config.homepage + "/*"} element={<Picture />}></Route>
    </Routes>
  </BrowserRouter>,
);

export {config}