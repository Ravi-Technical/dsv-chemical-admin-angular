import { Component, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ChartComponent } from "ng-apexcharts";
import { ApexNonAxisChartSeries, ApexResponsive } from "ng-apexcharts";
import { ApexDataLabels, ApexXAxis, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexYAxis, ApexTooltip, ApexFill, ApexLegend } from "ng-apexcharts";


// First chart 
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: any;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
};

// Second Chart 
export type ChartOptions1 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
};

// Third Chart
export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle
};

@Component({
  selector: 'app-home',
  imports: [NgApexchartsModule, MatIcon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  // Second Chart
  @ViewChild("chart1") chart1!: ChartComponent;
  public chartOptions1!: ChartOptions1;

  // Third Chart
  @ViewChild("chart") chart2!: ChartComponent;
  public chartOptions2 !: ChartOptions2;

  constructor() {

    // First Chart
    this.chartOptions = {
      series: [
        {
          name: "Sales",
          data: [25, 30, 20, 15, 10, 22,5]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      title: {
        text: "Product Category Distribution",
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: 'Segoe UI',
          color: '#1f2937'
        }
      },
      legend: {
        position: "bottom"
      },
      stroke: {
        show: false,
        width: 0
      },
      xaxis: {
        categories: [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun"
        ]
      }
    };

    // Second Chart
    this.chartOptions1 = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      title: {
        text: "Products by Application Industry",
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: 'Segoe UI',
          color: '#1f2937'
        }
      },
      legend: {
        position: "bottom"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
          }
        }
      ]
    };

    // Third Chart
    this.chartOptions2 = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      title: {
        text: "Monthly Production vs Sales",
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: 'Segoe UI',
          color: '#1f2937'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };


  }  // Constructor END

  ngOnInIt(): void {

  }

} // MAIN CLASS END HERE
