import React, { useState, useRef, useEffect } from "react";

interface ServiceItem {
  id: number | string;
  label: string;
  price: number;
}

interface ServiceSearchAddProps {
  options: { value: string | number; label: string; price: number }[];
  addedServices: ServiceItem[];
  onAdd: (service: ServiceItem) => void;
  onRemove: (id: string | number) => void;
  discount?: number;
}

const ServiceSearchAdd: React.FC<ServiceSearchAddProps> = ({ 
  options, 
  addedServices, 
  onAdd, 
  onRemove,
  discount = 0
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
    onAdd({ id: opt.value, label: opt.label, price: opt.price });
    setSearchTerm("");
    setIsOpen(false);
  };

  const totalPrice = addedServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="w-full space-y-4" ref={containerRef}>
      {/* Search Input Section - Cleaner & Standard */}
      <div className="relative">
        <label className="block text-gray-700 font-semibold mb-1.5 text-left">
          Search and Add Tests
        </label>
        <div className="flex items-center bg-white border border-gray-300 rounded focus-within:ring-1 focus-within:ring-[#333333] focus-within:border-[#333333] transition-all overflow-hidden">
          <div className="pl-3 py-2 text-gray-400">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <input 
            className="w-full px-3 py-2.5 focus:outline-none text-sm placeholder-gray-400"
            placeholder="Type name here to search tests..."
            value={searchTerm}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
          />
        </div>

        {/* Dropdown Results */}
        {isOpen && (searchTerm.length > 0 || filteredOptions.length > 0) && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 group"
                    onClick={() => handleAdd(option)}
                  >
                    <div className="flex items-center gap-3">
                        <span className="text-[#333333] font-medium">{option.label}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">৳{option.price}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-gray-400 text-sm">
                  No matching tests found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Tests Table Section - Standard & Professional */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-[16px] font-bold text-gray-600 w-12 text-center">SL</th>
              <th className="px-3 py-2 text-left text-[16px] font-bold text-gray-600">Test Name</th>
              <th className="px-3 py-2 text-right text-[16px] font-bold text-gray-600 w-24">Price</th>
              <th className="px-3 py-2 text-center text-[16px] font-bold text-gray-600 w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {addedServices.length > 0 ? (
              addedServices.map((service, idx) => (
                <tr key={service.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-2.5 text-[16px] text-gray-400 font-mono text-center">{(idx + 1).toString().padStart(2, '0')}</td>
                  <td className="px-3 py-2.5 text-[16px] font-semibold text-pos-primary">{service.label}</td>
                  <td className="px-3 py-2.5 text-[16px] font-bold text-[#333333] text-right font-mono">৳{service.price.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-center">
                    <button 
                      type="button"
                      onClick={() => onRemove(service.id)}
                      className="text-red-400 hover:text-red-600 transition-colors text-sm"
                      title="Remove"
                    >
                       🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400 italic text-xs">
                   No tests added yet. Search above to add tests.
                </td>
              </tr>
            )}
          </tbody>
          {addedServices.length > 0 && (
            <tfoot className="bg-gray-50/50">
              <tr>
                <td colSpan={2} className="px-3 py-1.5 text-right text-[16px] font-bold text-gray-500">
                   Sub Total:
                </td>
                <td className="px-3 py-1.5 text-right text-[16px] font-bold text-pos-primary font-mono border-l border-gray-100">
                   ৳{totalPrice.toLocaleString()}
                </td>
                <td></td>
              </tr>
              {discount > 0 && (
                <tr className="border-t border-gray-100">
                  <td colSpan={2} className="px-3 py-1.5 text-right text-[16px] font-bold text-[#ef4444]">
                    Discount:
                  </td>
                  <td className="px-3 py-1.5 text-right text-[16px] font-bold text-[#ef4444] font-mono border-l border-gray-100">
                    -৳{Number(discount).toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              )}
              <tr className="bg-emerald-50/50 border-t border-gray-200">
                <td colSpan={2} className="px-3 py-3 text-right text-[16px] font-bold text-pos-primary">
                   Net Payable:
                </td>
                <td className="px-3 py-3 text-right text-xl font-black text-emerald-600 font-mono border-l border-emerald-100">
                   ৳{(totalPrice - Number(discount)).toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default ServiceSearchAdd;
