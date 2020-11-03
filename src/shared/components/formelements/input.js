import React, { useReducer, useEffect } from "react";

import { validate } from "../../Util/validators";
import "./input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
      case "RESET":
        return {
          ...state,
          value: action.val,
          isValid: action.isValid
        };  
        case "INITIAL":
        return {
          ...state,
          value: action.val,
          isValid: action.isValid
        };   
    case "TOUCHED":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);
  
  // useEffect(()=>{
  //   dispatch({
  //     type:"RESET",
  //     val:"",
  //     isValid: true

  //   })
  // },[props.isSuccess])
  // useEffect(()=>{
  //   dispatch({
  //     type:"INITIAL",
  //     val:"",
  //     isValid: false

  //   })
  // },[])
  

  const changehandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };
  const isTouched = () => {
    dispatch({ type: "TOUCHED" });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={inputState.value}
        onChange={changehandler}
        onBlur={isTouched}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        value={inputState.value}
        onChange={changehandler}
        onBlur={isTouched}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
}

export default Input;
