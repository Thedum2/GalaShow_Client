import React, { useState } from 'react';
import { Step } from '@/types/components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepsBoxProps {
    stepSets: Step[][];
}

const StepsBox: React.FC<StepsBoxProps> = ({ stepSets }) => {
    const [currentSetIndex, setCurrentSetIndex] = useState(0);

    const handleNext = () => {
        setCurrentSetIndex((prevIndex) => (prevIndex + 1) % stepSets.length);
    };

    const handlePrev = () => {
        setCurrentSetIndex((prevIndex) => (prevIndex - 1 + stepSets.length) % stepSets.length);
    };

    const goToStep = (index: number) => {
        setCurrentSetIndex(index);
    }

    const currentSteps = stepSets[currentSetIndex];

    return (
        <div className="w-[1447px] h-[268px] mx-auto p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-2xl relative">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left min-h-[140px]">
                {currentSteps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex-1 p-2 md:p-4">
                            <div className="flex justify-center md:justify-start mb-2">
                                <div className="p-2 bg-white/10 rounded-full">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="font-bold text-base md:text-lg mb-1">{step.title}</h3>
                            <p className="text-xs md:text-sm text-white/70">{step.desc}</p>
                        </div>
                        {index < currentSteps.length - 1 && (
                            <div className="hidden md:block h-16 w-px bg-white/20 mx-4"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Navigation Arrows */}
            {stepSets.length > 1 && (
                <>
                    <div className="absolute inset-y-0 left-0 flex items-center">
                        <button onClick={handlePrev} className="p-2 m-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button onClick={handleNext} className="p-2 m-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </>
            )}

            {/* Page Dots */}
            {stepSets.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                    {stepSets.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToStep(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                currentSetIndex === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StepsBox;