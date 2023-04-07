import { useState, useRef, useEffect, useCallback } from "react";
import InputComp from "./comps/inputCommon";
import SelectComp from "./comps/selectCommon";
function ReactDemo() {
  // input demo start
  // 通过useRef + 子组件的 forwardRef配合
  // 在父级组件声明ref, 获取到子组件的实际Dom
  const inputRef = useRef(null);
  const [inputVal, setInputValue] = useState("Default");
  const handleChangeInput = (val) => {
    setInputValue(val);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);
  // input demo end

  // select demo start
  const [selectVal, setSelectVal] = useState(2);
  const optionsConfig = [
    {
      value: 1,
      label: "男",
    },
    {
      value: 2,
      label: "女",
    },
  ];
  const handleChangeSelect = (val) => {
    console.log(
      "Debugger ~ file: index.js:15 ~ handleChangeSelect ~ val:",
      val,
    );
    setSelectVal(val);
  };
  // select demo end

  // useCallback demo start
  const [currentPage, setCurrentPage] = useState(1);
  // useCallback 的第二个参数控制第一个回掉函数的缓存
  const holdingFn = useCallback(() => {
    console.log("currentPage:", currentPage);
  }, []);
  const normalFn = () => {
    console.log("currentPage:", currentPage);
  };

  const handleChangePage = (calc) => {
    setCurrentPage(currentPage + calc);
  };
  // useCallback demo end

  return (
    <div>
      <h1>ReactDemo</h1>
      <h2>Input 输入框</h2>
      <InputComp
        ref={inputRef}
        value={inputVal}
        emitChange={handleChangeInput}
      ></InputComp>
      <h2>select 选择框</h2>
      性别:
      <SelectComp
        defaultValue={selectVal}
        emitChange={handleChangeSelect}
        options={optionsConfig}
      ></SelectComp>
      <h2>useCallback</h2>
      <div>Page value is {currentPage}</div>
      <div>
        <button onClick={() => handleChangePage(1)}>Add</button>
      </div>
      <div>
        <button onClick={() => holdingFn()}>useCallbackBtn</button>
      </div>
      <div>
        <button onClick={() => normalFn()}>normalBtn</button>
      </div>
      <div>
        <button onClick={() => handleChangePage(-1)}>Reduce</button>
      </div>
    </div>
  );
}

export default ReactDemo;
