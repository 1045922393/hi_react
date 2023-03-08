import { useState, useEffect, useMemo } from "react";
import "./index.less";
import BackBtn from "@/components/back";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetParams } from "@/utils/params";

function AlbumWall() {
  const [picList, setPicList] = useState([]);
  let timeId = null;
  const p = useGetParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const autoPlay = searchParams.get('auto');
  const winPic =
    window[p && p === "001" ? "pPictureConfig" : "pictureConfig"].data;
  useEffect(() => {
    setPicList(winPic);
    timeId = setInterval(() => {
      console.log("time");
      setPicList(winPic.map((item) => item));
    }, 1000 * 64);
    var oImg = document.getElementsByClassName("f1");
    var oImg2 = document.getElementsByClassName("f2");
    var oImg3 = document.getElementsByClassName("f3");
    var len = oImg.length;
    // console.log(len);
    var deg = 360 / len;

    var oWrap = document.getElementById("imgwrap");

    //页面加载完毕在执行的代码
    Array.prototype.forEach.call(oImg, function (ele, index, self) {
      // 旋转并沿Z轴平移
      ele.style.transform =
        "rotateY(" + deg * index + "deg) translateZ(645.75px)";
      //过渡时间1s
      ele.style.transition = "1s " + (len - index) * 0.1 + "s";
    });
    Array.prototype.forEach.call(oImg2, function (ele, index, self) {
      // 旋转并沿Z轴平移
      ele.style.transform =
        "rotateY(" +
        deg * index +
        "deg) translateZ(645.75px) translateY(240px)";
      //过渡时间1s
      ele.style.transition = "1s " + (len - index) * 0.1 + "s";
    });
    Array.prototype.forEach.call(oImg3, function (ele, index, self) {
      // 旋转并沿Z轴平移
      ele.style.transform =
        "rotateY(" +
        deg * index +
        "deg) translateZ(645.75px) translateY(480px)";
      //过渡时间1s
      ele.style.transition = "1s " + (len - index) * 0.1 + "s";
    });
    function listenMouse() {
      //翻动3D相册
      var newX,
        newY,
        lastX,
        lastY,
        minusX,
        minusY,
        rotX = -20,
        rotY = 0;

      document.onmousedown = function (e) {
        // 点击设置初值
        lastX = e.clientX;
        lastY = e.clientY;

        this.onmousemove = function (e) {
          newX = e.clientX;
          newY = e.clientY;
          minusX = newX - lastX;
          minusY = newY - lastY;

          rotX -= minusY * 0.2;
          rotY += minusX * 0.1;
          oWrap.style.transform =
            "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
          lastX = newX;
          lastY = newY;
        };
        this.onmouseup = function (e) {
          //鼠标松开
          this.onmousemove = null; //清除鼠标移动
        };
      };
    }
    function autoMove(){
      oWrap.style.animation = "run 20s infinite linear";
    }
    const fn = autoPlay ? autoMove :listenMouse;
    fn();
    return () => {
      clearInterval(timeId);
      timeId = null;
    };
  }, [picList]);

  const showPicList = useMemo(() => {
    return new Array(11)
      .fill("")
      .map((item) => ((Math.random() * 100000) | 0) % picList.length);
  }, [picList]);

  const handleChangeBg = (e) => {
    document.querySelector(
      ".albumWall_page",
    ).style.backgroundImage = `url("${e.target.currentSrc}")`;
    // console.log("Debugger ~ file: index.js:90 ~ handleChangeBg ~ e:", e.target.currentSrc)
  };
  return (
    <div className="albumWall_page">
      <BackBtn></BackBtn>
      <div className="perspective">
        <div className="wrap" id="imgwrap">
          {picList
            .filter((item, index) => index < 11)
            .map((item, index) => {
              return (
                <img
                  onClick={handleChangeBg}
                  className="f1"
                  key={index}
                  src={picList[showPicList[index % showPicList.length]].path}
                />
              );
            })}

          {picList
            .filter((item, index) => index >= 11 && index < 22)
            .map((item, index) => {
              return (
                <img
                  onClick={handleChangeBg}
                  className="f2"
                  key={index}
                  src={
                    picList[showPicList[(index + 4) % showPicList.length]].path
                  }
                />
              );
            })}
          {picList
            .filter((item, index) => index >= 22 && index < 33)
            .map((item, index) => {
              return (
                <img
                  onClick={handleChangeBg}
                  className="f3"
                  key={index}
                  src={
                    picList[showPicList[(index + 8) % showPicList.length]].path
                  }
                />
              );
            })}
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default AlbumWall;
