import "@/pages/photos.less";
import React, { useState, useEffect, useMemo } from "react";
import { useGetParams, useGetPage } from "@/utils/params";
import { useSearchParams } from "react-router-dom";
import { validatePurity } from "@/utils/validate";
import BackBtn from "@/components/back";

function Pho() {
  const perPage = 5;

  const [picList, setPicList] = useState([]);

  const [switcher, setSwitcher] = useState(false);

  // 计算属性
  const maxPage = useMemo(() => {
    return Math.ceil(picList.length / perPage);
  }, [picList]);

  const page = useGetPage();

  const curNum = useMemo(() => {
    return (
      picList.filter((item, index) => {
        return index >= (page - 1) * perPage && index < page * perPage;
      }).length || 0
    );
  }, [picList, page]);

  const startNum = useMemo(() => {
    return (page - 1) * perPage + 1;
  }, [page]);

  const endNum = useMemo(() => {
    return Math.min(page * perPage, picList.length);
  }, [picList, page]);

  const [getSearchParams, setSearchParams] = useSearchParams();
  function initMounted() {
    if (validatePurity(p) && p.endsWith("1") && page) {
      setPicList([...window.pPictureConfig.data]);
      setSwitcher(true);
      return;
    }
    if(!p || !page) {
      handleOpenImg();
    }
    setPicList([...window.pictureConfig.data]);
  }
  const p = useGetParams();

  useEffect(() => {
    initMounted();
  }, []);

  useEffect(() => {
    handleChangeBg(picList[0]?.path);
  }, [picList]);

  function handleSwitcher(fn) {
    setSwitcher(false);
    setTimeout(() => {
      fn();
      setTimeout(() => {
        setSwitcher(true);
      }, 2000);
    }, 500);
  }

  const handlePrePage = () => {
    // console.log("handlePrePage");
    if (!page || Number(page) === 1) return;
    handleSwitcher(() => {
      setSearchParams({
        page: Number(page) - 1,
        p: p || "",
      });
    });
  };

  const handleNextPage = () => {
    // console.log("handleNextPage");
    if (!page || page >= maxPage) return;
    handleSwitcher(() => {
      setSearchParams({
        page: Number(page) + 1,
        p: p || "",
      });
    });
  };

  const handleOpenImg = () => {
    handleSwitcher(()=>{
    setSearchParams({
      page: 1,
      p: "100",
    });
  })
};

  const handleChangeBg = (urlPath) => {
    const bg = document.querySelector(".page_photo .bg");

    if (bg.style.backgroundImage === `url("${urlPath}")`) return;
    setTimeout(() => {
      bg.style.backgroundImage = `url("${urlPath}")`;
    }, 500);
  };

  return (
    <div className="page_photo">
      {(() => {
        if (page && p)
          return (
            <div className="pagation">
              C{page}/P{maxPage}|S{startNum}-E{endNum}|N{curNum}-T
              {picList.length}
            </div>
          );
      })()}
      <BackBtn></BackBtn>
      <div className="img_box">
        <div
          className="img_contain"
          onClick={handlePrePage}
          onDoubleClick={handleChangeBg.bind(this, picList[1]?.path)}
        >
          <img className="btn" src={picList[1]?.path} alt="" />
        </div>
        <div
          className="img_contain"
          onClick={handleNextPage}
          onDoubleClick={handleChangeBg.bind(this, picList[0]?.path)}
        >
          <img className="btn" src={picList[0]?.path} alt="" />
        </div>
      </div>
      <div className="bg"></div>
      <div className={switcher ? "imgList" : "imgList hidden"}>
        {picList
          .filter((item, index) => {
            return index >= (page - 1) * perPage && index < page * perPage;
          })
          .map((item) => {
            return (
              <div className="list_contain" key={item.path}>
                <img
                  onClick={handleChangeBg.bind(this, item.path)}
                  className="list_item"
                  src={item.path}
                  alt={item.path}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Pho;
