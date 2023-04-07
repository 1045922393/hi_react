import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { config } from "@/index";

// import Picture from "@/pages/picture";
// import Pho from "@/pages/photos";
// import Content from "@/pages/content/index";
// 优化
const Picture = React.lazy(() => import("@/pages/picture"));
const Pho = React.lazy(() => import("@/pages/photos"));
const Content = React.lazy(() => import("@/pages/content/index"));
const PhotoWall = React.lazy(() => import("@/pages/photoWall/index"));
const AlbumWall = React.lazy(() => import("@/pages/albumWall/index"));
const Album3D = React.lazy(() => import("@/pages/album3d/index"));
const Message = React.lazy(() => import("@/pages/message/index"));
const OpenAi = React.lazy(() => import("@/pages/openAi/index"));
const ReactDemo = React.lazy(() => import("@/pages/reactDemo/index"));
const Chess = React.lazy(()=>import("@/pages/chess/index"));

function RoutesComp() {
  return (
    <HashRouter>
      {/* 实现懒加载需要Suspense:fallback */}
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route path={config.homepage + "/"} element={<Content />}></Route>
          <Route path={config.homepage + "/photo"} element={<Pho />}></Route>
          <Route
            path={config.homepage + "/picture"}
            element={<Picture />}
          ></Route>
          <Route
            path={config.homepage + "/photoWall"}
            element={<PhotoWall></PhotoWall>}
          ></Route>
          <Route
            path={config.homepage + "/albumWall"}
            element={<AlbumWall />}
          ></Route>
          <Route
            path={config.homepage + "/album3d"}
            element={<Album3D />}
          ></Route>
          <Route
            path={config.homepage + "/message"}
            element={<Message />}
          ></Route>
          <Route
            path={config.homepage + "/openai"}
            element={<OpenAi />}
          ></Route>
          <Route
            path={config.homepage + "/react-demo"}
            element={<ReactDemo></ReactDemo>}
          ></Route>
          <Route
            path={config.homepage + "/chess"}
            element={<Chess></Chess>}
          ></Route>
          <Route path={config.homepage + "/*"} element={<Picture />}></Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default RoutesComp;
