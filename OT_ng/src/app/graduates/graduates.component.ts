import { Component, Inject, NgZone, OnInit, PLATFORM_ID} from '@angular/core';
import { map } from 'rxjs/operators';

import { ServicesService } from '../services.service'
import { Router } from '@angular/router';

interface DropdownContainer {
  id: number;
  selectedOptionText0: string;
  selectedOptionText1: string;
  dropdown1Options: string[];
}

@Component({
  selector: 'app-graduates',
  templateUrl: './graduates.component.html',
  styleUrls: ['./graduates.component.css'] // Correct the property name to 'styleUrls'
})

export class GraduatesComponent implements OnInit{

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private service: ServicesService, private router: Router) {}

  departments: any[] = [];

  // seletected type
  seletectedType: string = "";
  
  dropdownContainers: DropdownContainer[] = [
    {
      id: 0,
      selectedOptionText0: '',
      selectedOptionText1: '',
      dropdown1Options: []
    }
  ]; // Initial dropdown-container

  ngOnInit(): void {
    this.service.getDepartments().pipe(
      map(response => {
        //console.log('response:', response);
        this.departments = this.reformat_departments(response);

        this.dropdownContainers = [
          {
            id: 0,
            selectedOptionText0: '',
            selectedOptionText1: '',
            dropdown1Options: []
          }
        ]; // Initial dropdown-container

        console.log('response:', this.departments);

      })
    ).subscribe();
  }

  onDropdownChange0(dropdown: HTMLSelectElement, index: number): void {
    const container = this.dropdownContainers[index];
    const selectedField = dropdown.value;
    this.seletectedType = dropdown.value;
    container.selectedOptionText0 = dropdown.options[dropdown.selectedIndex].text;

    if (selectedField) {
      container.dropdown1Options = Array.from(new Set(this.departments.map(dept => String(dept[selectedField as keyof typeof this.departments[0]]))));
    } else {
      container.dropdown1Options = [];
    }

    container.selectedOptionText1 = ''; // Reset the second dropdown selection
  }

  onDropdownChange1(dropdown: HTMLSelectElement, index: number): void {
    const container = this.dropdownContainers[index];
    container.selectedOptionText1 = dropdown.options[dropdown.selectedIndex].text;
  }

  btn_CreateChart(): void {
    // post type and name
    var postTypeName;

    let container = this.dropdownContainers[0];

    if(container.selectedOptionText0 !== "分類" && container.selectedOptionText0 !== ""){
      if(container.selectedOptionText1 !== "分類項目" && container.selectedOptionText1 !== ""){
        postTypeName = {type: this.seletectedType,
                        name: container.selectedOptionText1}
      }
    }

    this.service.postGraduateTypeName(postTypeName).pipe(
      map(response => {
        console.log('Post of postTypeName created successfully:', response);
      })
    ).subscribe();

    // 此頁面跳轉
    this.router.navigate(['/Graduate_Trend']);
    // 跳出新分頁
    //window.open('http://localhost:4200/CompanyNum_Chart', '_blank');
  }

  reformat_departments(post: string) {
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

      var t_name = t_list[0].replace("name: ", '');
      var t_college = t_list[1].replace("college: ", "");
      var t_field = t_list[2].replace("field: ", "");
      var t_discipline = t_list[3].replace("discipline: ", "");
      var t_category = t_list[4].replace("category: ", "");

      tempList.push({
        "name": t_name,
        "college": t_college,
        "field": t_field,
        "discipline": t_discipline,
        "category": t_category
      });
    });

    // console.log(tempList);
    return tempList;
  }
}