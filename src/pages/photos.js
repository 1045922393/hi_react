import "@/pages/photos.less";
import React, { useState, useEffect } from "react";
import { useGetParams, useGetPage } from "@/utils/params";
import { useSearchParams } from "react-router-dom";

function Pho() {
  const [picList, setPicList] = useState([]);

  const [getSearchParams, setSearchParams] = useSearchParams();
  const p = useGetParams();
  const page = useGetPage();
  useEffect(() => {
    if (p && p.endsWith("1")) {
      setPicList([...window.pPictureConfig.data]);
    }
    if (p && p.endsWith("2")) {
      setPicList([...window.pictureConfig.data]);
    }
  }, []);
  const handlePrePage = () => {
    if (page && Number(page) === 1) return;
  };

  const handleNextPage = () => {
    if (page)
      setSearchParams({
        page: Number(page) + 1,
        p: p || "",
      });
  };

  return (
    <div className="page_photo">
      {(() => {
        if (page && p)
          return (
            <div>
              第{page}/{Math.ceil(picList.length / 10)}页;该页有
              {picList.filter((item, index) => {
                return index >= (page - 1) * 10 && index < page * 10;
              }).length || 0}
              张
            </div>
          );
      })()}
      <div className="img_box">
        <img
          className="btn"
          src="https://api.isoyu.com/mm_images.php"
          alt=""
          onClick={handlePrePage}
        />
        <img
          className="btn"
          src="http://api.btstu.cn/sjbz/?lx=m_meizi"
          alt=""
        />
        <img
          className="btn"
          src="https://cdn.seovx.com/?mom=302"
          alt=""
          onClick={handleNextPage}
        />
      </div>
      {picList
        .filter((item, index) => {
          return index >= (page - 1) * 10 && index < page * 10;
        })
        .map((item) => {
          return (
            <div key={item.path}>
              <img src={item.path} alt={item.path} />
            </div>
          );
        })}
    </div>
  );
}

export default Pho;
