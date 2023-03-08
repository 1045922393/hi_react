import "@/pages/photos.less";
import React, { useState, useEffect, useMemo } from "react";
import { useGetParams, useGetPage } from "@/utils/params";
import { useSearchParams } from "react-router-dom";
import { validatePurity } from "@/utils/validate";
import BackBtn from "@/components/back";

function Pho() {
  const perPage = 5;
  const [showImg, setShowImg] = useState(0);

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
  const p = useGetParams();
  useEffect(() => {
    if (validatePurity(p) && p.endsWith("1")) {
      setPicList([...window.pPictureConfig.data]);
      setShowImg(6);
      setSwitcher(true);
    }
    if (validatePurity(p) && p.startsWith("1")) {
      setPicList([...window.pictureConfig.data]);
      setShowImg(6);
      setSwitcher(true);
    }
  }, [showImg]);

  function handleSwitcher(fn) {
    setSwitcher(false);
    setTimeout(() => {
      fn();
      setTimeout(() => {
        setSwitcher(true);
      }, 2000);
    }, 1000);
  }

  const handlePrePage = () => {
    // console.log("handlePrePage");
    if (!page || Number(page) === 1) return;
    handleSwitcher(()=>{
      setSearchParams({
        page: Number(page) - 1,
        p: p || "",
      });
    });
  };

  const handleNextPage = () => {
    // console.log("handleNextPage");
    if (!page || page >= maxPage) return;
    handleSwitcher(()=>{
      setSearchParams({
        page: Number(page) + 1,
        p: p || "",
      });
    });
  };

  const handleOpenImg = () => {
    // console.log("handleOpenImg");
    if (showImg > 5) return setSwitcher(true);

    if (showImg === 5) {
      setSwitcher(true);
      setSearchParams({
        page: 1,
        p: "100",
      });
    }
    setShowImg(showImg + 1);
  };

  const handleChangeBg = (urlPath) => {
    const bg = document.querySelector(".page_photo .bg");

    if (bg.style.backgroundImage === `url("${urlPath}")`) return;
    // bg.style.backgroundSize = `10%`;
    setTimeout(() => {
      bg.style.backgroundImage = `url("${urlPath}")`;
      // bg.style.backgroundSize = `100%`;
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
          onDoubleClick={handleOpenImg}
          onClick={handleChangeBg.bind(
            this,
            "https://api.isoyu.com/mm_images.php",
          )}
        >
          <img
            className="btn"
            src="https://api.isoyu.com/mm_images.php"
            alt=""
          />
        </div>
        <div
          className="img_contain"
          onDoubleClick={handlePrePage}
          onClick={handleChangeBg.bind(
            this,
            "http://api.btstu.cn/sjbz/?lx=m_meizi",
          )}
        >
          <img
            className="btn"
            src="http://api.btstu.cn/sjbz/?lx=m_meizi"
            alt=""
          />
        </div>
        <div
          className="img_contain"
          onDoubleClick={handleNextPage}
          onClick={handleChangeBg.bind(this, "https://cdn.seovx.com/?mom=302")}
        >
          <img className="btn" src="https://cdn.seovx.com/?mom=302" alt="" />
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
