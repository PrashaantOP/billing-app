import React, { useEffect, useState } from 'react';

type Props = {
  orderType: 'dinein' | 'takeaway' | 'delivery';
  setOrderType: (type: 'dinein' | 'takeaway' | 'delivery') => void;
  selectedTable: string;
  setSelectedTable: (id: string) => void;
};

const OrderTypeSwitcher = ({
  orderType,
  setOrderType,
  selectedTable,
  setSelectedTable,
}: Props) => {
  const [tables, setTables] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderType === 'dinein') {
      fetchDiningTables();
    } else {
      // reset selectedTable when not dinein
      setSelectedTable('');
    }
  }, [orderType]);

  const fetchDiningTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dining-tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Failed to fetch dining tables:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl shadow-inner">
        {['dinein', 'takeaway', 'delivery'].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              orderType === type
                ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow'
                : 'text-gray-600 dark:text-neutral-400'
            }`}
            onClick={() => setOrderType(type as 'dinein' | 'takeaway' | 'delivery')}
          >
            {type === 'dinein' ? 'Dine In' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {orderType === 'dinein' && (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Table
          </label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-800 dark:text-white dark:border-neutral-600"
          >
            <option value="">-- Select Table --</option>
            {loading ? (
              <option disabled>Loading...</option>
            ) : (
              tables.map((table) => (
                <option key={table.id} value={String(table.id)}>
                  {table.name}
                </option>
              ))
            )}
          </select>
        </div>
      )}
    </div>
  );
};

export default OrderTypeSwitcher;
