// LineChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ data, borderColor }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const myChartRef = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(myChartRef, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: data.title,
            data: data.result,
            fill: false,
            borderColor: borderColor,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, // Set to true for proportional scaling
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Units Sold',
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, borderColor]);

  return (
    <div className="w-full h-full">
      <div className="flex space-x-3 mb-2">
        <div className={`w-4 h-6 ${data.backgroundColor}`}></div>
        <h2 className="text-neutral1 font-medium capitalize">{data.title}</h2>
      </div>
      <div className="relative h-full"> {/* Set a fixed height for the chart */}
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default LineChart;