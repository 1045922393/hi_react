import { forwardRef } from "react";

const InputComp = forwardRef((props, ref) => {
  const handleChangeInput = (e) => {
    props.emitChange(e.target.value);
  };

  return (
    <input
      ref={ref}
      onChange={handleChangeInput}
      placeholder="please input value!"
      type="text"
      value={props.value}
    ></input>
  );
});

export default InputComp;
