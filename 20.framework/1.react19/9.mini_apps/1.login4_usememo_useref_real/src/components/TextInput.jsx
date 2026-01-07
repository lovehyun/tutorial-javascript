export default function TextInput({
    label,
    name,
    type = 'text',
    value,
    onChange,
    disabled = false,
    placeholder = '',
    inputRef = null,
    autoComplete,
}) {
    const handleChange = (e) => {
        onChange(name, e.target.value);
    };

    return (
        <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>{label}</span>
            <input
                ref={inputRef}
                name={name}
                type={type}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                onChange={handleChange}
                autoComplete={autoComplete}
                style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #ddd',
                    outline: 'none',
                }}
            />
        </label>
    );
}
