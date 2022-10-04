import React, { useState } from "react";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

async function creatPdf({
  doc,
  elements,
}: {
  doc: jsPDF;
  elements: HTMLCollectionOf<Element>;
}) {
  const padding = 10;
  const marginTop = 20;
  let top = marginTop;

  for (let i = 0; i < elements.length; i++) {
    const el = elements.item(i) as HTMLElement;
    const imgData = await htmlToImage.toPng(el);

    let elHeight = el.offsetHeight;
    let elWidth = el.offsetWidth;

    const pageWidth = doc.internal.pageSize.getWidth();

    if (elWidth > pageWidth) {
      const ratio = pageWidth / elWidth;
      elHeight = elHeight * ratio - padding * 2;
      elWidth = elWidth * ratio - padding * 2;
    }

    const pageHeight = doc.internal.pageSize.getHeight();

    if (top + elHeight > pageHeight) {
      doc.addPage();
      top = marginTop;
    }

    doc.addImage(imgData, "PNG", padding, top, elWidth, elHeight, `image${i}`);
    top += elHeight + marginTop;
  }
}

export async function exportMultipleChartsToPdf() {
  const doc = new jsPDF("p", "px"); // (1)
  const elements = document.getElementsByClassName("custom-chart"); // (2)
  await creatPdf({ doc, elements }); // (3-5)
  doc.save(`charts.pdf`); // (6)
}

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

  return (
    <div>
      <Chart
        className="custom-chart"
        options={dataSample.options}
        series={dataSample.series}
        type="line"
        width="500"
      />
      <button className="button" onClick={exportMultipleChartsToPdf}>
        Export to PDF
      </button>
    </div>
  );
}
