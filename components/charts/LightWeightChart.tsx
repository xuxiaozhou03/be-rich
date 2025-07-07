'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import type { CandleData } from '@/lib/types';
import styles from './LightWeightChart.module.css';

interface LightWeightChartProps {
  data: CandleData[];
  width?: number;
  height?: number;
}

const LightWeightChart = ({ data, width = 800, height = 400 }: LightWeightChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#e1e3e6' },
        horzLines: { color: '#e1e3e6' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#e1e3e6',
      },
      crosshair: {
        mode: 1,
      },
    });
    
    // 添加K线图
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    
    // 添加成交量
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });
    
    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    
    // 转换数据格式
    const formattedData = data.map(item => ({
      time: item.time / 1000, // LightWeight Charts需要秒为单位的时间戳
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
    
    const volumeData = data.map(item => ({
      time: item.time / 1000,
      value: item.volume,
      color: item.close >= item.open ? '#26a69a' : '#ef5350',
    }));
    
    candlestickSeries.setData(formattedData);
    volumeSeries.setData(volumeData);
    
    chartRef.current = chart;
    
    // 响应式处理
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height]);
  
  return (
    <div 
      ref={chartContainerRef} 
      className={styles.chartContainer}
      style={{ width: '100%', height: `${height}px` }}
    />
  );
};

export default LightWeightChart;
