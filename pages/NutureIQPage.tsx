import React, { useState, useEffect } from 'react';
import { nutureIQCards } from '../lib/mockData';

type Category = 'All' | 'Nutrition' | 'Fitness' | 'Mental Health' | 'Hygiene' | 'Digital Wellness';

const categories: Category[] = ['All', 'Nutrition', 'Fitness', 'Mental Health', 'Hygiene', 'Digital Wellness'];

const NutureIQPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');
    const [currentIndex, setCurrentIndex] = useState(0); // For mobile view
    const [isFlipped, setIsFlipped] = useState(false); // For mobile card flip state

    const filteredCards = selectedCategory === 'All'
        ? nutureIQCards
        : nutureIQCards.filter(card => card.category === selectedCategory);

    // Reset index and flip state when category changes
    useEffect(() => {
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [selectedCategory]);

    const handleNext = () => {
        if (currentIndex < filteredCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false); // Reset flip state for new card
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false); // Reset flip state for new card
        }
    };
    
    const currentCard = filteredCards[currentIndex];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-white">Nuture IQ</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                    Quick wellness facts for a smarter, healthier you. Swipe, learn, and level up your health game.
                </p>
            </div>

            <div className="my-12 flex justify-center flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                            selectedCategory === category
                                ? 'bg-brand-green text-white shadow-glow-green'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Desktop View: Grid of cards (hidden on mobile) */}
            <div className="hidden md:grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredCards.map(card => (
                    <div key={card.id} className="group perspective-[1000px]">
                        <div className="relative w-full h-48 rounded-2xl shadow-lg [transform-style:preserve-3d] transition-transform duration-700 group-hover:rotate-y-180">
                            {/* Front of card */}
                            <div className="absolute w-full h-full backface-hidden bg-gray-800 border border-gray-700 rounded-2xl flex flex-col justify-center items-center p-6">
                                <span className="inline-block bg-brand-green/20 text-brand-green text-sm font-semibold px-4 py-2 rounded-full">{card.category}</span>
                            </div>
                             {/* Back of card */}
                            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-brand-green to-emerald-600 border border-brand-green rounded-2xl flex items-center justify-center p-6 rotate-y-180">
                                <p className="text-white text-center font-medium">{card.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Mobile View: Single card with nav (block on mobile, hidden on desktop) */}
            <div className="md:hidden">
                {currentCard ? (
                    <>
                        <div className="perspective-[1000px] w-full max-w-sm mx-auto">
                            <div
                                className="relative w-full h-56 rounded-2xl shadow-lg [transform-style:preserve-3d] transition-transform duration-700"
                                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                {/* Front */}
                                <div className="absolute w-full h-full backface-hidden bg-gray-800 border border-gray-700 rounded-2xl flex flex-col justify-center items-center p-6 text-center cursor-pointer">
                                    <span className="inline-block bg-brand-green/20 text-brand-green text-sm font-semibold px-4 py-2 rounded-full">{currentCard.category}</span>
                                </div>
                                {/* Back */}
                                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-brand-green to-emerald-600 border border-brand-green rounded-2xl flex items-center justify-center p-6 rotate-y-180 cursor-pointer">
                                    <p className="text-white text-center font-medium">{currentCard.content}</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="flex items-center justify-between mt-8 max-w-sm mx-auto">
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="px-6 py-2 bg-gray-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                Previous
                            </button>
                            <span className="text-gray-400 font-medium">{currentIndex + 1} / {filteredCards.length}</span>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex === filteredCards.length - 1}
                                className="px-6 py-2 bg-gray-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>No facts available for this category.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default NutureIQPage;
