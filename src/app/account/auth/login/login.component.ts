import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  anio: number = new  Date().getFullYear();
  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private fbstore: AngularFirestore,private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public authenticationService: AuthenticationService, public authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');

    this.loginForm = this.formBuilder.group({
      email: ['seiyasuabe@gmail.com', [Validators.required, Validators.email]],
      password: ['NETnet123', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.email.value, this.f.password.value).then((res: any) => {
          this.fbstore.collection('perfiles', ref => ref.where('email','==',this.f.email.value)).snapshotChanges()
          .subscribe(data => {
            data.forEach((getData:any) =>{
              if(getData.payload.doc.data()['role'] != "admin" && getData.payload.doc.data()['role'] != "superadmin"){
                this.authenticationService.logout();
                this.error = "Su cuenta no está autorizada."
              }
              else{
                if(getData.payload.doc.data()['status'] == "canceled"){
                  console.log("Cancelado");
                  this.error = "Su cuenta no está autorizada."
                  if (environment.defaultauth === 'firebase') {
                    this.authenticationService.logout();
                  }
                }
                else{
                  this.router.navigate(['/']);
                }
              }
            })
          })
        })
          .catch(error => {
            console.log(error);
            if(error == "The password is invalid or the user does not have a password."){
              this.error = "La contraseña no es válida o el usuario no tiene contraseña."
            }
            else if(error == "There is no user record corresponding to this identifier. The user may have been deleted."){
              this.error = "No hay ningún registro de usuario que corresponda a este identificador. Es posible que se haya eliminado al usuario."
            }
            else{
              this.error = error ? error : '';
            }
          });
      } else {
        this.authFackservice.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/']);
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }

}
