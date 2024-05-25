import { Component, Inject, NgZone, OnInit, AfterViewInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';


import { isPlatformBrowser } from '@angular/common';

import { ServicesService } from '../services.service'

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-company-num-chart',
  templateUrl: './company-num-chart.component.html',
  styleUrl: './company-num-chart.component.css'
})
export class CompanyNumChartComponent implements OnInit, AfterViewInit, OnDestroy{
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
  // occupationNum = [{occupation:string, value:number}]
  occupationNum:any[] = []

  //post business name
  b_bigName = ["文化、運動、休閒及其他服務業", "農、林、漁、牧業"];
  b_midName = ["陸上運輸業"];
  b_smallName = ["石油製品、燃料零售業"];
  b_detailName = ["室內輕鋼架工程業", "水產品批發業", "日常用品批發業", "日常用品零售業", "一般廣告服務業"];

  ngOnInit(): void {
    const postBusinessName = {
      big: this.b_bigName,
      mid: this.b_midName,
      small: this.b_smallName,
      detail: this.b_detailName
    }

    // post business name
    this.service.postBusinessName(postBusinessName).pipe(
      map(response => {
        console.log('Post of businessName created successfully:', response);
      })
    ).subscribe();

    
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      let root = am5.Root.new("chartdiv");

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
          paddingLeft:0,
          paddingRight:1
        })
      );

      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      let xRenderer = am5xy.AxisRendererX.new(root, { 
        minGridDistance: 30, 
        minorGridEnabled: true
      });

      xRenderer.labels.template.setAll({
        rotation: 0,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingRight: 15
      });

      xRenderer.grid.template.setAll({
        location: 1
      })

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "occupation",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yRenderer = am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer
      }));

      // Create series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "occupation",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
      }));

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
      series.columns.template.adapters.add("fill", function (fill, target) {
        let Key:any = "colors";
        return chart.get(Key).getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", function (stroke, target) {
        let Key:any = "colors";
        return chart.get(Key).getIndex(series.columns.indexOf(target));
      });

      /*
      // Set sample data
      let data = [{
        occupation: "農、林、漁、牧業",
        value: 2025
      }, {
        occupation: "礦業及土石採取業",
        value: 1882
      }, {
        occupation: "製造業",
        value: 1809
      }, {
        occupation: "水電燃氣業",
        value: 1322
      }, {
        occupation: "營造及工程業",
        value: 1122
      }, {
        occupation: "批發、零售及餐飲業",
        value: 1114
      }, {
        occupation: "運輸、倉儲及通信業",
        value: 984
      }, {
        occupation: "金融、保險及不動產業",
        value: 711
      }, {
        occupation: "專業、科學及技術服務業",
        value: 665
      }, {
        occupation: "文化、運動、休閒及其他服務業",
        value: 443
      }, {
        occupation: "其他未分類業",
        value: 441
      }];
      */
      // console.log("data:", data);

      console.time('time of post getOccupationNum');
      // get occuaption number
      this.service.getOccupationNum().pipe(
        map(response => {
          this.occupationNum = this.reformat_OccuaptionNum(response);
          //console.log('response:', response);
          console.log('response:', this.occupationNum);
          let data = this.occupationNum;

          xAxis.data.setAll(data);
          series.data.setAll(data);

          console.timeEnd('time of post getOccupationNum');
        })
      ).subscribe();

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

  reformatPost(post: string){
    var temp:any;

    var re = /&#x27;/gi;
    temp = post.replace(re, '');
    re = /result: /gi;
    temp = temp.replace(re, '');
    temp = temp.replace("{", '').replace("}", '').replace("[", '').replace("]", '');
    return temp.split(", ");
  }

  reformat_OccuaptionNum(post: string){
    var temp:any;

    var re = /&#x27;/gi;
    temp = post.replace(re, '');
    re = /result: /gi;
    temp = temp.replace(re, '');
    temp = temp.replace("{[", '').replace("}]}", '');
    re = /{/gi;
    temp = temp.replace(re, '')
    let tempstring:string[] = temp.split('}, ');
    
    let templist:any[] = []

    tempstring.forEach(e => {
      let t_list:string[]
      t_list = e.split(", ");
      var t_o = t_list[0].replace("occupation: ", '');
      var t_v = Number(t_list[1].replace("value: ", ''));

      templist.push(
        {
          occupation: t_o,
          value: t_v
        }
      )
    });
    
    return templist;
  }
}

