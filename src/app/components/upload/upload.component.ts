import { Component, OnInit } from '@angular/core';
import { SharedService } from "../../services/shared.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

    jsonFile = [];
    constructor(private sharedVariables: SharedService) { }

  ngOnInit(): void {
    }

  loadJson(event: any) {
    let jsonFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(jsonFile, "UTF-8");
    fileReader.onload = () => {
        console.log(jsonFile);
        this.sharedVariables.setJsonFile(jsonFile);
     console.log(JSON.parse(fileReader.result as any));
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
}
