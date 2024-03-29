// 目录
import { Link, useNavigate } from "react-router-dom";
import { config } from "@/index";
import { useState, useEffect } from "react";
import "./index.less";
import BackBtn from "@/components/back";
function Content() {
  const isForXy = process.env.PUBLIC_URL !== "/picture";
  const navigate = useNavigate();

  const [picList, setPicList] = useState([]);
  const [totalDay, setTotalDay] = useState(0);

  const { gsap, imagesLoaded } = window;
  useEffect(() => {
    setPicList(window.pictureConfig.data);
    const bodyDoc = document.querySelector("body");
    bodyDoc.classList.add("body_extend");
    const buttons = {
      prev: document.querySelector(".btn--left"),
      next: document.querySelector(".btn--right"),
    };
    const cardsContainerEl = document.querySelector(".cards__wrapper");
    const appBgContainerEl = document.querySelector(".app__bg");

    const cardInfosContainerEl = document.querySelector(".info__wrapper");

    buttons.next.addEventListener("click", () => swapCards("right"));

    buttons.prev.addEventListener("click", () => swapCards("left"));

    function swapCards(direction) {
      const currentCardEl = cardsContainerEl.querySelector(".current--card");
      const previousCardEl = cardsContainerEl.querySelector(".previous--card");
      const nextCardEl = cardsContainerEl.querySelector(".next--card");

      const currentBgImageEl =
        appBgContainerEl.querySelector(".current--image");
      const previousBgImageEl =
        appBgContainerEl.querySelector(".previous--image");
      const nextBgImageEl = appBgContainerEl.querySelector(".next--image");

      changeInfo(direction);
      swapCardsClass();

      removeCardEvents(currentCardEl);

      function swapCardsClass() {
        currentCardEl.classList.remove("current--card");
        previousCardEl.classList.remove("previous--card");
        nextCardEl.classList.remove("next--card");

        currentBgImageEl.classList.remove("current--image");
        previousBgImageEl.classList.remove("previous--image");
        nextBgImageEl.classList.remove("next--image");

        currentCardEl.style.zIndex = "50";
        currentBgImageEl.style.zIndex = "-2";

        if (direction === "right") {
          previousCardEl.style.zIndex = "20";
          nextCardEl.style.zIndex = "30";

          nextBgImageEl.style.zIndex = "-1";

          currentCardEl.classList.add("previous--card");
          previousCardEl.classList.add("next--card");
          nextCardEl.classList.add("current--card");

          currentBgImageEl.classList.add("previous--image");
          previousBgImageEl.classList.add("next--image");
          nextBgImageEl.classList.add("current--image");
        } else if (direction === "left") {
          previousCardEl.style.zIndex = "30";
          nextCardEl.style.zIndex = "20";

          previousBgImageEl.style.zIndex = "-1";

          currentCardEl.classList.add("next--card");
          previousCardEl.classList.add("current--card");
          nextCardEl.classList.add("previous--card");

          currentBgImageEl.classList.add("next--image");
          previousBgImageEl.classList.add("current--image");
          nextBgImageEl.classList.add("previous--image");
        }
      }
    }

    function changeInfo(direction) {
      let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
      let previousInfoEl =
        cardInfosContainerEl.querySelector(".previous--info");
      let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");

      gsap
        .timeline()
        .to([buttons.prev, buttons.next], {
          duration: 0.2,
          opacity: 0.5,
          pointerEvents: "none",
        })
        .to(
          currentInfoEl.querySelectorAll(".text"),
          {
            duration: 0.4,
            stagger: 0.1,
            translateY: "-120px",
            opacity: 0,
          },
          "-=",
        )
        .call(() => {
          swapInfosClass(direction);
        })
        .call(() => initCardEvents())
        .fromTo(
          direction === "right"
            ? nextInfoEl.querySelectorAll(".text")
            : previousInfoEl.querySelectorAll(".text"),
          {
            opacity: 0,
            translateY: "40px",
          },
          {
            duration: 0.4,
            stagger: 0.1,
            translateY: "0px",
            opacity: 1,
          },
        )
        .to([buttons.prev, buttons.next], {
          duration: 0.2,
          opacity: 1,
          pointerEvents: "all",
        });

      function swapInfosClass() {
        currentInfoEl.classList.remove("current--info");
        previousInfoEl.classList.remove("previous--info");
        nextInfoEl.classList.remove("next--info");

        if (direction === "right") {
          currentInfoEl.classList.add("previous--info");
          nextInfoEl.classList.add("current--info");
          previousInfoEl.classList.add("next--info");
        } else if (direction === "left") {
          currentInfoEl.classList.add("next--info");
          nextInfoEl.classList.add("previous--info");
          previousInfoEl.classList.add("current--info");
        }
      }
    }

    function updateCard(e) {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const centerPosition = {
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
      };
      let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
      gsap.set(card, {
        "--current-card-rotation-offset": `${angle}deg`,
      });
      const currentInfoEl =
        cardInfosContainerEl.querySelector(".current--info");
      gsap.set(currentInfoEl, {
        rotateY: `${angle}deg`,
      });
    }

    function resetCardTransforms(e) {
      const card = e.currentTarget;
      const currentInfoEl =
        cardInfosContainerEl.querySelector(".current--info");
      gsap.set(card, {
        "--current-card-rotation-offset": 0,
      });
      gsap.set(currentInfoEl, {
        rotateY: 0,
      });
    }

    function initCardEvents() {
      const currentCardEl = cardsContainerEl.querySelector(".current--card");
      currentCardEl.addEventListener("pointermove", updateCard);
      currentCardEl.addEventListener("pointerout", (e) => {
        resetCardTransforms(e);
      });
    }

    initCardEvents();

    function removeCardEvents(card) {
      card.removeEventListener("pointermove", updateCard);
    }

    function init() {
      let tl = gsap.timeline();

      tl.to(cardsContainerEl.children, {
        delay: 0.15,
        duration: 0.5,
        stagger: {
          ease: "power4.inOut",
          from: "right",
          amount: 0.1,
        },
        "--card-translateY-offset": "0%",
      })
        .to(
          cardInfosContainerEl
            .querySelector(".current--info")
            .querySelectorAll(".text"),
          {
            delay: 0.5,
            duration: 0.4,
            stagger: 0.1,
            opacity: 1,
            translateY: 0,
          },
        )
        .to(
          [buttons.prev, buttons.next],
          {
            duration: 0.4,
            opacity: 1,
            pointerEvents: "all",
          },
          "-=0.4",
        );
    }

    const waitForImages = () => {
      const images = [...document.querySelectorAll("img")];
      const totalImages = images.length;
      let loadedImages = 0;
      const loaderEl = document.querySelector(".loader span");

      gsap.set(cardsContainerEl.children, {
        "--card-translateY-offset": "100vh",
      });
      gsap.set(
        cardInfosContainerEl
          .querySelector(".current--info")
          .querySelectorAll(".text"),
        {
          translateY: "40px",
          opacity: 0,
        },
      );
      gsap.set([buttons.prev, buttons.next], {
        pointerEvents: "none",
        opacity: "0",
      });

      images.forEach((image) => {
        imagesLoaded(image, (instance) => {
          if (instance.isComplete) {
            loadedImages++;
            let loadProgress = loadedImages / totalImages;

            gsap.to(loaderEl, {
              duration: 1,
              scaleX: loadProgress,
              backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
            });

            if (totalImages == loadedImages) {
              gsap
                .timeline()
                .to(".loading__wrapper", {
                  duration: 0.8,
                  opacity: 0,
                  pointerEvents: "none",
                })
                .call(() => init());
            }
          }
        });
      });
    };

    waitForImages();

    return () => {
      console.log("Content Component is going");
      bodyDoc.classList.remove("body_extend");
    };
  });

  useEffect(() => {
    // const start_date = new Date("2022-05-14 00:00:00");
    const start_date = new Date("2023-03-27 00:00:00");
    const end_date = new Date();
    let days = Math.ceil((end_date - start_date) / 86400000) + '';
    const originLeng = days.length;
    const leng = 3;
    for(let i = 0; i < leng - originLeng; i++) {
      days = '0' + days;
    }
    setTotalDay(days);
  });

  window.addEventListener("click", (e) => {
    if (
      e.target.childNodes[0]?.childNodes[0]?.className === "link_img" &&
      e.target.childNodes[0]?.childNodes[0]?.dataset?.contents
    ) {
      navigate(
        `${config.homepage}${e.target.childNodes[0]?.childNodes[0]?.dataset?.contents} `,
      );
    }
  });
  return (
    <>
      {/* <Link to={config.homepage + "/photo"}>张片</Link>
      <Link to={config.homepage + "/picture"}>图片</Link> */}
      <div className="app contents">
        <BackBtn
          text={(totalDay + "").slice(-3, -2)}
          path="/album3d"
          style={{ right: 150 + "px" }}
        ></BackBtn>
        <BackBtn
          text={(totalDay + "").slice(-2, -1)}
          path="/albumWall"
          style={{ right: 100 + "px" }}
        ></BackBtn>
        <BackBtn
          text={(totalDay + "").slice(-1)}
          style={{ right: 50 + "px" }}
          path="/message"
        ></BackBtn>
        <BackBtn
          text='A'
          path="/openai"
          style={{ left: 50 + "px" }}
        ></BackBtn>
        <BackBtn
          text='C'
          path="/chess"
          style={{ left: 100 + "px" }}
        ></BackBtn>
        <div className="cardList">
          <button className="cardList__btn btn btn--left">
            <div className="icon"></div>
          </button>

          <div className="cards__wrapper">
            <div className="card current--card">
              <div className="card__image">
                <img
                  className="link_img"
                  data-contents="/photoWall"
                  src={picList[0]?.path}
                  alt=""
                />
              </div>
            </div>

            <div className="card next--card">
              <div className="card__image">
                <img
                  className="link_img"
                  data-contents="/picture"
                  src={picList[1]?.path}
                  alt=""
                />
              </div>
            </div>

            <div className="card previous--card">
              <div className="card__image">
                <img
                  className="link_img"
                  data-contents="/photo"
                  src={picList[2]?.path}
                  alt=""
                />
              </div>
            </div>
          </div>

          <button className="cardList__btn btn btn--right">
            <div className="icon"></div>
          </button>
        </div>

        <div className="infoList">
          <div className="info__wrapper">
            <div className="info current--info">
              <h1 className="text name">
                {isForXy ? `2022年05月14日` : "人生若只如初见，"} <br />
                {isForXy ? `我们在一起啦` : "何事秋风悲画扇。"}
              </h1>
              <h4 className="text location">
                {isForXy ? `梁晓怡 With 胡伟烨` : "纳兰性德"}
              </h4>
              <p className="text description">
                {isForXy ? `嘻嘻😁😁` : "木兰词"}
              </p>
            </div>

            <div className="info next--info">
              <h1 className="text name">
                {isForXy ? `今天是我们在一起的` : "执子之手，"}
                <br />
                {isForXy ? `第${totalDay}天啦` : "与子偕老。"}
              </h1>
              <h4 className="text location">{isForXy ? `大臭娃!` : "先秦"}</h4>
              <p className="text description">
                {isForXy ? `你别再记错啦!!!` : "诗经·击鼓"}
              </p>
            </div>

            <div className="info previous--info">
              <h1 className="text name">
                {isForXy ? `让我们回顾下` : "人面不知何处去，"}
                <br />
                {isForXy ? `我们走过的日子吧` : "桃花依旧笑春风。"}
              </h1>
              <h4 className="text location">
                {isForXy ? `准备好了吗` : "崔护"}
              </h4>
              <p className="text description">
                {isForXy ? `PS:很多隐藏功能需要自己摸索噢` : "题都城南庄"}
              </p>
            </div>
          </div>
        </div>

        <div className="app__bg">
          <div className="app__bg__image current--image">
            <img src={picList[0]?.path} alt="" />
          </div>
          <div className="app__bg__image next--image">
            <img src={picList[1]?.path} alt="" />
          </div>
          <div className="app__bg__image previous--image">
            <img src={picList[2]?.path} alt="" />
          </div>
        </div>

        <div className="loading__wrapper">
          <div className="loader--text">Loading...</div>
          <div className="loader">
            <span></span>
          </div>
        </div>
      </div>
    </>
  );
}
export default Content;
