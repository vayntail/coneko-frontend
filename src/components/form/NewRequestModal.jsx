import { useState, useEffect } from "react";
import { useFilters } from "../../context/FilterContext";
import "./NewRequestModal.scss";

// Import options for dropdown fields
import {
  platformOptions,
  genreOptions,
  regionOptions,
  customTagOptions,
} from "../../assets/mockData/filterOptions";

// Import a placeholder image for new sessions
import placeholderImg from "../../assets/placeholders/placeholder-img.png";

/**
 * This component handles:
 * - Displaying the form in a modal overlay
 * - Collecting all game session data
 * - Validating required fields
 * - Submitting the form data to the API (with localStorage fallback)
 * - Notifying the parent component when the form is submitted or canceled
 */
const NewRequestModal = ({ isOpen, onClose, onSessionCreated }) => {
  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  // Get the createSession function from context
  const { createSession, error: contextError } = useFilters();

  // Initialize form state with default values
  const [formData, setFormData] = useState({
    gameTitle: "",
    description: "",
    platforms: [],
    genres: [],
    regions: [],
    playersNeeded: 1,
    inviteCode: "",
    customTags: [],
    joinType: "open", // "open" (anyone can join) or "request" (request access)
    status: "ongoing", // Default status
  });

  // State for tracking validation errors
  const [errors, setErrors] = useState({});

  // State for tracking form submission and API status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Handles input changes for text, number and select fields
  const handleInputChange = (evt) => {
    const { name, value, type } = evt.target;

    // Convert to number for number inputs
    const processedValue = type === "number" ? parseInt(value, 10) : value;

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle changes to custom tag selections
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

  // Validates the form data
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.gameTitle.trim())
      newErrors.gameTitle = "Game name is required";
    if (formData.platforms.length === 0)
      newErrors.platforms = "At least one platform is required";
    if (formData.genres.length === 0)
      newErrors.genres = "At least one genre is required";
    if (formData.regions.length === 0)
      newErrors.regions = "At least one region is required";
    if (!formData.inviteCode.trim())
      newErrors.inviteCode = "Invite code is required";

    // Validate players needed (must be at least 1)
    if (!formData.playersNeeded || formData.playersNeeded < 1) {
      newErrors.playersNeeded = "At least 1 player is needed";
    }

    return newErrors;
  };

  // Handles form submission
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    // Validate the form
    const formErrors = validateForm();

    // If there are errors, update the errors state and stop submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Reset API error
    setApiError(null);

    // No errors, proceed with submission
    setIsSubmitting(true);

    try {
      // Prepare the session data
      const sessionData = {
        ...formData,
        // Add fields required by GameSessionCard
        maxPlayers: formData.playersNeeded,
        currentPlayers: 1,
        img: placeholderImg,
        createdAt: new Date().toISOString(),
        scheduledTime: new Date().toISOString(),
        // Add a random user (will be replaced with auth later)
        user: "Guest_" + Math.floor(Math.random() * 1000),
      };

      // Create the session via context (which handles API + fallback)
      const newSession = await createSession(sessionData);

      // Show success status briefly before closing
      setTimeout(() => {
        // Notify parent that a session was created
        if (onSessionCreated) {
          onSessionCreated(newSession);
        }

        // Reset form and close modal
        setFormData({
          gameTitle: "",
          description: "",
          platforms: [],
          genres: [],
          regions: [],
          playersNeeded: 1,
          inviteCode: "",
          customTags: [],
          joinType: "open",
          status: "ongoing",
        });

        setIsSubmitting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error creating game session:", error);
      setApiError(
        error.message || "Failed to create game session. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  // Show error message from context if available
  useEffect(() => {
    if (contextError) {
      setApiError(contextError);
    }
  }, [contextError]);

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>Group Creation</h2>
          <button className="closeButton" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="createSessionForm">
          <div className="formGrid">
            {/* Left column */}
            <div className="formColumn">
              {/* Game Name */}
              <div className="formGroup">
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
                  <div className="errorMessage">{errors.gameTitle}</div>
                )}
              </div>

              {/* Game Genres - Multiple Selection */}
              <div className="formGroup">
                <select
                  id="genres"
                  name="genres"
                  onChange={(e) => {
                    if (e.target.value) {
                      // Only add the genre if it's not already selected
                      if (!formData.genres.includes(e.target.value)) {
                        setFormData({
                          ...formData,
                          genres: [...formData.genres, e.target.value],
                        });
                      }
                      // Reset the select to default option after selection
                      e.target.value = "";
                    }
                  }}
                  className={errors.genres ? "error" : ""}
                >
                  <option value="">Select Game Genres</option>
                  {genreOptions
                    .filter((genre) => !formData.genres.includes(genre.value))
                    .map((genre) => (
                      <option key={genre.value} value={genre.value}>
                        {genre.label}
                      </option>
                    ))}
                </select>

                {/* Display selected genres */}
                {formData.genres.length > 0 && (
                  <div className="selectedTags">
                    {formData.genres.map((genreValue) => {
                      const genre = genreOptions.find(
                        (g) => g.value === genreValue
                      );
                      return (
                        <div key={genreValue} className="selectedTag">
                          <span>{genre ? genre.label : genreValue}</span>
                          <button
                            type="button"
                            className="removeTagBtn"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                genres: formData.genres.filter(
                                  (g) => g !== genreValue
                                ),
                              });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.genres && (
                  <div className="errorMessage">{errors.genres}</div>
                )}
                {formData.genres.length > 0 && (
                  <div className="apiNote">
                    Note: The current API only supports the first genre, but all
                    will be stored locally.
                  </div>
                )}
              </div>

              {/* Game Platforms - Multiple Selection */}
              <div className="formGroup">
                <select
                  id="platforms"
                  name="platforms"
                  onChange={(e) => {
                    if (e.target.value) {
                      // Only add the platform if it's not already selected
                      if (!formData.platforms.includes(e.target.value)) {
                        setFormData({
                          ...formData,
                          platforms: [...formData.platforms, e.target.value],
                        });
                      }
                      // Reset the select to default option after selection
                      e.target.value = "";
                    }
                  }}
                  className={errors.platforms ? "error" : ""}
                >
                  <option value="">Select Game Platforms</option>
                  {platformOptions
                    .filter(
                      (platform) => !formData.platforms.includes(platform.value)
                    )
                    .map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                </select>

                {/* Display selected platforms */}
                {formData.platforms.length > 0 && (
                  <div className="selectedTags">
                    {formData.platforms.map((platformValue) => {
                      const platform = platformOptions.find(
                        (p) => p.value === platformValue
                      );
                      return (
                        <div key={platformValue} className="selectedTag">
                          <span>
                            {platform ? platform.label : platformValue}
                          </span>
                          <button
                            type="button"
                            className="removeTagBtn"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                platforms: formData.platforms.filter(
                                  (p) => p !== platformValue
                                ),
                              });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.platforms && (
                  <div className="errorMessage">{errors.platforms}</div>
                )}
                {formData.platforms.length > 0 && (
                  <div className="apiNote">
                    Note: The current API only supports the first platform, but
                    all will be stored locally.
                  </div>
                )}
              </div>

              {/* Game Regions - Multiple Selection */}
              <div className="formGroup">
                <select
                  id="regions"
                  name="regions"
                  onChange={(e) => {
                    if (e.target.value) {
                      // Only add the region if it's not already selected
                      if (!formData.regions.includes(e.target.value)) {
                        setFormData({
                          ...formData,
                          regions: [...formData.regions, e.target.value],
                        });
                      }
                      // Reset the select to default option after selection
                      e.target.value = "";
                    }
                  }}
                  className={errors.regions ? "error" : ""}
                >
                  <option value="">Select Game Regions</option>
                  {regionOptions
                    .filter(
                      (region) => !formData.regions.includes(region.value)
                    )
                    .map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                </select>

                {/* Display selected regions */}
                {formData.regions.length > 0 && (
                  <div className="selectedTags">
                    {formData.regions.map((regionValue) => {
                      const region = regionOptions.find(
                        (r) => r.value === regionValue
                      );
                      return (
                        <div key={regionValue} className="selectedTag">
                          <span>{region ? region.label : regionValue}</span>
                          <button
                            type="button"
                            className="removeTagBtn"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                regions: formData.regions.filter(
                                  (r) => r !== regionValue
                                ),
                              });
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.regions && (
                  <div className="errorMessage">{errors.regions}</div>
                )}
                {formData.regions.length > 0 && (
                  <div className="apiNote">
                    Note: The current API only supports the first region, but
                    all will be stored locally.
                  </div>
                )}
              </div>

              {/* Game Invite Code */}
              <div className="formGroup">
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
                  <div className="errorMessage">{errors.inviteCode}</div>
                )}
              </div>

              {/* Custom Filters */}
              <div className="formGroup">
                <select
                  id="customFilter"
                  name="customFilter"
                  onChange={(e) => {
                    if (e.target.value) {
                      // Only add the tag if it's not already selected
                      if (!formData.customTags.includes(e.target.value)) {
                        handleTagToggle(e.target.value);
                      }
                      // Reset the select to default option after selection
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">Select Custom Filters</option>
                  {customTagOptions
                    .filter((tag) => !formData.customTags.includes(tag.value))
                    .map((tag) => (
                      <option key={tag.value} value={tag.value}>
                        {tag.label}
                      </option>
                    ))}
                </select>

                {/* Display selected tags */}
                {formData.customTags.length > 0 && (
                  <div className="selectedTags">
                    {formData.customTags.map((tagValue) => {
                      const tag = customTagOptions.find(
                        (t) => t.value === tagValue
                      );
                      return (
                        <div key={tagValue} className="selectedTag">
                          <span>{tag ? tag.label : tagValue}</span>
                          <button
                            type="button"
                            className="removeTagBtn"
                            onClick={() => handleTagToggle(tagValue)}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {formData.customTags.length > 0 && (
                  <div className="apiNote">
                    Note: The current API only supports the first tag, but all
                    will be stored locally.
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="formColumn">
              {/* Group Description */}
              <div className="formGroup">
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
                  <div className="errorMessage">{errors.description}</div>
                )}
              </div>

              {/* Number of Players Needed */}
              <div className="formGroup">
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
                  <div className="errorMessage">{errors.playersNeeded}</div>
                )}
              </div>

              {/* Join Options */}
              <div className="formGroup joinOptions">
                <div className="checkboxGroup">
                  <input
                    type="checkbox"
                    id="joinOpen"
                    checked={formData.joinType === "open"}
                    onChange={() => handleJoinTypeChange("open")}
                  />
                  <label htmlFor="joinOpen">Anyone Can join</label>
                </div>

                <div className="checkboxGroup">
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
            <div className="errorMessage submitError">{errors.submit}</div>
          )}

          {/* Submit Button */}
          <div className="formActions">
            <button
              type="submit"
              className="submitButton"
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
