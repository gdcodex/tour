import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../shared/hooks/http-hook";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import './storyview.css';
import moment from 'moment';

function Storyview() {
  const [loadedstories, setloadedstories] = useState(null);
  const { isError, resetError, isLoading, sendRequest } = useHttp();
  const userId = useParams().userId;
  useEffect(() => {
    sendRequest(`${process.env.REACT_APP_BACKEND_URL}/stories/${userId}`)
      .then((data) => {
        setloadedstories(data.stories);
      })
      .catch((err) => console.log(err, "sss"));
  }, [sendRequest, userId]);

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {isError && (
        <ErrorModal
          error={isError}
          header="An Error Occurred"
          onClear={resetError}
        />
      )}
      <div className="story-view">
     <Link to='/'>
        <img src="/close.png" alt="Close" className="close-story-view"/>
     </Link>
      {
          loadedstories && loadedstories.map((e,i)=>
              <div key={e.id} className="story-view-box">
                  <img src={e.storyUrl} alt="Not available !"/>
                  <p className="story-time">{`Today at 2:14 pm`}↙️</p>
              </div>
          )
      }
      </div>
    </>
  );
}

export default Storyview;
