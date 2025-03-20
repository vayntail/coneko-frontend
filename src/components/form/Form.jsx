import React, { useState } from "react";
import "./Form.scss";

//What is this?
/**
 * Reusable Form component that handles state, validation, and submission
 *
 */
const Form = ({
  initialData = {},
  onSubmit,
  validate,
  children,
  submitLabel = "Submit",
  loading = false,
  className = "",
}) => {
  // State for form data and errors
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes for form fields
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const fieldValue = type === "checkbox" ? checked : value;

    // Update form data
    setFormData({
      ...formData,
      [name]: fieldValue,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form if validation function is provided
    if (validate) {
      const validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    // Call onSubmit with validated form data
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  /**
   * Clone children to provide them with form context
   * This allows child form fields to access form state and handlers
   */
  const childrenWithProps = React.Children.map(children, (child) => {
    // Skip non-element children
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child, {
      formData,
      handleChange,
      errors,
      disabled: loading,
    });
  });

  return (
    <form className={`reusable-form ${className}`} onSubmit={handleSubmit}>
      {childrenWithProps}

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default Form;
