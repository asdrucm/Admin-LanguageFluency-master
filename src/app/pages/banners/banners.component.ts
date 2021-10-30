import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBannerComponent } from '../add-banner/add-banner.component';
import { UserProfileService } from '../../core/services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  bannerList = [];
  cargando = false;
  breadCrumbItems: Array<{}>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private fbstore: AngularFirestore,
    private modalService: NgbModal,
    public userService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Banners', active: true }];
    this.getBanners();
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
      }
    };
  }

  async getBanners() {
    try {
      await this.fbstore.collection('banners').snapshotChanges()
      .subscribe(data => {
        //console.log(data);
        this.bannerList = data.map( result => {
          //console.log(result);
          return {
            bannerId: result.payload.doc.id,
            file: result.payload.doc.data()['file'],
            location: result.payload.doc.data()['location'],
            language: result.payload.doc.data()['language'],
            creationTime: result.payload.doc.data()['creationTime']
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

  newBanner() {
    const modalRef = this.modalService.open(AddBannerComponent);
  }

  deleteBanner(id) {
    Swal.fire({
      title: '¿Deseas eliminar el banner?',
      text: "Ya no podrá recuperarse",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fbstore.collection('banners').doc(id).delete().then(res => {
          console.log('Banner eliminado=>', id);
        });
      }
    });
  }

}
