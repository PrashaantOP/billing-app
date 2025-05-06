import * as React from 'react';

type SwitchProps = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    id?: string;
};

export function Switch({ checked, onCheckedChange, id }: SwitchProps) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                id={id}
                className="sr-only"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
            />
            <div className={`w-10 h-6 rounded-full ${checked ? 'bg-green-500' : 'bg-gray-300'} relative`}>
                <div
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-4' : ''
                    }`}
                />
            </div>
        </label>
    );
}
