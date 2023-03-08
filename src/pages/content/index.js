// 目录
import { Link, useNavigate } from "react-router-dom";
import { config } from "@/index";
import { useState, useEffect } from "react";
import "./index.less";
import BackBtn from "@/components/back";
function Content() {
  const navigate = useNavigate();

  const [totalDay, setTotalDay] = useState(0);

  const { gsap, imagesLoaded } = window;
  useEffect(() => {
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
    const start_date = new Date("2022-05-14 00:00:00");
    const end_date = new Date();
    const days = Math.ceil((end_date - start_date) / 86400000);
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
          text={(totalDay + "").substring(0, 1)}
          path="/album3d"
          style={{ right: 150 + "px" }}
        ></BackBtn>
        <BackBtn
          text={(totalDay + "").substring(1, 2)}
          path="/albumWall"
          style={{ right: 100 + "px" }}
        ></BackBtn>
        <BackBtn
          text={(totalDay + "").substring(2, 3)}
          style={{ right: 50 + "px" }}
          path="/message"
        ></BackBtn>
        <div className="cardList">
          <button className="cardList__btn btn btn--left">
            <div className="icon"></div>
          </button>

          <div className="cards__wrapper">
            <div className="card current--card">
              <div className="card__image">
                {/* <img
                  className="link_img"
                  data-contents="/photoWall"
                  src="https://cdn.seovx.com/?mom=302"
                  alt=""
                /> */}
                <img
                  className="link_img"
                  data-contents="/photoWall"
                  src="https://static-mp-1c925fd0-d9e0-409d-b254-d061358b31f9.next.bspapp.com/assets/LXY/10.jpeg"
                  alt=""
                />
              </div>
            </div>

            <div className="card next--card">
              {/* <div className="card__image">
                <img
                  className="link_img"
                  data-contents="/picture"
                  src="http://api.btstu.cn/sjbz/?lx=m_meizi"
                  alt=""
                />
              </div> */}
              <div className="card__image">
                <img
                  className="link_img"
                  data-contents="/picture"
                  src="https://static-mp-1c925fd0-d9e0-409d-b254-d061358b31f9.next.bspapp.com/assets/LXY/40.jpeg"
                  alt=""
                />
              </div>
            </div>

            <div className="card previous--card">
              <div className="card__image">
                {/* <img
                  className="link_img"
                  data-contents="/photo?p=100&page=1"
                  src="https://api.isoyu.com/mm_images.php"
                  alt=""
                /> */}
                <img
                  className="link_img"
                  data-contents="/photo?p=100&page=1"
                  src="https://static-mp-1c925fd0-d9e0-409d-b254-d061358b31f9.next.bspapp.com/assets/LXY/33.jpeg"
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
                2022年05月14日 <br />
                我们在一起啦
              </h1>
              <h4 className="text location">梁晓怡 With 胡伟烨</h4>
              <p className="text description">😁😁😁</p>
            </div>

            <div className="info next--info">
              <h1 className="text name">
                今天是我们在一起的
                <br />
                第{totalDay}天啦
              </h1>
              <h4 className="text location">大臭娃!</h4>
              <p className="text description">你别再记错啦!!!</p>
            </div>

            <div className="info previous--info">
              <h1 className="text name">
                让我们回顾下
                <br />
                我们走过的日子吧
              </h1>
              <h4 className="text location">准备好了吗</h4>
              <p className="text description">PS:很多隐藏功能需要自己摸索噢</p>
            </div>
          </div>
        </div>

        <div className="app__bg">
          <div className="app__bg__image current--image">
            {/* <img src="https://cdn.seovx.com/?mom=302" alt="" /> */}
            <img
              src="https://static-mp-1c925fd0-d9e0-409d-b254-d061358b31f9.next.bspapp.com/assets/LXY/10.jpeg"
              alt=""
            />
          </div>
          <div className="app__bg__image next--image">
            <img
              src="https://static-mp-1c925fd0-d9e0-409d-b254-d061358b31f9.next.bspapp.com/assets/LXY/40.jpeg"
              alt=""
            />
            {/* <img src="http://api.btstu.cn/sjbz/?lx=m_meizi" alt="" /> */}
          </div>
          <div className="app__bg__image previous--image">
            <img
              src="https://static-mp-1c925fd0-d9e0-409d-b254-d061358b31f9.next.bspapp.com/assets/LXY/33.jpeg"
              alt=""
            />
            {/* <img src="https://api.isoyu.com/mm_images.php" alt="" /> */}
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
