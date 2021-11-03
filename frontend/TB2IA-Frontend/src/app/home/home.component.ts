import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PredictionService } from 'src/services/prediction.service';
import { ResultComponent } from '../result/result.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private predictionService: PredictionService,
    public dialog: MatDialog
  ) {}

  imageSrc: string = '';
  @ViewChild('file') myInputVariable!: ElementRef;
  fileName: string = 'No File Selected';
  selectedFiles: any[] = [];
  ngOnInit(): void {}

  readURL(event: any): void {
    if (event.target!.files && event.target!.files[0]) {
      const file = event.target.files[0];

      this.fileName = event.target!.files[0].name;
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result as any);

      reader.readAsDataURL(file);
      this.selectedFiles.push(event.target.files[0]);
    }
  }

  deleteFile() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = '';
    this.imageSrc = '';
    this.fileName = 'No File Selected';
    this.selectedFiles.pop();
    console.log(this.myInputVariable.nativeElement.files);
  }

  uploadFile() {
    if (this.imageSrc.length > 0) {
      const fd = new FormData();
      fd.append('file', this.selectedFiles[0]);

      this.predictionService.createPrediction(fd).subscribe((resp: any) => {
        var response = {
          percentaje: resp.percentaje,
          prediction: resp.prediction,
        };

        this.openDialog(response);
      });
    }
  }

  openDialog(toSend: any): void {
    const dialogRef = this.dialog.open(ResultComponent, {
      data: { toSend: toSend },
    });
  }
}
