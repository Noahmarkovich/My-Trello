export function CreateLabel({ label }) {
  return (
    <div
      className="label-color-option"
      style={{ backgroundColor: `${label.colorDark}` }}
      title={label.name}></div>
  );
}
