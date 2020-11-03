import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHttp } from "../shared/hooks/http-hook";
import "./stories.css";
function Stories() {
  const [story, setstory] = useState(null);

  const { sendRequest } = useHttp();

  useEffect(() => {
    sendRequest(process.env.REACT_APP_BACKEND_URL + "/stories")
      .then((data) => {
        let array = data.stories;
        array.map((e, i) => {
          array.map((v, ii) => {
            if (i !== ii) {
              if (e.creator === v.creator) array.splice(ii, 1);
            }
            return 1;
          });
          return 1;
        });
        setstory(array);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sendRequest]);

  return (
    <>
    {!story && <div className="stories"  style={{borderBottom:"0.5px solid rgb(224, 230, 196)"}}>
      <div className="no-stories">
       <Link id="no-img" to='/story/new'>ADD </Link> 
      </div>
    </div>}
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
              <Link key={s.storyUrl + i} to={"/stories/user/" + s.creator}>
                <img src={s.imageUrl} alt="V" className="story-circle-box" />
              </Link>
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
