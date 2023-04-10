import { useState, useEffect, useCallback, useMemo } from "react";
import "./index.less";
import BackBtn from "@/components/back";
import { Snackbar, Alert } from "@mui/material";
import Button from "@mui/material/Button";

const totalCount = 60;

let chesses = [
  [
    {
      id: "00",
      name: "将",
      num: 1,
      power: 7,
      mark: 10,
      remain: 1,
    },
    {
      id: "01",
      name: "士",
      num: 2,
      power: 6,
      mark: 8,
      remain: 2,
    },
    {
      id: "02",
      name: "象",
      num: 2,
      power: 5,
      mark: 6,
      remain: 2,
    },
    {
      id: "03",
      name: "车",
      num: 2,
      power: 4,
      mark: 5,
      remain: 2,
    },
    {
      id: "04",
      name: "马",
      num: 2,
      power: 3,
      mark: 4,
      remain: 2,
    },
    {
      id: "05",
      name: "炮",
      num: 2,
      power: 2,
      mark: 3,
      remain: 2,
    },
    {
      id: "06",
      name: "卒",
      num: 5,
      power: 1,
      mark: 2,
      remain: 5,
    },
  ],
  [
    {
      id: "10",
      name: "帅",
      num: 1,
      power: 7,
      mark: 10,
      remain: 1,
    },
    {
      id: "11",
      name: "仕",
      num: 2,
      power: 6,
      mark: 8,
      remain: 2,
    },
    {
      id: "12",
      name: "相",
      num: 2,
      power: 5,
      mark: 6,
      remain: 2,
    },
    {
      id: "13",
      name: "车",
      num: 2,
      power: 4,
      mark: 5,
      remain: 2,
    },
    {
      id: "14",
      name: "马",
      num: 2,
      power: 3,
      mark: 4,
      remain: 2,
    },
    {
      id: "15",
      name: "炮",
      num: 2,
      power: 2,
      mark: 3,
      remain: 2,
    },
    {
      id: "16",
      name: "兵",
      num: 5,
      power: 1,
      mark: 2,
      remain: 5,
    },
  ],
];

// 深拷贝
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj || {}));
}

// 得到所有棋盘上棋子
function getAllChess(chess) {
  let chessTemp = [];
  chess.forEach((item) => {
    chessTemp = chessTemp.concat(new Array(item.num).fill(deepClone(item)));
  });
  return chessTemp;
}
let allChesses = [].concat(getAllChess(chesses[0]), getAllChess(chesses[1]));

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 随机获取一个未放到棋盘上的棋子
function getOneChess() {
  // 黑红方
  const powerIndex = random(0, allChesses.length - 1);
  const oneChess = deepClone(allChesses.splice(powerIndex, 1)[0]);
  oneChess.hide = true;
  return oneChess;
}

let timeId = null;

// 棋子组件
function Chess() {
  let [chessboard, setChessboard] = useState([]);
  let [redoChessboard, setRedoChessboard] = useState([]);
  let [currentCount, setCurrentCount] = useState({
    black: totalCount,
    red: totalCount,
  });
  let [highChessInfo, setHighChessInfo] = useState({});
  let [chessBg, setChessBg] = useState("");
  // 0 黑 1 红
  let [takeTurn, setTakeTurn] = useState("");

  // 警告
  let [infoMessage, setInfoMessage] = useState("");

  let [blackBlood, setBlackBlood] = useState(totalCount);
  let [redBlood, setRedBlood] = useState(totalCount);

  let blackBloodPercent = useMemo(() => {
    let result = ((totalCount - blackBlood) / totalCount) * 100;
    if (result >= 100) {
      result = 100;
      setInfoMessage("游戏结束, 红色方胜");
    }
    return result + "%";
  }, [blackBlood]);
  let redBloodPercent = useMemo(() => {
    let result = ((totalCount - redBlood) / totalCount) * 100;
    if (result >= 100) {
      result = 100;
      setInfoMessage("游戏结束, 黑色方胜");
    }
    return result + "%";
  }, [redBlood]);

  const changeTurn = () => {
    setTakeTurn(Math.abs(takeTurn - 1) + "");
  };

  let open = useMemo(() => {
    if (infoMessage) {
      return true;
    } else {
      return false;
    }
  }, [infoMessage]);

  useEffect(() => {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      setInfoMessage("");
    }, 2000);
  }, [infoMessage]);

  // 初始化棋盘
  useEffect(() => {
    // 长宽
    const h = window.innerHeight;
    const w = window.innerWidth;
    let width = 8;
    let height = 4;
    if (w < h) {
      width = 4;
      height = 8;
    }
    let temp = new Array(width).fill(new Array(height).fill(null));
    temp.forEach((item, index) => {
      temp[index] = temp[index].map(() => {
        return getOneChess();
      });
    });
    // 随机势力
    setTakeTurn(random(0, 1) + "");
    setChessBg(window.pictureConfig.data[1].path);
    setChessboard(temp);
    setRedoChessboard(temp);
  }, []);

  const openChess = (chess, x, y) => {
    saveRedoChess();
    chessboard[x][y].hide = false;
    chessboard[x][y].x = x;
    chessboard[x][y].y = y;
    setChessboard(deepClone(chessboard));
    setHighChessInfo({});
    changeTurn();
    setDisabledRedo(false);
  };

  const saveRedoChess = () => {
    setRedoChessboard(deepClone(chessboard));
  };

  const [disabledRedo, setDisabledRedo] = useState(false);
  const redo = () => {
    setChessboard(deepClone(redoChessboard));
    changeTurn();
    setDisabledRedo(true);
    setBlackBlood(currentCount.black);
    setRedBlood(currentCount.red);
  };

  // 移动/交换位置
  const transformChess = (chess, x, y) => {
    saveRedoChess();
    chessboard[x][y] = deepClone(highChessInfo);
    chessboard[x][y].x = x;
    chessboard[x][y].y = y;
    chessboard[highChessInfo.x][highChessInfo.y] = {};
    setChessboard(deepClone(chessboard));
    setHighChessInfo({});
    changeTurn();
    setDisabledRedo(false);
  };

  // 记分
  const calcCount = (chess) => {
    if (chess.id[0] === "0") {
      // 黑棋被吃
      setBlackBlood(blackBlood - chess.mark);
    } else if (chess.id[0] === "1") {
      // 红棋被吃
      setRedBlood(redBlood - chess.mark);
    }
  };

  const eatChess = (chess, x, y) => {
    if (
      // 炮
      highChessInfo.id[1] === "5" &&
      // 重复点击自己
      !(highChessInfo.x === x && highChessInfo.y === y) &&
      // 禁止移动
      JSON.stringify(chess) !== "{}" &&
      // 只能同行或者同列
      (highChessInfo.x === x || highChessInfo.y === y) &&
      // 隔壁不能吃
      Math.abs(x + y - (highChessInfo.x + highChessInfo.y)) !== 1
    ) {
      transformChess(chess, x, y);
      setCurrentCount({
        black: blackBlood,
        red: redBlood,
      });
      calcCount(chess);
      return;
    }

    if (Math.abs(x + y - (highChessInfo.x + highChessInfo.y)) !== 1) {
      setInfoMessage("非法操作");
      setHighChessInfo({});
      return;
    }

    // 移动操作 炮不能移动
    if (JSON.stringify(chess) === "{}" && highChessInfo.id[1] !== "5") {
      transformChess(chess, x, y);
      return;
    }

    // 吃子操作
    if (
      highChessInfo.id[1] !== "5" &&
      ((highChessInfo.power === 1 && chess.power === 7) ||
        highChessInfo.power >= chess.power) &&
      highChessInfo.power - chess.power !== 6 &&
      highChessInfo.id[0] !== chess.id[0]
    ) {
      transformChess(chess, x, y);
      setCurrentCount({
        black: blackBlood,
        red: redBlood,
      });
      calcCount(chess);
      return;
    }
    setInfoMessage("非法操作");
    setHighChessInfo({});
  };

  // 点击棋子
  const handleClick = (chess, x, y) => {
    console.log(chess, x, y);

    // 翻棋 高亮的棋子不是炮
    if (chess.hide && highChessInfo.id?.[1] !== "5") {
      openChess(chess, x, y);
      return;
    }

    // 点击翻开的棋子
    if (JSON.stringify(highChessInfo) === "{}") {
      if (chess.id[0] !== takeTurn) {
        setInfoMessage("请操作自己的棋子");
        return;
      }
      setHighChessInfo(chess);
      return;
    }

    // 点击同个棋子
    if (highChessInfo.x === x && highChessInfo.y === y) {
      setHighChessInfo({});
      return;
    }

    // 吃棋
    eatChess(chess, x, y);
  };

  const ChessboardEntity = () => {
    return (
      <div className="chessOut">
        {chessboard.map((item, index) => {
          return (
            <div key={index} className="out">
              {item.map((childItem, childIndex) => {
                return (
                  <div
                    className={`inline ${
                      childItem.id && childItem.id[0] === "0" ? "black" : "red"
                    } ${childItem.hide ? "hide" : ""} ${
                      !childItem.hide &&
                      highChessInfo.x === index &&
                      highChessInfo.y === childIndex
                        ? "selected"
                        : ""
                    }`}
                    key={childIndex}
                    onClick={() => handleClick(childItem, index, childIndex)}
                  >
                    {childItem.name && (
                      <div className="chess">{childItem.name}</div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="chess_page" style={{ backgroundImage: `url(${chessBg})` }}>
      <BackBtn></BackBtn>
      <div className="tip_btns">
        <div className={`tip_chess ${takeTurn === "0" ? "black" : "red"}`}>
          {takeTurn === "0" ? "将" : "帅"}
        </div>
        <Button
          disabled={disabledRedo}
          onClick={redo}
          className="btn"
          variant="contained"
        >
          Redo
        </Button>
      </div>
      <div className="blood">
        <div className="blood_item black">
          <div className="label">将</div>
          <div className="value">
            <div className="mask" style={{ width: blackBloodPercent }}></div>
          </div>
        </div>
        <div className="blood_item red">
          <div className="label">帅</div>
          <div className="value">
            <div className="mask" style={{ width: redBloodPercent }}></div>
          </div>
        </div>
      </div>
      <ChessboardEntity></ChessboardEntity>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
      >
        {infoMessage ? (
          <Alert severity="warning">{infoMessage}</Alert>
        ) : (
          <div></div>
        )}
      </Snackbar>
    </div>
  );
}

export default Chess;
