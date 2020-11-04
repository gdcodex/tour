import React, { useState, useContext } from "react";
import { AuthContext } from "../shared/context/auth-context";

import Input from "../shared/components/formelements/input";
import Button from "../shared/components/formelements/Button";
import { VALIDATOR_REQUIRE } from "../shared/Util/validators";
import { useForm } from "../shared/hooks/form-hooks";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import Imageupload from "../shared/components/formelements/imageupload";
import { app } from "../base";

const NewPlace = () => {
  const UID = useContext(AuthContext);
  const [isSuccess, setisSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [url, seturl] = useState(null);
  const [formState, inputHandler] = useForm(
    {
      story: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setisLoading(true);
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(url.name);
    try {
      await fileRef
        .put(url)
        .then(() => console.log("Upload successful"))
        .catch((err) => console.log("err"));
    } catch (err) {
      throw new Error(err);
    }

    var formdata = new FormData();
    formdata.append("caption", "On the next --v");
    formdata.append("storyUrl", await fileRef.getDownloadURL());

    var requestOptions = {
      method: "POST",
      headers: { Authorization: "Bearer " + UID.token },
      body: formdata,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/stories",
        requestOptions
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setisLoading(false);
      setisSuccess(true);
    } catch (err) {
      console.log(err.message);
      setisLoading(false);
      setisError(err.message);
    }
  };
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  return (
    <>
      {isError && (
        <div className="center">
          <ErrorModal
            header="Error !!"
            error={isError}
            onClear={() => {
              setisError(false);
            }}
          />
        </div>
      )}
      {isSuccess && (
        <ErrorModal
          error="Story succesfully shared"
          header="Congrtulations !!"
          onClear={() => {
            setisSuccess(false);
          }}
        />
      )}

      <form onSubmit={onSubmitHandler} className="place-form">
        <Imageupload center id="story" onInput={inputHandler} setUrl={seturl} />
        <Button type="submit" disabled={!formState.isValid}>
          Share
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
