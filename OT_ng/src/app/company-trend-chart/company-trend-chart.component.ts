import { Component, Inject, NgZone, OnInit, AfterViewInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';

import { ServicesService } from '../services.service'

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';


@Component({
  selector: 'app-company-trend-chart',
  templateUrl: './company-trend-chart.component.html',
  styleUrl: './company-trend-chart.component.css'
})
export class CompanyTrendChartComponent implements OnInit, AfterViewInit, OnDestroy{
  private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private service: ServicesService) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  // get data
  // occupationTrend = [{date:Date, value:number}]
  occupationTrend:any[] = []

  // post dismiss name
  name = "廚具、衛浴設備安裝工程業";
  category = 'detail';

  ngOnInit(): void {
    const postDismissName = {
      name: this.name,
      category: this.category
    }

    // post business name
    this.service.postBusinessName(postDismissName).pipe(
      map(response => {
        console.log('Post of dismissName created successfully:', response);
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      let root = am5.Root.new("chartdiv");

      const myTheme = am5.Theme.new(root);

      myTheme.rule("AxisLabel", ["minor"]).setAll({
        dy:1
      });

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root),
        myTheme,
        am5themes_Responsive.new(root)
      ]);

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft:0
      }));

      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomX"
      }));
      cursor.lineY.set("visible", false);

      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setFullYear(2000, 0)
      let value = 100;

      function generateData() {
        value = Math.round((Math.random() * 10 - 5) + value);
        am5.time.add(date, "month", 1);
        return {
          date: date.getTime(),
          value: value
        };
      }

      function generateDatas(count: any) {
        var data = [];
        for (var i = 0; i < count; ++i) {
          data.push(generateData());
        }
        return data;
      }

      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0,
        baseInterval: {
          timeUnit: "month",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled:true,
          minorLabelsEnabled:true
        }),
        tooltip: am5.Tooltip.new(root, {})
      }));

      xAxis.set("minorDateFormats", {
        "month":"MM",
        "year":"yy"
      });


      var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      }));


      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
      }));

      series.columns.template.setAll({ strokeOpacity: 0 })


      // Add scrollbar
      // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
      chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
      }));

      var data = generateDatas(30);
      series.data.setAll(data);


      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);

      this.root = root;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
