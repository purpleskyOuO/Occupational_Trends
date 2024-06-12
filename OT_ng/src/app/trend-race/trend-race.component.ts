import { Component, Inject, NgZone, OnInit, AfterViewInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';


import { isPlatformBrowser } from '@angular/common';

import { ServicesService } from '../services.service';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Observable, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-trend-race',
  templateUrl: './trend-race.component.html',
  styleUrl: './trend-race.component.css'
})
export class TrendRaceComponent implements OnInit, AfterViewInit, OnDestroy{
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

  //post trend name
  t_bigName = ["文化、運動、休閒及其他服務業"];
  t_midName = ["陸上運輸業"];
  t_smallName = ["石油製品、燃料零售業"];
  t_detailName = ["室內輕鋼架工程業", "水產品批發業", "日常用品批發業", "日常用品零售業", "一般廣告服務業"];

  // get data
  // establish: {[key: string]:{[key: string]: number}} = {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(async () => {

      let name = {
        big: this.t_bigName,
        mid: this.t_midName,
        small: this.t_smallName,
        detail: this.t_detailName
      }
  
      const post_DismissTrend = {
        name:{big: this.t_bigName,
          mid: this.t_midName,
          small: this.t_smallName,
          detail: this.t_detailName},
        trend:"dismiss"
      }

      let root;
      /*
      const establish_Data = this.getRaceNum(name, "establish");
      root = this.createChart("establish_chartdiv", establish_Data)
      this.roots.push(root);

      const dismiss_Data = this.getRaceNum(name, "dismiss");
      root = this.createChart("dismiss_chartdiv", dismiss_Data)
      this.roots.push(root);*/

      try {
        const establish_Data = await lastValueFrom(this.getRaceNum("establish"));
        if (establish_Data) {
          root = this.createChart("establish_chartdiv", establish_Data);
          this.roots.push(root);
        } else {
          console.error("Failed to get establish data");
        }
    
        const dismiss_Data = await lastValueFrom(this.getRaceNum("dismiss"));
        if (dismiss_Data) {
          let root = this.createChart("dismiss_chartdiv", dismiss_Data);
          this.roots.push(root);
        } else {
          console.error("Failed to get dismiss data");
        }
      } catch (error) {
        console.error("An error occurred: ", error);
      }
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


  reformat_RaceNum(post: string){
    var temp:any;

    var re = /&#x27;/gi;
    temp = post.replace(re, '');
    re = /&quot;/gi;
    temp = temp.replace(re, '"');
    //temp = temp.replace(/(\d+):/g, '"$1":')  // 將年份的鍵包裝在引號中
    //temp = temp.replace(/([\u4E00-\u9FFF]+):/g, '"$1":');  // 將中文鍵包裝在引號中

    const tempJSON = JSON.parse(temp);
    
    return tempJSON;
  }
  /*
  getRaceNum(name: {big: string[], mid: string[], small: string[], detail: string[]}, trend:string): 
  {[key: string]:{[key: string]: number}}{
    let data:any;

    const post_RaceTrend = {
      name: name,
      trend: trend
    }

    // post establish race name
    this.service.postRaceName(post_RaceTrend).pipe(
      map(response => {
        console.log('Post of raceName created successfully:', response);
      })
    ).subscribe();

    // get establish race number
    this.service.getRaceNum().pipe(
      map(response => {
        data = this.reformat_RaceNum(response);
        //console.log('response:', response);
        console.log(trend, 'response:', data);

        // let root = this.createChart("establish_chartdiv", this.establish)
        // this.roots.push(root);
      })
    ).subscribe();

    const result:{[key: string]:{[key: string]: number}} = data;

    return result;
  }*/

  getRaceNum(trend: string): Observable<{ [key: string]: { [key: string]: number } }> {
    return this.service.postRaceTrend({"trend": trend}).pipe(
      map(response => {
        console.log('Post of raceTrend created successfully:', response);
      }),
      concatMap(() => this.service.getRaceNum().pipe(
        map(response => {
          const data = this.reformat_RaceNum(response);
          console.log(trend, 'response:', data);
          return data;
        })
      ))
    );
  }

  createChart(chartID: string, allData: {[key: string]:{[key: string]: number}}): am5.Root{

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new(chartID);
    
    root.numberFormatter.setAll({
      numberFormat: "#a",
    
      // Group only into K (thousands), M (millions), and B (billions)
      bigNumberPrefixes: [
        { number: 1e3, suffix: "K" },
        { number: 1e6, suffix: "M" },
        { number: 1e9, suffix: "B" }
      ],
    
      // Do not use small number prefixes at all
      smallNumberPrefixes: []
    });
    
    var stepDuration = 2000;
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "none",
      wheelY: "none",
      paddingLeft: 0
    }));
    
    
    // We don't want zoom-out button to appear while animating, so we hide it at all
    chart.zoomOutButton.set("forceHidden", true);
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 20,
      inversed: true,
      minorGridEnabled: true
    });
    // hide grid
    yRenderer.grid.template.set("visible", false);
    
    var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "network",
      renderer: yRenderer
    }));
    
    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      strictMinMax: true,
      extraMax: 0.1,
      renderer: am5xy.AxisRendererX.new(root, {})
    }));
    
    xAxis.set("interpolationDuration", stepDuration / 10);
    xAxis.set("interpolationEasing", am5.ease.linear);
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "network"
    }));
    
    // Rounded corners for columns
    series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });
    
    // Make each column to be of a different color
    series.columns.template.adapters.add("fill", function (fill, target) {
      let key:any = "colors";
      return chart.get(key).getIndex(series.columns.indexOf(target));
    });
    
    series.columns.template.adapters.add("stroke", function (stroke, target) {
      let key:any = "colors";
      return chart.get(key).getIndex(series.columns.indexOf(target));
    });
    
    // Add label bullet
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueXWorking.formatNumber('#.# a')}",
          fill: root.interfaceColors.get("alternativeText"),
          centerX: am5.p100,
          centerY: am5.p50,
          populateText: true
        })
      });
    });
    
    var label = chart.plotContainer.children.push(am5.Label.new(root, {
      text: "2013",
      fontSize: "8em",
      opacity: 0.2,
      x: am5.p100,
      y: am5.p100,
      centerY: am5.p100,
      centerX: am5.p100
    }));
    
    // Get series item by category
    function getSeriesItem(category: any) {
      for (var i = 0; i < series.dataItems.length; i++) {
        var dataItem = series.dataItems[i];
        if (dataItem.get("categoryY") == category) {
          return dataItem;
        }
      }
      // for program run this return should not run
      return series.dataItems[0];
    }
    
    // Axis sorting
    function sortCategoryAxis() {
      // sort by value
      series.dataItems.sort(function (x, y) {
        let key: any = "valueX";
        return y.get(key) - x.get(key); // descending
        //return x.get("valueX") - y.get("valueX"); // ascending
      });
    
      // go through each axis item
      am5.array.each(yAxis.dataItems, function (dataItem) {
        // get corresponding series item
        var seriesDataItem = getSeriesItem(dataItem.get("category"));
    
        if (seriesDataItem) {
          // get index of series data item
          var index = series.dataItems.indexOf(seriesDataItem);
          // calculate delta position
          var deltaPosition =
            (index - dataItem.get("index", 0)) / series.dataItems.length;
          // set index to be the same as series data item index
          if (dataItem.get("index") != index) {
            dataItem.set("index", index);
            // set deltaPosition instanlty
            dataItem.set("deltaPosition", -deltaPosition);
            // animate delta position to 0
            dataItem.animate({
              key: "deltaPosition",
              to: 0,
              duration: stepDuration / 2,
              easing: am5.ease.out(am5.ease.cubic)
            });
          }
        }
      });
      // sort axis items by index.
      // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
      yAxis.dataItems.sort(function (x, y) {
        let key: any = "index";
        return x.get(key) - y.get(key);
      });
    }
    
    let year:any = 2013;
    
    // update data with values each 1.5 sec
    var interval = setInterval(function () {
      year++;
    
      if (year > 2024) {
        clearInterval(interval);
        clearInterval(sortInterval);
      }
    
      updateData();
    }, stepDuration);
    
    var sortInterval = setInterval(function () {
      sortCategoryAxis();
    }, 100);
    
    function setInitialData() {
      var d = allData[year];
    
      for (var n in d) {
        series.data.push({ network: n, value: d[n] });
        yAxis.data.push({ network: n });
      }
    }
    
    function updateData() {
      var itemsWithNonZero = 0;
    
      if (allData[year]) {
        label.set("text", year.toString());
    
        am5.array.each(series.dataItems, function (dataItem) {
          var category: any = dataItem.get("categoryY");
          var value = allData[year][category];
    
          if (value > 0) {
            itemsWithNonZero++;
          }
    
          dataItem.animate({
            key: "valueX",
            to: value,
            duration: stepDuration,
            easing: am5.ease.linear
          });
          dataItem.animate({
            key: "valueXWorking",
            to: value,
            duration: stepDuration,
            easing: am5.ease.linear
          });
        });
    
        yAxis.zoom(0, itemsWithNonZero / yAxis.dataItems.length);
      }
    }
    
    setInitialData();
    setTimeout(function () {
      year++;
      updateData();
    }, 50);
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
    
    return root;
  }
}

function delay(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
