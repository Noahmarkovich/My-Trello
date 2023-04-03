
export function Label({ label }) {

    return <label className="label-color-container" style={{ backgroundColor: `${label.colorLight}` }} htmlFor={label.id}>
        <div style={{ backgroundColor: `${label.colorDark}` }} className="circle-in-label"></div>
        <div className="label-title">{label.title}</div>
    </label>

}