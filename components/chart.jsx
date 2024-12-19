import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const MonthlyEnergyChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/monthly-daily-usage?year=2024&month=12');
      const data = await response.json();

      // Prepare data for the chart
      const labels = data.map((entry) => `Day ${entry.day}`);
      const values = data.map((entry) => entry.energy);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Daily Energy Usage (kWh)',
            data: values,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.3,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Monthly Energy Usage</h2>
      {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default MonthlyEnergyChart;
