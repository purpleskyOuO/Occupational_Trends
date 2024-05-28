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

  // get data
  
  dismissNum:any[] = []  // dismissNum = [{year:number, month:number, value:number}]
  establishNum:any[] = []  // establishNum = [{year:number, month:number, value:number}]

  // post Trend name
  name = "廚具、衛浴設備安裝工程業";
  category = 'detail';

  ngOnInit(): void {
    const postTrendName = {
      name: this.name,
      category: this.category
    }

    // post dismiss name
    this.service.postTrendName(postTrendName).pipe(
      map(response => {
        console.log('Post of trendName created successfully:', response);
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {

      // get establish company number
      this.service.getEstablishNum().pipe(
        map(response => {
          this.establishNum = this.reformat_TrendNum(response);
          //console.log('response:', response);
          console.log('establish response:', this.establishNum);

          let root = this.createChart("establish_chartdiv", this.establishNum)
          this.roots.push(root);
        })
      ).subscribe();

      // get dismiss company number
      this.service.getDismissNum().pipe(
        map(response => {
          this.dismissNum = this.reformat_TrendNum(response);
          //console.log('response:', response);
          console.log('dismiss response:', this.dismissNum);

          let root = this.createChart("dismiss_chartdiv", this.dismissNum)
          this.roots.push(root);
        })
      ).subscribe();
      
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

  reformat_TrendNum(post: string){
    var temp:any;

    var re = /&#x27;/gi;
    temp = post.replace(re, '');
    re = /result: /gi;
    temp = temp.replace(re, '');
    temp = temp.replace("{[{", '').replace("}]}", '');
    re = /{/gi;
    temp = temp.replace(re, '')
    let tempstring:string[] = temp.split('}, ');

    let templist:any[] = [];

    tempstring.forEach(e => {
      let t_list:string[];
      t_list = e.split(", ");
      // console.log(t_list);
      var t_y = Number(t_list[0].replace("year: ", ''));
      var t_m = Number(t_list[1].replace("month: ", ''));
      var t_v = Number(t_list[2].replace("value: ", ''));

      var date = new Date();
      date.setHours(1, 1, 1, 1);
      date.setFullYear(t_y, t_m-1, 1);
      
      templist.push(
        {
          date: date.getTime(),
          value: t_v
        }
      )

    });

    return templist;
  }

  createChart(chartID: string, data: any[]): am5.Root{
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new(chartID);

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

    /*
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setFullYear(2000, 0);
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

    var data = generateDatas(30);
    series.data.setAll(data);
    */
    
    series.data.setAll(data);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
    
    return root;
  }
}
