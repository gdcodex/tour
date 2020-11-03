import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/http-hook";

import Placelist from "../components/placelist";

function Userplaces() {
  const [loadedPlaces, setloadedPlaces] = useState(null);
  const { isLoading,sendRequest } = useHttp();
  const userId = useParams().userId;
  useEffect(() => {
    sendRequest( `${process.env.REACT_APP_BACKEND_URL}/places/users/${userId}`)
      .then((data) => {setloadedPlaces(data.places)})
      .catch((err) => console.log(err,'sss'));
  }, [sendRequest,userId]);

 const onDelete =(deleted)=>{
   setloadedPlaces(prevPlaces=>prevPlaces.filter(p=>p.id!==deleted));
 }
  return (
    <>
       {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
     
     {loadedPlaces && <Placelist items={loadedPlaces} onDelete={onDelete}/>}
    </>
  );
}

export default Userplaces;
