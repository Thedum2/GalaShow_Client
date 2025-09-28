import React from "react";
import { Clock } from "lucide-react";
import {DEFAULT_TIME_OPTIONS, SelectionTimeProps} from "@/types/components";
const SelectionTime: React.FC<SelectionTimeProps> = ({
    title,
    descriptionPrefix,
    descriptionSuffix,
    availableTimes = DEFAULT_TIME_OPTIONS,
    selectedTime,
    onSelectTime,
    timeUnit = "초",
    className = "",
}) => (
    <div className={`bg-black bg-opacity-25 border-2 border-yellow-500 rounded-xl h-full min-h-0 p-4 flex flex-col justify-center gap-4 shadow-[0_0_15px_rgba(234,179,8,0.3)] overflow-hidden ${className}`}>
        <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <div className="grid grid-cols-5 gap-2">
            {availableTimes.map((time) => {
                const isSelected = selectedTime === time;
                const isPassed = time < selectedTime;

                return (
                    <button
                        key={time}
                        type="button"
                        onClick={() => onSelectTime(time)}
                        className={`rounded-lg py-2 px-3 font-semibold transition-all duration-200 ${
                            isSelected
                                ? "scale-105 bg-emerald-400 text-black ring-2 ring-emerald-300"
                                : isPassed
                                ? "bg-emerald-800 text-white hover:bg-emerald-700"
                                : "bg-emerald-900 text-white hover:bg-emerald-800"
                        }`}
                    >
                        {time}
                        {timeUnit}
                    </button>
                );
            })}
        </div>

        <div className="flex-grow">
            <div className="flex h-full items-end">
                <div className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-center text-white">
                    <span className="text-xl">{descriptionPrefix}</span>
                    <span className="mx-1 text-4xl font-bold text-yellow-500">{selectedTime}</span>
                    <span className="text-xl font-bold">{descriptionSuffix}</span>
                </div>
            </div>
        </div>
    </div>
);

export default SelectionTime;
