// Reusable input component for forms
import React from "react";

const InputField = (props) => {
  return (
    <div className="input-field">
      <label htmlFor={props.name}>{props.label}</label>
      <input
        type={props.type || "text"}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder || ""}
      />
    </div>
  );
};

export default InputField;
