import React, { useEffect, useState } from "react";
import Userslist from "../components/userslist";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/http-hook";
import Stories from '../../stories/stories';

function Users() {
 
  const [loadedUsers, setloadedUsers] = useState(false);

  const {isLoading,isError,resetError,sendRequest} = useHttp();

  useEffect(() => {
    sendRequest(process.env.REACT_APP_BACKEND_URL + "/users").then(data=>{
        setloadedUsers(data.users)
    }).catch(err=>{
        console.log(err)
    })
  }, [sendRequest]);
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
      <Stories/>
      {loadedUsers && <Userslist items={loadedUsers} />}
    </>
  );
}

export default Users;
