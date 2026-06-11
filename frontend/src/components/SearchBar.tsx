import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="input-group">
      <span className="input-group-text bg-dark border-secondary text-light-gray">
        <i className="bi bi-search"></i>
      </span>
      <input
        type="text"
        className="form-control spotify-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
