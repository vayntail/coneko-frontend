import { useState, useRef, useEffect } from "react";

//What is this?
/**
 * Reusable dropdown component that can be used for all filter types
 * With improved clickable areas for better usability
 */
const Dropdown = ({
  label,
  options,
  selected,
  onSelect,
  className = "",
  allowMultiple = false,
  showSelectedCount = false,
  showSelectAll = true,
  useIconLabels = false,
}) => {
  // State to track whether dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Reference to the dropdown element for detecting outside clicks
  const dropdownRef = useRef(null);

  // Click listener to detect clicks outside the dropdown
  useEffect(() => {
    // Function for outside clicks
    const handleClickOutside = (evt) => {
      // Close dropdown menu for outside clicks
      if (dropdownRef.current && !dropdownRef.current.contains(evt.target)) {
        setIsOpen(false);
      }
    };

    // Adding the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty array so it will only run once on mount.

  // ============================== User Interaction Section ===================================

  const handleSelect = (option) => {
    if (allowMultiple) {
      // For multiSelect, toggle the selected option
      const newSelected = selected.includes(option.value)
        ? // (remove already selected options)
          selected.filter((val) => val !== option.value)
        : // if not selected, add it
          [...selected, option.value];
      onSelect(newSelected);
    } else {
      // For single select, just set value
      onSelect(option.value);
      // Close the dropdown after selections
      setIsOpen(false);
    }
  };

  // Handle Select All option
  const handleSelectAll = () => {
    // If all are selected, clear selection
    if (selected.length === options.length) {
      onSelect([]);
    } else {
      // Otherwise select all
      onSelect(options.map((opt) => opt.value));
    }
  };

  // Dropdown Label Display
  const getDisplayLabel = () => {
    // If multiSelect and we have selections
    if (allowMultiple && selected.length > 0) {
      // If using array format for single selection (like in GroupSizeFilter)
      if (selected.length === 1) {
        const selectedOption = options.find((opt) => opt.value === selected[0]);
        return selectedOption ? selectedOption.label : label;
      }

      // Otherwise show count for true multi-select
      return showSelectedCount
        ? `${label} (${selected.length})` // Show label with count
        : `${label}`; // Just show the label
    }

    // if single-select and we have a selection
    if (!allowMultiple && selected) {
      // Find the selected option to display its label
      const selectedOption = options.find((opt) => opt.value === selected);
      return selectedOption ? selectedOption.label : label;
    }

    // Default: just show the label
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
        {getDisplayLabel()} <span className="dropdown-arrow">▼</span>
      </button>

      {/* Dropdown menu - only shown when isOpen is true */}
      {isOpen && (
        <ul className="dropdownList" role="listbox">
          {/* For multi-select, show a "Select All" option - if showSelectAll is true */}
          {allowMultiple && showSelectAll && (
            <li
              className="dropdownItem dropdownItemAll"
              onClick={handleSelectAll}
            >
              <label onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.length === options.length}
                  onChange={handleSelectAll}
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
              onClick={() => handleSelect(option)} // Handle click on entire item
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
                <label onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => handleSelect(option)}
                  />

                  {/* Use icon label if provided, otherwise use regular label */}
                  <span className="option-label">
                    {useIconLabels && option.labelWithIcon
                      ? option.labelWithIcon
                      : " " + option.label}
                  </span>
                </label>
              ) : (
                // For single-select, just show the label/icon
                <span className="option-label">
                  {useIconLabels && option.labelWithIcon
                    ? option.labelWithIcon
                    : option.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
