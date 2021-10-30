import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from './validation.mustmatch';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {
  addAdminForm: FormGroup;
  submit: boolean;
  arrayPermissions: any = [];
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private fbstore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.addAdminForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
    this.submit = false;
  }
  get form() {
    return this.addAdminForm.controls;
  }


  onClick() {
    // console.log("Submit button was clicked!");
    // this.submit = true;
  }

  onSubmit() {
    console.log(this.addAdminForm.value);
    let dataAdmin = this.addAdminForm.value;
    this.http.post('https://us-central1-ejemplocrud-e7eb1.cloudfunctions.net/regAdmin',{
      email: dataAdmin.email,
      name: dataAdmin.name,
      lastName: dataAdmin.lastName,
      password: dataAdmin.password
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
        dataAdmin['role'] = 'admin';
        dataAdmin['status'] = 'active';
        dataAdmin['permissions'] = this.arrayPermissions;
        await this.fbstore.collection('perfiles').doc(data.uid).set(dataAdmin).then(res => {
          console.log('Perfil creado=>', res);
          this.activeModal.close("Submit");
        })
      }
    })
    // this.activeModal.close("Submit");
  }

  changePermissions(e) {
    if (e.target.checked) {
      this.arrayPermissions.push({name: e.target.parentNode.innerText.trim(), route: e.target.value});
    }
    else{
      const index = this.arrayPermissions.findIndex(item => item.route == e.target.value);
      if(index > -1){
        this.arrayPermissions.splice(index, 1);
      }
    }
    console.log(this.arrayPermissions);
  }

}
