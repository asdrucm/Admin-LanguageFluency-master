import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from './validation.mustmatch';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-potential',
  templateUrl: './add-potential.component.html',
  styleUrls: ['./add-potential.component.scss']
})
export class AddPotentialComponent implements OnInit {
  addPotentialForm: FormGroup;
  submit: boolean;
  countryCode = '';
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private fbstore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.addPotentialForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['',[Validators.required]],
      birthDate: ['',[Validators.required]],
      bio: ['',[Validators.required]],
      phone: ['',[Validators.required,Validators.minLength(10)]],
      horario: ['',[Validators.required]],
      fhorario: ['',[Validators.required]],
      idioma: ['',[Validators.required]]
    })
    this.submit = false;
  }
  get form() {
    return this.addPotentialForm.controls;
  }


  onClick() {
    // console.log("Submit button was clicked!");
    // this.submit = true;
  }

  onSubmit() {
    console.log(this.addPotentialForm.value);
    let dataPotential = this.addPotentialForm.value;
    this.http.post('https://us-central1-ejemplocrud-e7eb1.cloudfunctions.net/regAdmin',{
      email: dataPotential.email,
      name: dataPotential.name,
      lastName: dataPotential.lastName,
      password: dataPotential.password
    }).subscribe(async (data: any) => {
      if (data.error) {
        console.log('Error=>', data.error);
        Swal.fire({
          title: 'Hay un problema',
          text: data.error.message,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#5438dc'
        });
      } else {
        console.log(data);
        dataPotential['birthDate'] = new Date(new Date(this.addPotentialForm.value.birthDate + " 06:00").getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().replace('Z', '-06:00');
        dataPotential['horario'] = new Date(new Date(this.addPotentialForm.value.horario + " " + this.addPotentialForm.value.fhorario).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().replace('Z', '-06:00');
        dataPotential['code'] = "";
        dataPotential['creationTime'] = new Date();
        dataPotential['status'] = 'active';
        dataPotential['idioma'] = [dataPotential.idioma];
        await this.fbstore.collection('potenciales').doc(data.uid).set(dataPotential).then(res => {
          console.log('Perfil creado=>', res);
          this.activeModal.close("Submit");
        })
      }
    })
    // this.activeModal.close("Submit");
  }

  onCountryChange(obj) {
    console.log('onCountryChange',obj);
  }

  getNumber(obj) {
    console.log('getNumber',obj);
    this.countryCode = obj
  }

}
