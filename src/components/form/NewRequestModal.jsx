import { useState, useEffect } from "react";
import "./NewRequestModal.scss";

// Mock Data (to be replacede with backend API Calls)
import {
  platformOptions,
  genreOptions,
  regionOptions,
  customTagOptions,
} from "../../assets/mockData/filterOptions";

//What is this?
/* *This component handles:
  Displaying the form in a modal overlay
  Collecting all game session data
  Validating required fields
  Submitting the form data (temporarily to localStorage, will connect to API later)
  Notifying the parent component when the form is submitted or canceled */

const NewRequestModal = ({ isOpen, onClose, onSessionCreated }) => {
  //If the model is not open, don't render anything
  if (!isOpen) return null;

  // Initialize form state with default values
  const [formData, setFormData] = useState({
    gameTitle: "",
    description: "",
    platform: "",
    gameGenre: "",
    gameRegion: "",
    playersNeeded: 1,
    inviteCode: "",
    customTags: [],
    joinType: "open", // "open" (anyone can join) or "request" (request access)
    status: "ongoing", // Default status
  });

  //State for tracking validation errors
  const [errors, setErrors] = useState({});

  //State for tracking form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Handles input changes for text, number and, select fields
  const handleInputChange = (evt) => {
    const { name, value, type } = evt.target;

    //Convert to number for number inputs
    const processedValue = type === "number" ? parseInt(value, 10) : value;

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    //Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  //Handle changes to custom tag selections

  const handleTagToggle = (tag) => {
    const newTags = formData.customTags.includes(tag)
      ? formData.customTags.filter((t) => t !== tag)
      : [...formData.customTags, tag];

    setFormData({
      ...formData,
      customTags: newTags,
    });
  };

  // Handle changes to the join type radio buttons

  const handleJoinTypeChange = (joinType) => {
    setFormData({
      ...formData,
      joinType,
    });
  };

  //Validates the form data

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.gameTitle.trim())
      newErrors.gameTitle = "Game name is required";
    if (!formData.platform) newErrors.platform = "Platform is required";
    if (!formData.gameGenre) newErrors.gameGenre = "Genre is required";
    if (!formData.gameRegion) newErrors.gameRegion = "Region is required";
    if (!formData.inviteCode.trim())
      newErrors.inviteCode = "Invite code is required";

    // Validate players needed (must be at least 1)
    if (!formData.playersNeeded || formData.playersNeeded < 1) {
      newErrors.playersNeeded = "At least 1 player is needed";
    }

    return newErrors;
  };

  //Handles form submission

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    //Validate the form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const newGameSession = {
        id: Date.now().toString(), // Temporary ID (will be assigned by the backend)
        title: formData.gameTitle,
        description: formData.description,
        platform: formData.platform,
        genres: [formData.gameGenre], // Backend expects an array
        region: formData.gameRegion,
        maxPlayers: formData.playersNeeded,
        currentPlayers: 1, // Creator is the first player
        inviteCode: formData.inviteCode,
        customTags: formData.customTags,
        status: formData.status,
        joinType: formData.joinType,
        createdAt: new Date().toISOString(),
        scheduledTime: new Date().toISOString(), // Default to now
      };

      // =============Temporary: Save to localStorage ===
      // (This will be replaced with an API call to POST  /api/request-ticket)
      const existingSessions =
        JSON.parse(localStorage.getItem("gameSessions")) || [];
      localStorage.setItem(
        "gameSessions",
        JSON.stringify([...existingSessions, newGameSession])
      );

      //Creating the illusion of loading (can replace with a loading component for effect)
      setTimeout(() => {
        //Notify parent component that a session was created
        if (onSessionCreated) {
          onSessionCreated(newGameSession);
        }

        // Reset form and close modal
        setFormData({
          gameTitle: "",
          description: "",
          platform: "",
          gameGenre: "",
          gameRegion: "",
          playersNeeded: 1,
          inviteCode: "",
          customTags: [],
          joinType: "open",
          status: "ongoing",
        });
        setIsSubmitting(false);
        onClose();
      }, 500); //1/2 a second adjust time if needed for the future loading component
    } catch (error) {
      console.error("Error creating game session:", error);
      setErrors({
        submit: "Failed to create game session. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Group Creation</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-session-form">
          <div className="form-grid">
            {/* Left column */}
            <div className="form-column">
              {/* Game Name */}
              <div className="form-group">
                <input
                  type="text"
                  id="gameTitle"
                  name="gameTitle"
                  value={formData.gameTitle}
                  onChange={handleInputChange}
                  placeholder="Game name"
                  className={errors.gameTitle ? "error" : ""}
                />
                {errors.gameTitle && (
                  <div className="error-message">{errors.gameTitle}</div>
                )}
              </div>

              {/* Game Genre Dropdown */}
              <div className="form-group">
                <select
                  id="gameGenre"
                  name="gameGenre"
                  value={formData.gameGenre}
                  onChange={handleInputChange}
                  className={errors.gameGenre ? "error" : ""}
                >
                  <option value="">Game Genre</option>
                  {genreOptions.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
                {errors.gameGenre && (
                  <div className="error-message">{errors.gameGenre}</div>
                )}
              </div>

              {/* Game Platform Dropdown */}
              <div className="form-group">
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className={errors.platform ? "error" : ""}
                >
                  <option value="">Game Platform</option>
                  {platformOptions.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                {errors.platform && (
                  <div className="error-message">{errors.platform}</div>
                )}
              </div>

              {/* Game Region Dropdown */}
              <div className="form-group">
                <select
                  id="gameRegion"
                  name="gameRegion"
                  value={formData.gameRegion}
                  onChange={handleInputChange}
                  className={errors.gameRegion ? "error" : ""}
                >
                  <option value="">Game Region</option>
                  {regionOptions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
                {errors.gameRegion && (
                  <div className="error-message">{errors.gameRegion}</div>
                )}
              </div>

              {/* Game Invite Code */}
              <div className="form-group">
                <input
                  type="text"
                  id="inviteCode"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleInputChange}
                  placeholder="Game Invite Code"
                  className={errors.inviteCode ? "error" : ""}
                />
                {errors.inviteCode && (
                  <div className="error-message">{errors.inviteCode}</div>
                )}
              </div>

              {/* Custom Filters */}
              <div className="form-group custom-filters">
                <div className="custom-filters-header">
                  <span>Custom Filters</span>
                  <button type="button" className="add-filter-btn">
                    +
                  </button>
                </div>
                <div className="tags-container">
                  {customTagOptions.map((tag) => (
                    <div
                      key={tag.value}
                      className={`tag ${
                        formData.customTags.includes(tag.value)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleTagToggle(tag.value)}
                    >
                      {tag.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="form-column">
              {/* Group Description */}
              <div className="form-group">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Group Description"
                  rows={5}
                  className={errors.description ? "error" : ""}
                ></textarea>
                {errors.description && (
                  <div className="error-message">{errors.description}</div>
                )}
              </div>

              {/* Number of Players Needed */}
              <div className="form-group">
                <input
                  type="number"
                  id="playersNeeded"
                  name="playersNeeded"
                  value={formData.playersNeeded}
                  onChange={handleInputChange}
                  placeholder="#Of Players Needed"
                  min="1"
                  max="100"
                  className={errors.playersNeeded ? "error" : ""}
                />
                {errors.playersNeeded && (
                  <div className="error-message">{errors.playersNeeded}</div>
                )}
              </div>

              {/* Join Options */}
              <div className="form-group join-options">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="joinOpen"
                    checked={formData.joinType === "open"}
                    onChange={() => handleJoinTypeChange("open")}
                  />
                  <label htmlFor="joinOpen">Anyone Can join</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="joinRequest"
                    checked={formData.joinType === "request"}
                    onChange={() => handleJoinTypeChange("request")}
                  />
                  <label htmlFor="joinRequest">Request Access</label>
                </div>
              </div>
            </div>
          </div>

          {/* Form submission error (if any) */}
          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestModal;
