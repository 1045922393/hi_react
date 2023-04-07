import { useEffect } from "react";

export default function SelectComp(props) {
  const handleChangeSelect = (e) => {
    props.emitChange(e.target.value);
  };
  
  return (
    <select value={props.defaultValue} onChange={handleChangeSelect}>
      {props.options.map((item) => {
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
}
