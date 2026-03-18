import React, { useState, useRef, useEffect } from 'react';

interface Dropdown {
  label: string;
  options: string[];
  value: string;
  name: string;
  // This signature matches the standard React change event pattern
  onChange: (e: { target: { name: string; value: string } }) => void;
}

const Dropdown: React.FC<Dropdown> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  name 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="mb-3" ref={containerRef} style={{ position: 'relative' }}>
      <label className="form-label small text-uppercase fw-bold text-muted mb-1" 
             style={{ fontSize: '0.7rem', letterSpacing: '0.05rem', display: 'block' }}>
        {label}
      </label>
      
      <div className="custom-select-container">
        <div 
          className={`select-trigger ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{value || "Select..."}</span>
          <span className={`caret ${isOpen ? 'rotated' : ''}`} style={{ fontSize: '0.6rem' }}>
            ▼
          </span>
        </div>

        {isOpen && (
          <ul className="select-options-list" role="listbox">
            {options.map((opt) => (
              <li 
                key={opt} 
                className={`select-option ${value === opt ? 'selected' : ''}`}
                onClick={() => handleSelect(opt)}
                role="option"
                aria-selected={value === opt}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;