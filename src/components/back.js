import { useNavigate } from "react-router-dom";
import "./back.less";
function BackBtn(props) {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate(props.path || "/");
  };
  return (
    <div className="back_btn" style={props.style} onClick={handleBackHome}>
      {props.text || "B"}
    </div>
  );
}

export default BackBtn;
