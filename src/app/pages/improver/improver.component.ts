import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ImproversService } from '../../core/services/improvers.service';
import { DetalleUsuario } from '../../core/models/usuario.model';
import * as firebase from 'firebase/app';
import { SpeakersService } from '../../core/services/speakers.service';
import { UserProfileService } from '../../core/services/user.service';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-improver',
  templateUrl: './improver.component.html',
  styleUrls: ['./improver.component.scss']
})
export class ImproverComponent implements OnInit {
  usuarioLogeado;
  ldfid: any;
  usuario: DetalleUsuario = {};
  grades: any;
  breadCrumbItems: Array<{}>;
  llamadas:  Array<{}>;
  plans:  Array<{}>;
  payments: Array<{}>;
  referidos: Array<{}>;
  speakers:  {};
  speaker: {};
  http: any;
  constructor(
    private fbstore: AngularFirestore,
    private route: ActivatedRoute,
    public _user: ImproversService,
    public _speaker: SpeakersService,
    public userService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();


    this.route.params.subscribe( parametros => {
      // console.log(parametros);
      this._user.getImprover(parametros['id']).subscribe( usuario =>{
        this.usuario = usuario.payload.data();
        this.usuario['id'] = parametros['id'];
        this.usuario['foto'] = ((this.usuario['foto'] === undefined || this.usuario['foto'] == '') ? '../../../assets/images/error-img.png' : this.usuario['foto']);
        this.usuario['birthDate'] = new Date(((this.usuario['birthDate'] === undefined) ? this.usuario['birthDtate'] : this.usuario['birthDate'])).toLocaleDateString('es-MX');
        this.ldfid = this.usuario['LFId'];
        this._user.getReferidos(this.ldfid).subscribe(refer => {
          this.referidos = refer.map( result => {
            return {
              fullName: result.payload.doc.data()['name']+" "+result.payload.doc.data()['lastName'],
              email: result.payload.doc.data()['email'],
              gender: result.payload.doc.data()['gender'],
            }
          })
        })
      })
      this._user.getCalls(parametros['id']).subscribe(calls => {
        this.llamadas = calls.map( result => {
          return {
            calificacion: result.payload.doc.data()['calImp'],
            sid: result.payload.doc.data()['sid'],
            speId: result.payload.doc.data()['speId'],
            uri: result.payload.doc.data()['uri'],
            recordings: result.payload.doc.data()['recordings'],
            date: firebase.firestore.FieldValue.serverTimestamp(),
            audio: "https://api.twilio.com/2010-04-01/Accounts/AC22ae1dad8bd832a2ecd25b28742feddc/Recordings/"+result.payload.doc.data()['sid']+".mp3"
          }
        })
        for (let index = 0; index < this.llamadas.length; index++) {
          this._speaker.getName(this.llamadas[index]['speId']).subscribe(data => {
            this.llamadas[index]['spe']= data.payload.data()
          })
          let element: any = this.llamadas[index];
          this.grades= element.calificacion;
          let estrellas: any = "Sin calificar";
          if(this.grades != undefined){
            var suma = this.grades.fl+this.grades.pr+this.grades.gr+this.grades.avg;
            if(suma >= 17){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span>';
            }
            else if(suma >= 13 && suma < 17){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span>';
            }
            else if(suma >= 10 && suma < 13){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
            }
            else if(suma >= 7 && suma < 10){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
            }
            else if(suma >= 4 && suma < 7){
              estrellas = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
            }
            else if(suma >= 0 && suma < 4){
              estrellas = '<span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
            }
          }
          this.llamadas[index]['stars'] = estrellas;
        }
      })
      this._user.getPlans(parametros['id']).subscribe(plans => {
        this.plans = plans.map( result => {
          return {
            status: result.payload.doc.data()['status'],
            dateCreated: new Date(result.payload.doc.data()['creada']).toLocaleString('en-US'),
            plan: result.payload.doc.data()['price'],
            userid: result.payload.doc.data()['uid'],
            planId: result.payload.doc.id
          }
        })
      })
      this._user.getPayments(parametros['id']).subscribe(pagos => {
        this.payments = pagos.map( result => {
          return {
            amount: result.payload.doc.data()['amount_paid'],
            dateCreated: new Date(result.payload.doc.data()['created']).toLocaleString('en-US'),
            pdfInvoice: result.payload.doc.data()['pdfInvoice']
          }
        })
      })
    })
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Improver', active: true }];
  }
  changeStatus(status: string, id: string){
    this.usuarioLogeado = JSON.parse(sessionStorage.getItem('authUser'));
    var estado = "";
    if(status == 'canceled'){
      estado = "Cancelar"
    }
    else if(status == 'suspended'){
      estado = "Suspender"
    }
    else if(status == 'active'){
      estado = "Activar"
    }
    Swal.fire({
      title: estado,
      text: '¿Está seguro que quiere '+estado+' este plan?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, '+estado,
      cancelButtonText: 'No, aún no',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Confirme su contraseña para continuar",
          input:'password',
          inputPlaceholder: 'Ingrese su contraseña',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar'
        }).then((inputValue) => {
          if (inputValue.value) {
            var corecto = false;
            this.fbstore.collection('perfiles').doc(this.usuarioLogeado.uid).ref.get().then(function (doc) {
              if (doc.exists) {
                if (doc.data()['password'] == inputValue.value) {
                  corecto = true;
                }
              } 
              else {
                Swal.fire({
                  icon: 'error',
                  title: 'Lo sentimos...',
                  text: 'Hubo un error. Intentelo más tarde',
                })
              }
            }).then(()=>{
              if(corecto == true){
                this.fbstore.collection('plans').doc(id).ref.update({status: status}).then(() => {
                  console.log("Plan actualizado");
                });
              }
              else{
                Swal.fire({
                  icon: 'error',
                  title: 'Lo sentimos...',
                  text: 'La contraseña es incorrecta',
                })
              }
            })
          }
        })
      }
    })
  }
}
