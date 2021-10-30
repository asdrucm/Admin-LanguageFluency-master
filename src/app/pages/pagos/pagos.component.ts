import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfileService } from '../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  userList = [];
  cargando = false;
  usuarioLogeado;
  getMonths = [];
  collectGetmonths:Array<{}>;
  breadCrumbItems: Array<{}>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  year: any = new Date().getFullYear();
  selectMonth: any = (new Date().getMonth() + 1);
  selectYear: any = this.year;
  yearMonthSelect: any = this.selectMonth + "/1/" + this.selectYear;
  yearMonth: any = (new Date().getMonth() + 1) + "/1/" + this.year;
  typeUser: any = "Speakers";

  constructor(
    private fbstore: AngularFirestore,
    public userService: UserProfileService,
    private http: HttpClient    
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Pagos', active: true }];
    this.getUsers('conversador');
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      retrieve: true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      },
      dom: 'Bfrtip',
      buttons: [
        {
            extend: 'excelHtml5',
            title: 'Reporte general speakers'
        },
        {
          extend: 'copyHtml5',
          title: 'Reporte general speakers'
        }
      ]
    };
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
  async getUsers(role) {
    try {
      await this.fbstore.collection('perfiles', ref => ref.where('role', '==', role)).snapshotChanges()
      .subscribe(data => {
        //console.log(data);
        this.userList = data.map( result => {
          //console.log(result);
          let today: any = new Date();
          let birthDate = new Date(new Date(result.payload.doc.data()['birthDtate']).toLocaleString('en-US'));
          let userPay = (result.payload.doc.data()['userPay'] === undefined) ? [] : result.payload.doc.data()['userPay'];
          //let birthDateF = Math.floor((today - new Date(birthDate).getTime()) / 3.15576e+10);
          //console.log(birthDateF);
          let birthday = +birthDate;
          birthday = ~~((today - birthday) / (31557600000));
          return {
            userId: result.payload.doc.id,
            userName: result.payload.doc.data()['name'],
            userLastName: result.payload.doc.data()['lastName'],
            userEmail: result.payload.doc.data()['email'],
            userGender: result.payload.doc.data()['gender'],
            userLfNumber: result.payload.doc.data()['LFId'],
            userLanguage: result.payload.doc.data()['idioma'],
            userBirthDate: birthday,
            userStatus: result.payload.doc.data()['status'],
            userCalls: '',
            amountCallsMade: 0,
            referralAmount: 0,
            totalAmount: 0,
            userStatusPay: ((userPay.indexOf(this.yearMonthSelect) > -1) ? true : false),
            userPay: userPay
          }
          // this.cargando = false;
        });

        //this.userList = this.userList.filter(function(n){ return n != undefined });

        this.userList.forEach((element) => {
          this.fbstore.collection('calls', ref => ref.where('speId', '==', element.userId)).snapshotChanges()
          .subscribe(doc => {
            let numberCalls = 0;
            let minutes: number = 0;
            element.userCalls = "<b class='text-info'>" + numberCalls + "</b> llamadas<br>" + "<b class='text-info'>" + minutes.toFixed(2) + "</b> minutos";

            doc.map(result2 => {
              this.getInfoTwilio(result2.payload.doc.data()['sid']).subscribe(data2 => {
                //console.log(element.userId, data2['date_created']);
                let callMonth = (new Date(data2['date_created']).getMonth() + 1);
                let callYear = new Date(data2['date_created']).getFullYear();
                //console.log(callMonth, callYear, this.selectMonth, this.selectYear);
                if (this.selectMonth == callMonth && this.selectYear == callYear) {
                  numberCalls++;
                  element.amountCallsMade = numberCalls * 15;
                  element.referralAmount = 0 * 0;
                  element.totalAmount = (element.amountCallsMade + element.referralAmount).toFixed(2);
                  console.warn("Mismo mes");
                  minutes += (parseInt(data2['duration']) / 60);
                  element.userCalls = "<b class='text-info'>" + numberCalls + "</b> llamadas<br>" + "<b class='text-info'>" + minutes.toFixed(2) + "</b> minutos";
                }
                else{
                  console.log("Diferente mes");
                }
              });
            });

          });
        });        
        // this.cargando = false;
        this.dtTrigger.next();
        setTimeout(() => {
          this.cargando = false;
        }, 2000);
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dtTrigger.unsubscribe();
  }

  selectType(event){
    this.typeUser = event.target.value;

    if(this.typeUser == "Speakers"){
      this.getUsers('conversador');
    }
    else{
      this.getUsers('cliente');
    }
  }

  selectMonths(event){
    let monthDate = event.target.value;
    this.selectMonth = (new Date(monthDate).getMonth() + 1);
    this.selectYear = new Date(monthDate).getFullYear();
    //console.log(this.selectMonth, this.selectYear);

    if(this.typeUser == "Speakers"){
      this.getUsers('conversador');
    }
    else{
      this.getUsers('cliente');
    }
  }

  changeStatus(pay: any, id: string){
    this.usuarioLogeado = JSON.parse(sessionStorage.getItem('authUser'));
    console.log(pay);
    Swal.fire({
      title: '¿Quieres marcar el mes actual como pagado de este usuario?',
      text: 'Este mes pasará a estado pagado',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'No, aún no',
      cancelButtonColor: '#d33',
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
        }).then((inputValue)=>{
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
                pay.push(this.yearMonthSelect);
                this.fbstore.collection('perfiles').doc(id).update({userPay: pay}).then(() => {
                  console.log("Status actualizado");
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
    });
  }

  getInfoTwilio(uri){
    var url = 'https://api.twilio.com/2010-04-01/Accounts/9aa31c2d0d5d07a9ff66af0b2be1e969/Calls/'+uri+'.json';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa('9aa31c2d0d5d07a9ff66af0b2be1e969:f59fe5f034ce4cac5ebc6aebe9d3aad2')
      })
    }
    return this.http.get(url, httpOptions);
  }

}
