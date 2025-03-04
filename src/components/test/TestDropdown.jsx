import { useState } from "react";
import Dropdown from "../common/Dropdown";

const TestDropdown = () => {
  // State for single selection dropdown
  const [singleValue, setSingleValue] = useState("");

  // State for multi selection dropdown
  const [multiValues, setMultiValues] = useState([]);

  // Some example options
  const testOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dropdown Component Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Single Select Dropdown</h3>
        <Dropdown
          label="Choose an option"
          options={testOptions}
          selected={singleValue}
          onSelect={setSingleValue}
        />
        <p>Selected value: {singleValue}</p>
      </div>

      <div>
        <h3>Multi Select Dropdown</h3>
        <Dropdown
          label="Choose multiple options"
          options={testOptions}
          selected={multiValues}
          onSelect={setMultiValues}
          allowMultiple={true}
          showSelectedCount={true}
        />
        <p>Selected values: {multiValues.join(", ")}</p>
      </div>
    </div>
  );
};

export default TestDropdown;
