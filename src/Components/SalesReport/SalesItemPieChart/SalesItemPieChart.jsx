import "./SalesItemPieChart.css"
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import DateRangeComponent from "../DateRangeComponent/DateRangeComponent"
import { addDays, startOfMonth, endOfMonth } from "date-fns";
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { parse } from "date-fns";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { DateRangePicker,defaultStaticRanges, defaultInputRanges, createStaticRanges } from "react-date-range";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesItemPieChart = ({salesData, pieChartZoom, setPieChartZoom}) => {
  
  const [topItems, setTopItems] = useState([]);
  
  const [range, setRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection'
    }
  ])
  
  const chartRef = useRef();
  
  useEffect(() => {
    const itemTotals = {};
    const { startDate, endDate } = range[0];

    salesData.forEach((sale) => {
      if (!sale.DATE) return;
    const saleDate = parse(sale.DATE, "dd-MM-yyyy", new Date());
    if (isNaN(saleDate) || saleDate < startDate || saleDate > endDate) return;
      if (!sale.ALLINVENTORYENTRIES) return;
      sale.ALLINVENTORYENTRIES.forEach((item) => {
        const name = item.STOCKITEMNAME;
        const kg = parseFloat(item.KG) || 0;

        if (!itemTotals[name]) {
          itemTotals[name] = 0;
        }
        itemTotals[name] += kg;
      });
    });
    
    const sortedItems = Object.entries(itemTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, totalKG]) => ({ name, totalKG }));

    setTopItems(sortedItems);
  }, [salesData, range]);
  
  const generateBrighterColors = (count) => {
  const colors = new Set();

  while (colors.size < count) {
    const hue = Math.floor(Math.random() * 360); // full color wheel
    const saturation = 80 + Math.random() * 10;   // 80–90%
    const lightness = 50 + Math.random() * 10;    // 50–60% for brightness
    colors.add(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return Array.from(colors);
};

  const smoothColors = useMemo(() => {
  if (!topItems || topItems.length === 0) return [];
  return generateBrighterColors(topItems.length);
}, [topItems]);

  if (!topItems) return null;
  
  const chartData = {
    labels: topItems.map(item => item.name),
    datasets: [
      {
        label: '',
        data: topItems.map(item => item.totalKG),
        backgroundColor:smoothColors,
        borderWidth: 2
      }
    ]
  };
  
  /*const options = {
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000, // 2 seconds
      easing: 'easeOutBounce' // try 'easeInOutQuad', 'linear', etc.
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };*/
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    hover: {
    mode: 'nearest',
    intersect: true
  }
  };
  
  const handleDownload = () => {
  const chart = chartRef.current;
  if (!chart) return;

  const base64Image = chart.toBase64Image();
  const link = document.createElement('a');
  link.href = base64Image;
  link.download = 'sales-pie-chart.png';
  link.click();
};

  
  return (
    <div className ="sales-Item-pie">
      <h2>Top 10 Sold Items</h2>
      <div className = "pie-zoom">
        {pieChartZoom === false && (
        <MdOutlineZoomOutMap 
          role = "button"
          tabIndex = "0"
          onClick = {() => setPieChartZoom(true)}
        />)}
        {pieChartZoom === true && (
        <IoMdCloseCircleOutline 
          role = "button"
          tabIndex = "0"
          onClick = {() => setPieChartZoom(false)}
        />)}
      </div>
      <div className = "pie-calendar">
        <DateRangeComponent 
            range = {range}
            setRange = {setRange}
        />
      </div>
      <div className ="chart-wrapper">
        {topItems.length > 0 ? (
          <Pie
            ref={chartRef}
            data={chartData}
            options={options}
          />
        ) : (
          <p>No data available.</p>
        )}
      </div>
      <button 
        className = ".download-btn"
        onClick={handleDownload}>Download Chart</button>
    </div>
  )
}
export default SalesItemPieChart;