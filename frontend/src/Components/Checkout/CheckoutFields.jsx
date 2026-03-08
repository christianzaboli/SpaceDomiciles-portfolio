export default function CheckoutFields({
  data,
  fields,
  errorPrefix,
  errors,
  onChange,
  isDisabled,
}) {
  return (
    <form>
      {fields.map((key) => (
        <div key={key}>
          <input
            name={key}
            placeholder={key}
            value={data[key]}
            onChange={onChange}
            disabled={isDisabled?.(key) ?? false}
          />
          {errors[`${errorPrefix}_${key}`] && (
            <p className="error">{errors[`${errorPrefix}_${key}`]}</p>
          )}
        </div>
      ))}
    </form>
  );
}
