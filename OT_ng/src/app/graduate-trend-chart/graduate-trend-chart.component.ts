import { Component, Inject, NgZone, OnInit, AfterViewInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';

import { ServicesService } from '../services.service'

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-graduate-trend-chart',
  templateUrl: './graduate-trend-chart.component.html',
  styleUrl: './graduate-trend-chart.component.css'
})
export class GraduateTrendChartComponent implements OnInit, AfterViewInit, OnDestroy{
  private roots: am5.Root[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private service: ServicesService) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    // post data
    const postTypeName = {type: "department", name: "資訊工程系"};
    // const postTypeName = {type: "college", name: "工學院"};
    // const postTypeName = {type: "field", name: "工程、製造及營建"};
    // const postTypeName = {type: "discipline", name: "工程及工程業"};
    // const postTypeName = {type: "category", name: "電機與電子工程"};

    // post graduate type and name
    this.service.postGraduateTypeName(postTypeName).pipe(
      map(response => {
        console.log('Post of graduateTypeName created successfully:', response);
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      this.roots.push(this.createChart());
      
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {

      this.roots.forEach(e =>{
        if(e){
          e.dispose();
        }
      })
    });
  }

  createChart(): am5.Root{
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0,
      layout: root.verticalLayout
    }));

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    var data: any[] = [{
      "year": "2021",
      "public": 2.5,
      "private": 2.5
    }, {
      "year": "2022",
      "public": 2.6,
      "private": 2.7
    }, {
      "year": "2023",
      "public": 2.8,
      "private": 2.9
    }]


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true
    });
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "year",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    xRenderer.grid.template.setAll({
      location: 1
    })

    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name: any, fieldName: any) {
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "year"
      }));

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}: {valueY}",
        tooltipY: am5.percent(10)
      });
      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      legend.data.push(series);
    }

    makeSeries("公立", "public");
    makeSeries("私立", "private");


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
    
    return root;
  }
}
