import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/auth.models';
import { MENU } from '../../layouts/shared/sidebar/menu';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    menuItems: any = MENU;
    items: any = [
      "",
      "/",
      "/improvers",
      "/potentials",
      "/speakers",
      "/administrators",
      "/banners",
      "/pagos",
      "/facturas",
      "/notifications",
      "/soporte"
    ];
    saveItems: any = [];
    constructor(private http: HttpClient, private fbstore: AngularFirestore, public authenticationService: AuthenticationService) { }

    getAll() {
        return this.http.get<User[]>(`/api/login`);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    async applyPermissions(){
      let uid = await this.authenticationService.currentUser()["uid"];
      await this.fbstore.collection('perfiles').doc(uid).snapshotChanges().subscribe(res => {
        if(res.payload.data()['role'] == 'admin'){
          this.items.forEach((element, i) => {
            if(res.payload.data()['permissions'].findIndex(item => item.route == element) == -1){
              let index = this.menuItems.findIndex(item => item.link == element);
              if(index > -1){
                  //this.menuItems.splice(index, 1);
                  this.menuItems[index].status = false;
              }
            }
            else{
              this.menuItems[i].status = true;
            }
          });
        }
        else if(res.payload.data()['role'] == 'superadmin'){
          this.menuItems.forEach((element, index) => {
            this.menuItems[index].status = true;
          });
        }
      });
    }
}
