
import { useState, useEffect } from "react";
import "./index.less";
import BackBtn from "@/components/back";
import { Link, useNavigate } from "react-router-dom";

function Message(){
  return (
    <div className="message_page">
      <BackBtn></BackBtn>
      <div className="typing">
        <pre className="typing-effect">
        上经理附加费
        上经理附加费
        上经理附加费
        上经理附加费
        
        </pre>
      </div>
    </div>
  )
}

export default Message;
