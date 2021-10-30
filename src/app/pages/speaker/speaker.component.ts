import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleUsuario } from '../../core/models/usuario.model';
import { SpeakersService } from '../../core/services/speakers.service';
import { UserProfileService } from '../../core/services/user.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.scss']
})
export class SpeakerComponent implements OnInit {
  usuario: DetalleUsuario = {};
  grades: any;
  totalGrades = [];
  getMonths = [];
  collectGetmonths:Array<{}>;
  ldfid: any;
  tstars: String;
  llamadas:  Array<{}>;
  breadCrumbItems: Array<{}>;
  payments: Array<{}>;
  referidos: Array<{}>;
  constructor(
    private route: ActivatedRoute,
    public _user: SpeakersService,
    public userService: UserProfileService,
    public _speaker: SpeakersService
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.route.params.subscribe( parametros => {
      this._user.getSpeaker(parametros['id']).subscribe( usuario =>{
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
      this._user.getSpeakerCalls(parametros['id']).subscribe(calls => {
        this.llamadas = calls.map( result => {
          return {
            calificacion: result.payload.doc.data()['calSpe'],
            sid: result.payload.doc.data()['sid'],
            speId: result.payload.doc.data()['speId'],
            inmpId: result.payload.doc.data()['inmpId'],
            uri: result.payload.doc.data()['uri'],
            recordings: result.payload.doc.data()['recordings'],
            date: firebase.firestore.FieldValue.serverTimestamp(),
            audio: "https://api.twilio.com/2010-04-01/Accounts/AC22ae1dad8bd832a2ecd25b28742feddc/Recordings/"+result.payload.doc.data()['sid']+".mp3"
          }
        })        
        for (let index = 0; index < this.llamadas.length; index++) {
          this._speaker.getName(this.llamadas[index]['inmpId']).subscribe(data => {
            this.llamadas[index]['spe']= data.payload.data()
          })
          let element: any = this.llamadas[index];
          this.grades= element.calificacion;
          let estrellas: any = "Sin calificar";
          if(this.grades != undefined){
            var suma = this.grades.fl+this.grades.pr+this.grades.gr+this.grades.avg;
            this.totalGrades.push(suma);
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
        console.log(this.llamadas);
        if(this.totalGrades.length == 0 ){
          this.tstars = '<span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
        }
        else{
          var cont = 0;
          var max = 20*this.totalGrades.length ;
          for (let index = 0; index < this.totalGrades.length; index++) {
            cont = this.totalGrades[index]+cont;
          }
          var calPor = cont*100/max;
          if(calPor >= 80){
            this.tstars = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span>';
          }
          else if(calPor >= 60 && calPor < 80){
            this.tstars = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span>';
          }
          else if(calPor >= 40 && calPor < 60){
            this.tstars = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
          }
          else if(calPor >= 20 && calPor < 40){
            this.tstars = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
          }
          else if(calPor >= 10){
            this.tstars = '<span class="mdi mdi-star text-warning"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span><span class="mdi mdi-star"></span>';
          }
        }
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
    var limitMonth = new Date().getMonth();
      var limitYear = new Date().getFullYear();
      var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      var mesesSelected = ""
      for (let index = 0; index <= limitMonth; index++) {
        var fechaOutPut = '1/'+limitMonth+'/'+limitYear;
        if(index == limitMonth){
          mesesSelected = "selected";
        }
        this.getMonths.push({mes:meses[index],fecha:fechaOutPut,selectMonth:mesesSelected,year:limitYear});
      }
      this.collectGetmonths = this.getMonths;
  }

}
