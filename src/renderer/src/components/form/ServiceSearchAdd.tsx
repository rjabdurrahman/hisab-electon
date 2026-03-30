import React, { useState, useRef, useEffect } from "react";

interface ServiceItem {
  id: number | string;
  label: string;
}

interface ServiceSearchAddProps {
  options: { value: string | number; label: string }[];
  addedServices: ServiceItem[];
  onAdd: (service: ServiceItem) => void;
  onRemove: (id: string | number) => void;
}

const ServiceSearchAdd: React.FC<ServiceSearchAddProps> = ({ 
  options, 
  addedServices, 
  onAdd, 
  onRemove 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !addedServices.find(as => as.id === opt.value)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = (opt: any) => {
    onAdd({ id: opt.value, label: opt.label });
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-4" ref={containerRef}>
      <div className="relative">
        <label className="block text-gray-700 font-medium mb-1 text-left">
          Search and Add Services
        </label>
        <div 
          className={`flex items-center bg-white border rounded p-1 transition-all
          ${isOpen ? 'ring-1 ring-pos-primary border-pos-primary' : 'border-gray-300'}`}
          onClick={() => setIsOpen(true)}
        >
          <div className="p-2 text-gray-400">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <input 
            className="w-full px-2 py-1.5 focus:outline-none text-sm placeholder-gray-400"
            placeholder="Search service to add..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
          />
        </div>

        {isOpen && (searchTerm.length > 0 || filteredOptions.length > 0) && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100 origin-top">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-4 py-2.5 text-sm cursor-pointer hover:bg-pos-primary hover:text-white transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                    onClick={() => handleAdd(option)}
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-[10px] font-bold group-hover:bg-white/20 transition-colors">
                       ➕
                    </div>
                    <span>{option.label}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-gray-400 text-sm italic">
                  No services found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
           Selected Services
           <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
              {addedServices.length} Total
           </span>
        </h3>
        
        {addedServices.length > 0 ? (
          <div className="space-y-1">
            {addedServices.map((service, idx) => (
              <div key={service.id} className="flex justify-between items-center bg-white p-2.5 rounded shadow-sm border border-gray-100 group animate-in slide-in-from-left duration-200" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center gap-3">
                   <span className="text-xs text-gray-400 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                   <span className="text-sm font-semibold text-pos-primary">{service.label}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => onRemove(service.id)}
                  className="text-red-400 hover:text-red-600 p-1 rounded-full transition-transform hover:scale-110"
                >
                   🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded text-gray-400 gap-2">
             <div className="text-2xl">📋</div>
             <p className="text-xs font-semibold italic">No services added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSearchAdd;
