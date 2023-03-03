import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Picture from "@/pages/picture";
// import Pho from "@/pages/photos";
// import Content from "@/pages/content/index";
// 优化
const Picture = React.lazy(() => import("@/pages/picture"));
const Pho = React.lazy(() => import("@/pages/photos"));
const Content = React.lazy(() => import("@/pages/content/index"));
const PhotoWall = React.lazy(()=> import("@/pages/photoWall/index"));

const config = {
  homepage: "/picture",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path={config.homepage + "/"} element={<Content />}></Route>
        <Route path={config.homepage + "/photo"} element={<Pho />}></Route>
        <Route
          path={config.homepage + "/picture"}
          element={<Picture />}
        ></Route>
        <Route path={config.homepage + "/photoWall"} element={<PhotoWall></PhotoWall>}></Route>
        <Route path={config.homepage + "/*"} element={<Picture />}></Route>
      </Routes>
    </Suspense>
  </BrowserRouter>,
);

export { config };
