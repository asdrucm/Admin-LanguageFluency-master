import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from './validation.mustmatch';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent implements OnInit {
  addBannerForm: FormGroup;
  submit: boolean;
  file: any;
  downloadURL: Observable<string>;
  percent: number = 0;
  arrayLocations: any = [];
  arrayLanguages: any = [];
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private fbstore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.addBannerForm = this.formBuilder.group({
      file: ['', [Validators.required]],
      //location: ['', [Validators.required]],
      //language: ['', [Validators.required]]
    })
    this.submit = false;
  }
  get form() {
    return this.addBannerForm.controls;
  }

  onFileSelected(event) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  changeLocations(e) {
    if (e.target.checked) {
      this.arrayLocations.push(e.target.value);
    }
    else{
      const index = this.arrayLocations.indexOf(e.target.value);
      if(index > -1){
        this.arrayLocations.splice(index, 1);
      }
    }
    console.log(this.arrayLocations);
  }

  changeLanguages(e) {
    if (e.target.checked) {
      this.arrayLanguages.push(e.target.value);
    }
    else{
      const index = this.arrayLanguages.indexOf(e.target.value);
      if(index > -1){
        this.arrayLanguages.splice(index, 1);
      }
    }
    console.log(this.arrayLanguages);
  }

  onSubmit() {
    console.log(this.addBannerForm.value);
    let dataBanner = this.addBannerForm.value;

    const filePath = 'banners/'+this.file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload('banners/'+this.file.name, this.file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              console.log(url);
              this.fbstore.collection('banners').add({
                file: url,
                location: this.arrayLocations,
                language: this.arrayLanguages,
                creationTime: new Date(),
                creationTimeTime: new Date().getTime()
              }).then(res => {
                console.log('Banner creado=>', res.id);
                Swal.fire({
                  title: 'Correcto',
                  text: "Su banner fue enviado correctamente",
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#5438dc'
                });
                this.activeModal.close("Submit");
              });
            }

          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
          //let progress = (url.bytesTransferred / url.totalBytes) * 100;
          //console.log('Upload is ' + progress + '% done');
        }
      });

      task.percentageChanges().subscribe((percentage) => {
        this.percent = Math.round(percentage);
      });
  }

}
