import React, { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface SearchSelectProps {
  name: string;
  label: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  onSelect?: (value: any) => void;
  required?: string | boolean;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  name,
  label,
  options,
  placeholder = "Select...",
  onSelect,
  required
}) => {
  const { setValue, watch, register, formState: { errors } } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedValue = watch(name);
  const selectedOption = options.find(opt => opt.value === selectedValue);

  // Filter options based on search term
  // If not open, we don't filter (or we show the selected one)
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(""); // Reset search term on close
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: { value: any, label: string }) => {
    setValue(name, option.value, { shouldValidate: true });
    setIsOpen(false);
    setSearchTerm("");
    if (onSelect) onSelect(option.value);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };


  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="block text-gray-700 font-medium mb-1 text-left">
        {label}
      </label>
      
      <div 
        className={`relative flex items-center border rounded transition-all duration-200 
        ${isOpen ? 'border-pos-primary ring-1 ring-pos-primary shadow-sm bg-white' : 'border-gray-300 hover:border-gray-400 bg-[#F4F4F4F2]'}
        ${errors && errors[name] ? 'border-red-500 bg-red-50' : ''}`}
      >
        <div className="flex-1 relative flex items-center">
            {/* Display selected label when NOT searching/open */}
            {!isOpen && selectedOption && (
                <div className="absolute left-3 pointer-events-none text-gray-900 font-semibold truncate pr-8 w-full text-left">
                   {selectedOption.label}
                </div>
            )}
            
            <input
                ref={inputRef}
                className={`w-full px-3 py-2 bg-transparent focus:outline-none min-h-[40px] text-left
                ${!isOpen && selectedOption ? 'opacity-0' : 'opacity-100'} 
                ${!selectedOption && !isOpen ? 'text-gray-400 italic' : 'text-gray-900 font-semibold'}`}
                placeholder={selectedOption ? selectedOption.label : placeholder}
                value={isOpen ? searchTerm : ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleInputFocus}
                autoComplete="off"
            />
        </div>

        <div 
            className="px-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => {
                setIsOpen(!isOpen);
                if (!isOpen) inputRef.current?.focus();
            }}
        >
          <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100 origin-top">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between
                  ${selectedValue === option.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'}`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="flex flex-col text-left">
                    <span>{option.label}</span>
                    {searchTerm && option.label.toLowerCase().includes(searchTerm.toLowerCase()) && (
                        <span className="text-[10px] text-gray-400 italic">Matches "{searchTerm}"</span>
                    )}
                  </div>
                  {selectedValue === option.value && (
                     <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                     </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
      
      <input {...register(name, { required })} type="hidden" />
      {errors && errors[name] && (
        <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase tracking-wider">
          {(errors[name] as any)?.message}
        </p>
      )}
    </div>
  );
};

export default SearchSelect;
