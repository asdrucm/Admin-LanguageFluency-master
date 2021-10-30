import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserProfileService } from '../../core/services/user.service';
import { isNumeric } from 'rxjs/util/isNumeric';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  invoiceList = [];
  cargando = false;
  breadCrumbItems: Array<{}>;
  dtOptions: any = {};
  downloadURL: Observable<string>;
  dtTrigger: Subject<any> = new Subject<any>();
  base64: any;
  fileSubir: any;
  ifInvoice: boolean = false;
  ifInvoiceBtn: any;
  constructor(
    private fbstore: AngularFirestore,
    private http: HttpClient,
    public userService: UserProfileService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.breadCrumbItems = [{ label: 'Language Fluency' }, { label: 'Facturas', active: true }];
    this.getInvoice();
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
        'copy',
        'print',
        'excel',
        'pdf'
      ]
    };
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dtTrigger.unsubscribe();
  }

  async getInvoice() {
    try {
      await this.fbstore.collection('invoice').snapshotChanges()
      .subscribe(data => {
        //console.log(data);
        this.invoiceList = data.map( result => {

          return {
            invoiceId: result.payload.doc.id,
            invoiceFrom: result.payload.doc.data()['from'],
            invoiceMessage: result.payload.doc.data()['message'],
            invoiceTaxData: result.payload.doc.data()['taxData']/*.join("<br>")*/,
            invoiceStatus: result.payload.doc.data()['status'],
            creationTime: result.payload.doc.data()['creationTime'],
            invoiceUrl: result.payload.doc.data()['file'],
            //creationTime: (isNumeric(result.payload.doc.data()['creationTime'])) ? result.payload.doc.data()['creationTime']: result.payload.doc.data()['creationTime'].toDate()
          }
          // this.cargando = false;
        });
        this.invoiceList.forEach((element) => {
          this.fbstore.collection('perfiles').doc(element.invoiceFrom).snapshotChanges()
          .subscribe(doc => {
            element.invoiceFrom = doc.payload.data()['email'] + " | " + ((doc.payload.data()['role'] == 'conversador') ? 'Speaker': 'Improver');
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

  onFileSelected(event, idbtn) {
    let file = event.target.files;
    /*this.readBase64(file)
    .then((data) => {
        console.log(data);
    });*/
    //Check File is not Empty
    if (file.length > 0) {
        // Select the very first file from list
        let fileToLoad = file[0];
        this.fileSubir = file[0];
        console.log(fileToLoad);
        // FileReader function for read the file.
        let fileReader = new FileReader();
        // Onload of file read the file content
        fileReader.onload = (fileLoadedEvent) => {
            this.base64 = fileLoadedEvent.target.result;
            // Print data in console
            //console.log(this.base64);
            this.ifInvoice = true;
            this.ifInvoiceBtn = idbtn;
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
    }
  }

  sendInvoice(id, info){
    const fileNom = id+"_"+this.fileSubir.name;
    const filePath = 'facturas/'+fileNom;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload('facturas/'+fileNom, this.fileSubir);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              console.log(url);
              this.fbstore.collection('invoice').doc(id).update({
                file: url,
                upLoadedTime: new Date()
              }).then(res => {
                this.ifInvoiceBtn = "";
                Swal.fire({
                  title: 'Enviado',
                  text: "La factura fue enviada correctamente.",
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#5438dc'
                });
              });
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
    this.http.post('https://us-central1-ejemplocrud-e7eb1.cloudfunctions.net/sendEmailInvoice',{
      email: info.split("|")[0].trim(),
      file: this.base64
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
        await this.fbstore.collection('invoice').doc(id).update({status: 'sended'}).then(res => {
          Swal.fire({
            title: 'Enviado',
            text: "La factura fue enviada correctamente.",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#5438dc'
          });
        })
      }
    });
  }

  /*private readBase64(file): Promise<any> {
    const reader = new FileReader();
    const future = new Promise((resolve, reject) => {
      reader.addEventListener('load', function () {
        resolve(reader.result);
      }, false);
      reader.addEventListener('error', function (event) {
        reject(event);
      }, false);

      reader.readAsDataURL(file);
    });
    return future;
  }*/

}
