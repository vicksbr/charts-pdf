import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const getDataUri = async (chartId: any) => {
  return await ApexCharts.exec(chartId, "dataURI").then(({ imgURI }: any) => {
    console.log(imgURI)
    return imgURI;
  });
};


export default function ChartSample() {
  const [dataSample, setDataSample] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });

  const chartRef = useRef<any>()

  return (
    <div ref={chartRef}>
      <Chart
        className="custom-chart"
        options={dataSample.options}
        series={dataSample.series}
        type="line"
        width="500"
      />
      <button className="button" onClick={() => getDataUri(dataSample.options.chart.id)}>
        GetImageUri
      </button>
    </div>
  );
}
