import { useState, useRef, useEffect } from "react";
//(What is this?)
//Reusable dropdown component that can be use for all filter types

//Structure of the dropdown menu
const Dropdown = ({
  label,
  options,
  selected,
  onSelect,
  className = "",
  allowMultiple = false,
  showSelectedCount = false,
}) => {
  //State to track wheter dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  //Reference to the dropdown element for detecting outside clicks
  const dropdownRef = useRef(null);

  //Click listener to detect clicks outside the dropdown
  useEffect(() => {
    //Function for outside clicks
    const handleClickOutside = (evt) => {
      //Close dropdown menu for outside clicks
      if (dropdownRef.current && !dropdownRef.current.contains(evt.target)) {
        setIsOpen(false);
      }
    };

    //Adding the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    //Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); //Empty array so it will only run once on mount.

  //  ============================== User Interaction Section ===================================

  const handleSelect = (option) => {
    if (allowMultiple) {
      //For multiSelect, toggle the selected option
      const newSelected = selected.includes(option.value)
        ? //(remove already selected options)
          selected.filter((val) => val !== option.value)
        : //if not selected, add it
          [...selected, option.value];
      onSelect(newSelected);
    } else {
      //For single select, just set value
      onSelect(option.value);
      //Close the dropdown after selections
      setIsOpen(false);
    }
  };

  //A Function so the checkboxes clicks directly
  const handleCheckboxChange = (option, evt) => {
    evt.stopPropagation(); //prevent bubbaling down the line
    handleSelect(option);
  };

  //DropDown Label Display

  const getDisplayLabel = () => {
    // If multiSelect and we have selections
    if (allowMultiple && selected.length > 0) {
      return showSelectedCount
        ? `${label} (${selected.length})` // Show label with count
        : `${label}`; // Just show the label
    }

    // if single-select and we have a selection (For future dropdown EX: time search onGoing/Later date)
    if (!allowMultiple && selected) {
      //Find the selected option to display its label
      const selectedOption = options.find((opt) => opt.value === selected);
      return selectedOption ? selectedOption.label : label;
    }

    //=======================The UI ====================

    //Default: just show the label
    return label;
  };

  // Render the dropdown component
  return (
    <div ref={dropdownRef} className={`dropdownContainer ${className}`}>
      {/* Button to open/close the dropdown */}
      <button
        className="dropdownBtn"
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown open/closed
        aria-haspopup="listbox" // For displaying checkbox like options
        aria-expanded={isOpen}
      >
        {getDisplayLabel()} ▼ {/* Show label and dropdown arrow */}
      </button>

      {/* Dropdown menu - only shown when isOpen is true */}
      {isOpen && (
        <ul className="dropdownList" role="listbox">
          {/* For multi-select, show a "Select All" option */}
          {allowMultiple && (
            <li className="dropdownItem dropdownItemAll">
              <label>
                <input
                  type="checkbox"
                  // Checked if all options are selected
                  checked={selected.length === options.length}
                  onChange={(evt) => {
                    evt.stopPropagation();
                    // If all are selected, clear selection
                    if (selected.length === options.length) {
                      onSelect([]);
                    } else {
                      // Otherwise select all
                      onSelect(options.map((opt) => opt.value));
                    }
                  }}
                  onClick={(evt) => evt.stopPropagation()} //Hopefully prevents doubleclick bugging (Todo change)
                />
                {" Select All"}
              </label>
            </li>
          )}

          {/* Map through options to create dropdown items */}
          {options.map((option) => (
            <li
              key={option.value} // Unique React key
              className="dropdownItem"
              onClick={() => handleSelect(option)} // Handle click on item
              role="option"
              aria-selected={
                // Checks if this option is selected
                allowMultiple
                  ? selected.includes(option.value)
                  : selected === option.value
              }
            >
              {allowMultiple ? (
                // For multiSelect, show checkbox
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={(e) => handleCheckboxChange(option, e)} // Handled by onClick on li [can replace ( handleSelect(option) with {} { for checkbox})]
                    onClick={(e) => e.stopPropagation()} // Prevent double-triggering
                  />

                  {" " + option.label}
                </label>
              ) : (
                // For single-select, just show the label
                option.label
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
