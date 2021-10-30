import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SpeakersService {
  speakers = [];
  speaker = [];
  constructor(
    public afstore: AngularFirestore
  ) { }

  getSpeaker(id: string) {
    return this.afstore.collection('perfiles').doc(id).snapshotChanges();
  }

  async getSpeakers() {
    this.afstore.collection('perfiles', ref => ref.where('role', '==', 'conversador')).snapshotChanges()
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
            spei: result.payload.doc.data()['spei']
          };
        });
      })
  }

  getName(id: string) {
    return this.afstore.collection('perfiles').doc(id).snapshotChanges();
  }
  getSpeakerCalls(id: string) {
    return this.afstore.collection('calls', ref => ref.where('speId','==', id)).snapshotChanges();
  }
  getReferidos(id: string) {
    return this.afstore.collection('perfiles', ref => ref.where('idref','==', id)).snapshotChanges();
  }
  getPayments(id: string) {
    return this.afstore.collection('pagos', ref => ref.where('uid','==', id)).snapshotChanges();
  }
}
