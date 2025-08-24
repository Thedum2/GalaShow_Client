import React, {useState} from "react";
import {StepsBoxProps} from "@/types/components";

export default function StepsBox({
                                     steps,
                                 }: StepsBoxProps) {
    const [active, setActive] = useState(0);

    return (
        <div className="relative rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md p-6 sm:p-8">
            <h4 className="text-center text-lg sm:text-xl font-bold text-white mb-6">
                플레이 방법
            </h4>

            <div className="grid gap-4 sm:grid-cols-3">
                {steps.map((s, i) => (
                    <div
                        key={i}
                        className={`rounded-xl p-4 border transition-all duration-300
              ${i === active ? "border-white/30 bg-white/5" : "border-white/10 bg-white/[0.03]"}
            `}
                    >
                        <div className="flex items-center gap-3 text-white">
                            <div className={`h-10 w-10 flex items-center justify-center rounded-full
                ${i === active ? "bg-indigo-600" : "bg-white/10"}
              `}>
                                {s.icon}
                            </div>
                            <div className="font-semibold">{s.title}</div>
                        </div>
                        <p className="mt-3 text-sm text-white/70">{s.desc}</p>
                    </div>
                ))}
            </div>

            {/* 점 네비게이터 */}
            <div className="mt-6 flex items-center justify-center gap-2">
                {steps.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Step ${i + 1}`}
                        onClick={() => setActive(i)}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-200
              ${i === active ? "w-6 bg-indigo-500" : "bg-white/30 hover:bg-white/60"}
            `}
                    />
                ))}
            </div>
        </div>
    );
}