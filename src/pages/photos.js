import "@/pages/photos.less";
import React, { useState, useEffect, useMemo } from "react";
import { useGetParams, useGetPage } from "@/utils/params";
import { useSearchParams } from "react-router-dom";
import { validatePurity } from "@/utils/validate";
import { Link, useNavigate } from "react-router-dom";

function Pho() {
  const navigate = useNavigate();
  const [showImg, setShowImg] = useState(0);

  const [picList, setPicList] = useState([]);

  // 计算属性
  const maxPage = useMemo(() => {
    return Math.ceil(picList.length / 10);
  }, [picList]);

  const page = useGetPage();

  const curNum = useMemo(() => {
    return (
      picList.filter((item, index) => {
        return index >= (page - 1) * 10 && index < page * 10;
      }).length || 0
    );
  }, [picList, page]);

  const startNum = useMemo(() => {
    return (page - 1) * 10 + 1;
  }, [page]);

  const endNum = useMemo(() => {
    return Math.min(page * 10, picList.length);
  }, [picList, page]);

  const [getSearchParams, setSearchParams] = useSearchParams();
  const p = useGetParams();
  useEffect(() => {
    if (validatePurity(p) && p.endsWith("1")) {
      setPicList([...window.pPictureConfig.data]);
      setShowImg(6);
    }
    if (validatePurity(p) && p.startsWith("1")) {
      setPicList([...window.pictureConfig.data]);
      setShowImg(6);
    }
  }, [showImg]);

  const handlePrePage = () => {
    console.log("handlePrePage");
    if (!page || Number(page) === 1) return;
    setSearchParams({
      page: Number(page) - 1,
      p: p || "",
    });
  };

  const handleNextPage = () => {
    console.log("handleNextPage");
    if (!page || page >= maxPage) return;
    setSearchParams({
      page: Number(page) + 1,
      p: p || "",
    });
  };

  const handleOpenImg = () => {
    console.log("handleOpenImg");
    if (showImg > 5) return;

    if (showImg === 5) {
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
    bg.style.backgroundSize = `10%`;
    setTimeout(() => {
      bg.style.backgroundImage = `url("${urlPath}")`;
      bg.style.backgroundSize = `100%`;
    }, 500);
  };

  const handleBackHome = () => {
    console.log("?");
    navigate("/");
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
      <div className="back_btn" onClick={handleBackHome}>
        B
      </div>
      <div className="img_box">
        <div
          className="img_contain"
          onDoubleClick={handlePrePage}
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
          onDoubleClick={handleOpenImg}
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
      <div className="imgList">
        {picList
          .filter((item, index) => {
            return index >= (page - 1) * 10 && index < page * 10;
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
