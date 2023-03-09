import { useState, useEffect } from "react";
import "./index.less";
import BackBtn from "@/components/back";
import { Link, useNavigate } from "react-router-dom";

function Message() {
  const poemList = [
    `在我贫瘠的土地上，
    你是最后的玫瑰`,
    `遇见你，
    我好幸运`,
    `一起骑马踏春，
    看冰雪初融`,
    `要好好吃饭，
    好好睡觉，
    好好生活`,
    `希望这相册，
    能让你开心，
    mua~~`,
    `应许红衣共白发，
    满天轻羽织头纱`,
    `要热爱生活，
    不能被这无趣的生活，
    吞没`,
    `往后的日子，
    还要携手同行噢`,
  ];
  const [poem, setPoem] = useState([]);
  useEffect(() => {
    setPoem(
      poemList[((Math.random() * 10000) | 0) % poemList.length].split(`，`),
    );
  }, []);
  return (
    <div className="message_page">
      <BackBtn style={{ color: "black" }}></BackBtn>
      <div className="typing">
        {poem.map((item) => {
          return (
            <div key={item} className="typing-effect">
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Message;
