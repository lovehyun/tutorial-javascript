export default function SearchInput({ value, onChange }) {
    return (
        <input
            placeholder="이름 검색"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="form-control mb-4"
            style={{ maxWidth: 300 }}
        />
    );
}
