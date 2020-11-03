import React, { useContext, useState } from "react";
import Button from "../../shared/components/formelements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/formelements/input";
import Card from "../../shared/components/UIElements/Card";
import Imageupload from "../../shared/components/formelements/imageupload";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hooks";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/Util/validators";
import './auth.css';
import { app } from "../../base";

function Auth() {
  const auth = useContext(AuthContext);
  const [isSuccess, setisSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isLoggedInMode, setisLoggedInMode] = useState(true);
  const [formState, inputHandler, setInputData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const [url, seturl] = useState(null);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setisLoading(true);
    if (!isLoggedInMode) {


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
      formdata.append("name", formState.inputs.name.value);
      formdata.append("email", formState.inputs.email.value);
      formdata.append("password", formState.inputs.password.value);
      formdata.append("imageUrl", await fileRef.getDownloadURL());

      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
    
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL  + "/users/signup",
          requestOptions
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData);
        setisLoading(false);
        setisSuccess(true);
      } catch (err) {
        console.log(err.message);
        setisLoading(false);
        setisError(err.message);
      }
    
    } else {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setisLoading(false);
        auth.login(responseData.userId, responseData.token);
        
      } catch (err) {
        console.log(err.message);
        setisLoading(false);
        setisError(err.message);
      }
    }
  };

  const switchMode = () => {
    if (!isLoggedInMode) {
      setInputData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setInputData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setisLoggedInMode((p) => !p);
  };

  return (
    <>
      {isError && (
        <ErrorModal
          error={isError}
          header="An Error Occurred"
          onClear={() => {
            setisError(false);
          }}
        />
      )}
      {isSuccess && (
        <ErrorModal
          error="User Succesfully Created"
          header="Congrtulations !!"
          onClear={() => {
            setisSuccess(false);
            window.location.reload();
          }}
        />
      )}
      <Card className="auth-form">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoggedInMode ? "LOGIN" : "SIGNUP"}</h2>
        <form onSubmit={onSubmitHandler}>
          {!isLoggedInMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
              isSuccess={isSuccess}
            />
          )}
          {!isLoggedInMode && (
            <Imageupload center id="image" onInput={inputHandler} setUrl={seturl} />
          )}

          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Enter a valid email"
            onInput={inputHandler}
            isSuccess={isSuccess}
          />

          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Enter a valid password"
            onInput={inputHandler}
            isSuccess={isSuccess}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoggedInMode ? "LOGIN" : "SIGNUP"}
          </Button>
        <Button type='button' inverse onClick={switchMode}>
          Go to {isLoggedInMode ? "SIGNUP" : "LOGIN"}
        </Button>
        </form>
      </Card>
    </>
  );
}

export default Auth;
