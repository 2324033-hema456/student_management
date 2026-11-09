
function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
  children,
  as = "input",
  className = "",
  ...props
}) {
  const InputElement = as;

  const input = (
    <InputElement
      id={name}
      name={name}
      type={as === "input" ? type : undefined}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      className={className}
      {...props}
    >
      {as === "select" ? children : undefined}
    </InputElement>
  );

  if (!label) {
    return input;
  }

  return (
    <div className="teacher-form-group">
      <label htmlFor={name}>{label}</label>
      {input}
    </div>
  );
}

export default FormInput;
