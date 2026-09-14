/// 
import React, { useState } from 'react';
import { ChevronDownIcon } from './IconComponents';
import { FAQItem } from '../types';

interface AccordionProps {
  items: FAQItem[];
}

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 transition-colors">
      <h3>
        <button
          onClick={onClick}
          aria-expanded={isOpen}
          className="flex justify-between items-center w-full py-5 text-left text-lg font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span>{item.question}</span>
          <ChevronDownIcon
            className={`w-6 h-6 transform transition-transform duration-300 text-gray-500 dark:text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <div className="pb-5 pr-4 text-gray-600 dark:text-gray-400 transition-colors">
              {item.answer}
            </div>
        </div>
      </div>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
