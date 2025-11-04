import React from "react";
import Icon from "@/components/icons/Icon";
import {ParticipationProps} from "@/types/components";

const Participation: React.FC<ParticipationProps> = ({
                                                         title,
                                                         instructions,
                                                         helperText,
                                                         maxLabel,
                                                         maxOptions,
                                                         selectedMaxOption,
                                                         onMaxOptionChange,
                                                         totalCount,
                                                         totalCountCaption,
                                                     }) => {
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onMaxOptionChange?.(event.target.value);
    };

    return (
        <div
            className={[
                "bg-black bg-opacity-25 border-2 border-yellow-500 rounded-xl h-full min-h-0 p-5",
                "flex flex-col gap-3",
                "shadow-[0_0_15px_rgba(234,179,8,0.4)]",
                "focus-within:ring-2 focus-within:ring-yellow-500 outline-none",
                "overflow-hidden",
            ].join(" ")}
        >

            <div className="shrink-0 h-[40px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/15">
                        <Icon name="Megaphone" type="lucide" size={20} color="#fde047" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
            </div>

            <div
                className="shrink-0 h-[75px] flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-yellow-600 text-white px-3">
                <Icon name="MessageCircle" type="lucide" size={20} />
                <span className="font-semibold text-xl">
          {instructions.prefix}
                    <span className="rounded-3xl bg-purple-600 px-3 py-1 text-2xl font-semibold text-white mx-1">
            {instructions.highlight}
          </span>
                    {instructions.suffix}
        </span>
            </div>

            <p className="shrink-0 flex items-center text-sm text-white font-bold">
                {helperText}
            </p>

            <div className="shrink-0 h-[55px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="Target" type="lucide" size={20} color="white" />
                    <label className="font-semibold text-white text-xl">{maxLabel}</label>
                </div>

                <div className="relative w-[220px] h-full flex items-center">
                    <select
                        value={selectedMaxOption}
                        onChange={handleSelectChange}
                        className="w-full appearance-none rounded-lg border text-lg border-gray-700 bg-gray-800 px-2 py-1 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        {maxOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <Icon name="ChevronDown" type="lucide" size={20} color="#9ca3af" className="pointer-events-none absolute right-3" />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <div className="flex h-full items-end">
                    <div className="w-full rounded-lg border border-white bg-black/60 p-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-yellow-500">{totalCount}</span>
                            <p className="font-semibold text-white">{totalCountCaption}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Participation;
