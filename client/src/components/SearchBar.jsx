import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value = '', onChange, placeholder = 'Search...', className = '' }) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 transition-all duration-200 text-xs"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-white rounded-full hover:bg-white/10 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
