// GraphSlider.js
import React, { useState } from 'react';
import LineChart from './LineChart';

const GraphSlider = ({ graphDetails, id }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="lg:p-4 sm:p-2 h-full"> {/* Fixed height added */}
        <LineChart
          key={`${activeTab}-${id}`}
          data={graphDetails[activeTab]}
          borderColor="#0058E6"
        />
      </div>

      <div className="flex items-center justify-center space-x-4 rounded-t-lg w-full">
        {graphDetails.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`p-2 capitalize font-bold text-lg ${
              activeTab === index ? 'text-primary1' : 'text-neutral1'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GraphSlider;