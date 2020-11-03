import React from "react";
import "./landing.css";
function LandingPage() {
  return (
    <>
      <div className="main-landing">
        <div className="first-landing">
          <img src="/camp.png" alt="camp" />
        </div>
        <div className="second-landing">
          <h1 className="landing-title">
            TOUR{" "}
            <span role="img" aria-label="jsx-a11y/accessible-emoji">
              🌴
            </span>
          </h1>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
