export default function TextInput({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange,
    autoFocus
}) {
    return (
        <label style={{ display: 'grid', gap: 6 }}>
            <span>{label}</span>
            <input 
                autoFocus={autoFocus}
                type={type}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                style={{ padding: 8 }} />
        </label>
    );
}
