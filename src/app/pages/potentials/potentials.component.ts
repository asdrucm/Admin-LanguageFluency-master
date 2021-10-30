import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPotentialComponent } from '../add-potential/add-potential.component';
import { UserProfileService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-potentials',
  templateUrl: './potentials.component.html',
  styleUrls: ['./potentials.component.scss']
})
export class PotentialsComponent implements OnInit {
  userList = [];
  cargando = false;
  breadCrumbItems: Array<{}>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private fbstore: AngularFirestore,
    private modalService: NgbModal,
    public userService: UserProfileService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Potentials', active: true }];
    this.getPotentials();
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
      scrollX: true,
      buttons: [
        {
            extend: 'excelHtml5',
            title: 'Reporte general potenciales'
        },
        {
          extend: 'copyHtml5',
          title: 'Reporte general potenciales'
        }
      ],
      columnDefs: [
        {
          visible: false,
          targets: [5]
        },
        {
          visible: false,
          targets: [7]
        },
        {
          visible: false,
          targets: [10]
        }
      ]
    };
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dtTrigger.unsubscribe();
  }

  async getPotentials() {
    try {
      await this.fbstore.collection('potenciales', ref => ref.where('status', '==', 'pending')).snapshotChanges()
      .subscribe(data => {
        //console.log(data);
        this.userList = data.map( result => {
          //console.log(result);
          let today: any = new Date();
          let birthDate = new Date(new Date((result.payload.doc.data()['birthDate'] === undefined) ? result.payload.doc.data()['birthDtate'] : result.payload.doc.data()['birthDate']).toLocaleString('en-US'));

          //let birthDateF = Math.floor((today - new Date(birthDate).getTime()) / 3.15576e+10);
          //console.log(birthDateF);

          let birthday = +birthDate;
          birthday = ~~((today - birthday) / (31557600000));
          let bday = new Date(birthDate).toLocaleDateString();
          return {
            userId: result.payload.doc.id,
            userName: result.payload.doc.data()['name'],
            userLastName: result.payload.doc.data()['lastName'],
            userEmail: result.payload.doc.data()['email'],
            userGender: result.payload.doc.data()['gender'],
            userLfNumber: result.payload.doc.data()['LFId'],
            userCountry: result.payload.doc.data()['country'],
            userLanguage: result.payload.doc.data()['idioma'],
            userBirthDate: birthday,
            userStatus: result.payload.doc.data()['status'],
            userDayOfBirth: bday,
            userPhone: result.payload.doc.data()['phone'],
            userCreatedAt:  result.payload.doc.data()['creado'].toDate().toLocaleString('en-US')
          }
          // this.cargando = false;
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

  changeStatus(status: string, id: string){
    Swal.fire({
      title: '¿Quieres aprobar este usuario potencial?',
      text: 'Pasará a ser un Speaker',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'No, aún no',
      cancelButtonColor: '#d33',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.fbstore.collection('potenciales').doc(id).update({status: status}).then(() => {
          console.log("Status actualizado");

          this.fbstore.collection('potenciales').doc(id).snapshotChanges().subscribe((doc) => {
            let user = doc.payload.data();
            user['role'] = "conversador";

            // this.http.post('https://us-central1-ejemplocrud-e7eb1.cloudfunctions.net/regAdmin',{
            //   email: user['email'],
            //   name: user['name'],
            //   lastName: user['lastName'],
            //   password: user['password']
            // }).subscribe(async (data: any) => {
            //   if (data.error) {
            //     console.log('Error=>', data.error);
            //     Swal.fire({
            //       title: 'Hay un problema',
            //       text: data.error.message,
            //       icon: 'warning',
            //       showCancelButton: false,
            //       confirmButtonColor: '#5438dc'
            //     });
            //   } else {
            //     console.log(data);
            //     await this.fbstore.collection('perfiles').doc(data.uid).set(user).then(res => {
            //       console.log('Perfil creado=>', res);
            //     })
            //   }
            // });

            this.fbstore.collection('perfiles').doc(id).set(user).then(() => {
              console.log("Usuario copiado");
            });

          });

        });
      }
    });
  }

  newPotential() {
    const modalRef = this.modalService.open(AddPotentialComponent);
  }
}
