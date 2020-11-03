import React, { useState, useEffect } from "react";
import { useHttp } from "../shared/hooks/http-hook";
import "./stories.css";
function Stories() {
  const [story, setstory] = useState(null);

 

  const {  sendRequest } = useHttp();

  useEffect(() => {
    sendRequest(process.env.REACT_APP_BACKEND_URL + "/stories")
      .then((data) => {
        setstory(data.stories);
      })
      .catch((err) => {
        console.log(err);
      });
     
  }, [sendRequest]);

  return (
    <>
      {story && (
        <div className="stories">
          <img
            className="arrow-span-scroll"
            src="/arrow.png"
            alt="next"
            onClick={() => {
              setstory((p) => {
                let first = p.pop();
                p.unshift(first);
                return [...p];
              });
            }}
          />
          <div className="stories-container">
            {story.map((s, i) => (
              <img key={s.storyUrl + i} src={s.storyUrl} alt="V" className="story-circle-box"/>
              
            ))}
          </div>
          <img
            className="arrow-span-scroll-two"
            src="/arrow.png"
            alt="next"
            onClick={() => {
              setstory((p) => {
                let first = p.shift();
                p.push(first);
                return [...p];
              });
            }}
          />
        </div>
      )}
    </>
  );
}

export default Stories;
