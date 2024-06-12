import { Component, Inject, NgZone, OnInit, PLATFORM_ID} from '@angular/core';
import { map } from 'rxjs/operators';

import { ServicesService } from '../services.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrl: './single.component.css'
})

export class SingleComponent implements OnInit{

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private service: ServicesService, private router: Router) {}

  data: any[] = [];

  bigNames: string[] = Array.from(new Set(this.data.map(item => item.big_name)));

  dropdownContainers: {
    id: number;
    selectedOptionText0: string;
    selectedOptionText1: string;
    selectedOptionText2: string;
    selectedOptionText3: string;
    bigNames: string[];
    midNames: string[];
    smallNames: string[];
    detailNames: string[];
  }[] = [
    {
      id: 0,
      selectedOptionText0: '',
      selectedOptionText1: '',
      selectedOptionText2: '',
      selectedOptionText3: '',
      bigNames: this.bigNames,
      midNames: this.getMidNames(''),
      smallNames: this.getSmallNames('', ''),
      detailNames: this.getDetailNames('', '', '')
    }
  ]; // 初始的一個 dropdown-container

  ngOnInit(): void {
    this.service.getBusinessCategory().pipe(
      map(response => {
        this.data = this.reformat_businessCategory(response);
        //console.log('response:', response);

        this.bigNames = Array.from(new Set(this.data.map(item => item.big_name)));

        this.dropdownContainers = [
          {
            id: 0,
            selectedOptionText0: '',
            selectedOptionText1: '',
            selectedOptionText2: '',
            selectedOptionText3: '',
            bigNames: this.bigNames,
            midNames: this.getMidNames(''),
            smallNames: this.getSmallNames('', ''),
            detailNames: this.getDetailNames('', '', '')
          }
        ]; // 初始的一個 dropdown-container

        console.log('response:', this.data);

      })
    ).subscribe();
  }

  getMidNames(bigName: string): string[] {
    if (!bigName) return [];
    return Array.from(new Set(this.data.filter(item => item.big_name === bigName).map(item => item.mid_name)));
  }

  getSmallNames(bigName: string, midName: string): string[] {
    if (!bigName || !midName) return [];
    return Array.from(new Set(this.data.filter(item => item.big_name === bigName && item.mid_name === midName).map(item => item.small_name)));
  }

  getDetailNames(bigName: string, midName: string, smallName: string): string[] {
    if (!bigName || !midName || !smallName) return [];
    return Array.from(new Set(this.data.filter(item => item.big_name === bigName && item.mid_name === midName && item.small_name === smallName).map(item => item.detail_name)));
  }

  //big_dropdown
  onDropdownChange0(dropdown: HTMLSelectElement, index: number): void {
    const container = this.dropdownContainers[index];
    container.selectedOptionText0 = dropdown.options[dropdown.selectedIndex].text;

    container.midNames = this.getMidNames(dropdown.value);
    container.selectedOptionText1 = ''; // reset mid_name selection
    container.smallNames = this.getSmallNames(dropdown.value, '');
    container.selectedOptionText2 = ''; // reset small_name selection
    container.detailNames = this.getDetailNames(dropdown.value, '', '');
    container.selectedOptionText3 = ''; // reset detail_name selection
  }

  //mid_dropdown
  onDropdownChange1(dropdown: HTMLSelectElement, index: number): void {
    const container = this.dropdownContainers[index];
    container.selectedOptionText1 = dropdown.options[dropdown.selectedIndex].text;
    container.smallNames = this.getSmallNames(container.selectedOptionText0, dropdown.value);
    container.selectedOptionText2 = ''; // reset small_name selection
    container.detailNames = this.getDetailNames(container.selectedOptionText0, dropdown.value, '');
    container.selectedOptionText3 = ''; // reset detail_name selection
  }

  //small_dropdown
  onDropdownChange2(dropdown: HTMLSelectElement, index: number): void {
    const container = this.dropdownContainers[index];
    container.selectedOptionText2 = dropdown.options[dropdown.selectedIndex].text;
    container.detailNames = this.getDetailNames(container.selectedOptionText0, container.selectedOptionText1, dropdown.value);
    container.selectedOptionText3 = ''; // reset detail_name selection
  }

  //detail_dropdown
  onDropdownChange3(dropdown: HTMLSelectElement, index: number): void {
    const container = this.dropdownContainers[index];
    container.selectedOptionText3 = dropdown.options[dropdown.selectedIndex].text; // reset detail_name selection
  }

  btn_CreateChart(): void {
    // post Trend name
    var postTrendName;

    let container = this.dropdownContainers[0];

    if(container.selectedOptionText3 !== "詳細分類" && container.selectedOptionText3 !== ""){
      postTrendName = {
        name: container.selectedOptionText3, 
        category: "detail"
      };
    }else if(container.selectedOptionText2 !== "小分類" && container.selectedOptionText2 !== ""){
      postTrendName = {
        name: container.selectedOptionText2, 
        category: "small"
      };
    }else if(container.selectedOptionText1 !== "中分類" && container.selectedOptionText1 !== ""){
      postTrendName = {
        name: container.selectedOptionText1, 
        category: "mid"
      };
    }else if(container.selectedOptionText0 !== "大分類" && container.selectedOptionText0 !== ""){
      postTrendName = {
        name: container.selectedOptionText0, 
        category: "big"
      };
    }

    // post dismiss name
    this.service.postTrendName(postTrendName).pipe(
      map(response => {
        console.log('Post of trendName created successfully:', response);
      })
    ).subscribe();

    // 此頁面跳轉
    this.router.navigate(['/CompanyTrend_Chart']);
    // 跳出新分頁
    //window.open('http://localhost:4200/CompanyTrend_Chart', '_blank');
  }

  reformat_businessCategory(post: string) {
    var temp:any;

    var re = /&#x27;/gi;
    temp = post.replace(re, '');
    // console.log(temp);
    temp = temp.replace("[{", '').replace("}]", '');
    let tempString:string[] = temp.split('}, {');

    let tempList:any[] = [];

    tempString.forEach(e => {
      let t_list:string[];
      t_list = e.split(", ");

      var t_big = t_list[0].replace("big_name: ", '');
      var t_mid = t_list[1].replace("mid_name: ", "");
      var t_small = t_list[2].replace("small_name: ", "");
      var t_detail = t_list[3].replace("detail_name: ", "");

      tempList.push({
        "big_name": t_big,
        "mid_name": t_mid,
        "small_name": t_small,
        "detail_name": t_detail
      });
    });

    // console.log(tempList);
    return tempList;
  }
}