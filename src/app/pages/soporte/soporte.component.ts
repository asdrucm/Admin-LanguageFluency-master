import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserProfileService } from '../../core/services/user.service';
import { isNumeric } from 'rxjs/util/isNumeric';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.scss']
})
export class SoporteComponent implements OnInit {
  supportList = [];
  cargando = false;
  breadCrumbItems: Array<{}>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  response: string = "";
  constructor(
    private fbstore: AngularFirestore,
    private http: HttpClient,
    public userService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Soporte', active: true }];
    this.getSupport();
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
            title: 'Reporte general improvers'
        },
        {
          extend: 'copyHtml5',
          title: 'Reporte general improvers'
        }
      ]
    };
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dtTrigger.unsubscribe();
  }

  async getSupport() {
    try {
      await this.fbstore.collection('support').snapshotChanges()
      .subscribe(data => {
        //console.log(data);
        this.supportList = data.map( result => {

          return {
            supportId: result.payload.doc.id,
            supportFrom: result.payload.doc.data()['from'],
            supportMessage: result.payload.doc.data()['message'],
            supportStatus: result.payload.doc.data()['status'],
            supportResponse: result.payload.doc.data()['response'],
            creationTime: result.payload.doc.data()['creationTime']
            //creationTime: (isNumeric(result.payload.doc.data()['creationTime'])) ? result.payload.doc.data()['creationTime']: result.payload.doc.data()['creationTime'].toDate()
          }
          // this.cargando = false;
        });
        this.supportList.forEach((element) => {
          this.fbstore.collection('perfiles').doc(element.supportFrom).snapshotChanges()
          .subscribe(doc => {
            element.supportName = doc.payload.data()['name']+" "+doc.payload.data()['lastName'];
            element.supportFrom = doc.payload.data()['email'] + " | " + ((doc.payload.data()['role'] == 'conversador') ? 'Speaker': 'Improver');
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

  sendSupport(id, info){
    console.log(this.response);
    this.http.post('https://us-central1-ejemplocrud-e7eb1.cloudfunctions.net/sendEmailSupport',{
      email: info.split("|")[0].trim(),
      response: this.response
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
        await this.fbstore.collection('support').doc(id).update({status: 'answered', response: this.response}).then(res => {
          console.log('Respuesta enviada=>', res);
        })
      }
    });
  }

}
