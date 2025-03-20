import { useState, useEffect, useRef } from "react";
import { useFilters } from "../../context/FilterContext";

//(What is this?)
//Component that Allows Users to search for game sessions
//Uses debouncing to prevent excessive filtering while typing

const SearchBar = () => {
  //Get search term and setter function from context
  const { searchTerm, setSearchTerm } = useFilters();

  // Local state to track input value while typing (before debouncing)
  const [inputValue, setInputValue] = useState(searchTerm);

  // Reference to keep track of the debounce timer
  const debounceTimerRef = useRef(null);

  //Handle change to input field &&
  // Uses debouncing to avoid updating the search term on every keystroke

  const handleInputChange = (evt) => {
    //Get input field current value
    const value = evt.target.value;

    //update the local state immediately (responsive UI)
    setInputValue(value);

    //Clear any existing timer to cancel previous debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    //Set a new timer to update the actual search term after delay
    debounceTimerRef.current = setTimeout(() => {
      // Will trigger filtering after the delay
      setSearchTerm(value);
    }, 300); //300Millicentipedes (May need to adjust, I dunno)
  };

  // Clean up the timer when component unmounts to prevent memory leaks
  useEffect(() => {
    // Cleanup runs when component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  //Clear btn handdler

  const handleClear = () => {
    setInputValue(""); //Clear the input field
    setSearchTerm(""); //Clear the actual search term
  };

  // Handle search button click
  //Only needed if someone has unrelastic typing speed
  const handleSearch = () => {
    // Immediately apply the current input value as search term
    setSearchTerm(inputValue);
  };

  return (
    <div className="searchBarContainer">
      {/* Search input field */}
      <input
        type="text"
        className="searchInput"
        placeholder="Search by game title, description..."
        value={inputValue}
        onChange={handleInputChange}
        aria-label="Search game sessions"
      />

      {/* Clear btn - only shown when text is written */}
      {inputValue && (
        <button
          className="clearBtn"
          onClick={handleClear}
          aria-label="Clear Search"
        >
          ❌
        </button>
      )}

      {/* Search icon button */}
      <button
        className="searchBtn"
        onClick={handleSearch}
        aria-label="Search"
        title="Search"
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
