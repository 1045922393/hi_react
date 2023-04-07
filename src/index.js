import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RoutesComp from "./routes/index";

const config = {
  homepage: "",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RoutesComp></RoutesComp>
);

export { config };
