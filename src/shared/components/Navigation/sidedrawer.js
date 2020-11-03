import React from "react";
import ReactDOM from "react-dom";
import "./sidedrawer.css";


function Sidedrawer(props) {

  const content = 
  <aside id="x" style={{display:(props.open?'block':'none')}} className={props.onClick? 'side-drawer':'open'}>
  {props.children}
  </aside>;
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
}

export default Sidedrawer;
