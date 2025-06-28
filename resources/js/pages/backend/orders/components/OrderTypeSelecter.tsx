import React from "react";
import { cn } from "@/lib/utils"; // Optional: for class merging

type Props = {
  value: string;
  onChange: (val: 'dinein' | 'takeaway' | 'delivery') => void;
};

const options = ['dinein', 'takeaway', 'delivery'];

const OrderTypeSelector = ({ value, onChange }: Props) => {
  return (
    <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl shadow-inner">
      {options.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type as 'dinein' | 'takeaway' | 'delivery')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none",
            value === type
              ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow"
              : "text-gray-600 dark:text-neutral-400"
          )}
        >
          {type === 'dinein' ? 'Dine In' : type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default OrderTypeSelector;
