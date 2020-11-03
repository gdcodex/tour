import React, {useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";

import Input from "../../shared/components/formelements/input";
import Button from "../../shared/components/formelements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "./../../shared/Util/validators";
import "./placeform.css";
import { useForm } from "../../shared/hooks/form-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Imageupload from "../../shared/components/formelements/imageupload";
import { app } from "../../base";

const NewPlace = () => {
  const UID = useContext(AuthContext)
  const [isSuccess, setisSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [url, seturl] = useState(null);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image:{
        value: null,
        isValid: false
      }
    },
    false
  );

  const onSubmitHandler = async(event) => {
    event.preventDefault();
    setisLoading(true);
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(url.name);
    try{
      await fileRef
        .put(url)
        .then(() => console.log("Upload successful"))
        .catch((err) => console.log("err"));
    }
    catch(err){
      throw new Error(err)
    }

     var formdata = new FormData();
      formdata.append("title", formState.inputs.title.value);
      formdata.append("description", formState.inputs.description.value);
      formdata.append("address", formState.inputs.address.value);
      formdata.append("imageUrl", await fileRef.getDownloadURL());

      var requestOptions = {
        method: "POST",
        headers:{Authorization: 'Bearer ' + UID.token},
        body: formdata,
        redirect: "follow",
      };
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/places",
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
          <ErrorModal header="Error !!" error={isError} onClear={()=>{setisError(false)}} />
        </div>
      )}
      {isSuccess && (
        <ErrorModal
          error="Place succesfully shared"
          header="Congrtulations !!"
          onClear={()=>{setisSuccess(false)}}
        />
      )}
     
      <form onSubmit={onSubmitHandler} className="place-form">
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Imageupload center id="image" onInput={inputHandler} setUrl={seturl} />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
