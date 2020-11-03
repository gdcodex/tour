import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";

import "./imageupload.css";

function Imageupload(props) {
  const [file, setfile] = useState();
  const [previewUrl, setpreviewUrl] = useState();
  const [isValid, setisValid] = useState(true);
  const inputRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const filereader = new FileReader(); //1
    filereader.onload = () => {
      //3
      setpreviewUrl(filereader.result);
    };
    filereader.readAsDataURL(file); //2
  }, [file]);

  const picked = async(event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setfile(pickedFile);
      props.setUrl(pickedFile)
      setisValid(true);
      fileIsValid = true;
    } else {
      setisValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImage = () => {
    inputRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        ref={inputRef}
        type="file"
        name=""
        style={{ display: "none" }}
        id={props.id}
        accept=".jpeg, .jpg, .png"
        onChange={picked}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && (
            <p>
              Upload a profile photo{" "}
              <span role="img" aria-label="jsx-a11y/aria-proptypes">
                {" "}
                &#128071;
              </span>{" "}
            </p>
          )}
        </div>
        <Button type="button" onClick={pickImage}>
          PICK IMAGE
        </Button>
      </div>
    </div>
  );
}

export default Imageupload;
