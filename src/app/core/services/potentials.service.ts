import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PotentialsService {
  speakers = [];
  speaker = [];
  constructor(
    public afstore: AngularFirestore
  ) { }

  getPotential(id: string) {
    return this.afstore.collection('potenciales').doc(id).snapshotChanges();
  }

  async getPotentials() {
    this.afstore.collection('potenciales').snapshotChanges()
      .subscribe(data => {
        this.speakers = data.map(result => {
          return {
            userId: result.payload.doc.id,
            userName: result.payload.doc.data()['name'],
            userLastName: result.payload.doc.data()['lastName'],
            birthDtate: result.payload.doc.data()['birthDtate'],
            email: result.payload.doc.data()['email'],
            foto: result.payload.doc.data()['foto'],
            gender: result.payload.doc.data()['gender'],
            mtoken: result.payload.doc.data()['mtoken'],
            phone: result.payload.doc.data()['phone'],
            spei: result.payload.doc.data()['spei'],
            idioma: result.payload.doc.data()['idioma']
          };
        });
      })
  }

  getName(id: string) {
    return this.afstore.collection('potenciales').doc(id).snapshotChanges();
  }
}
