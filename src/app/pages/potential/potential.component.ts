import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleUsuario } from '../../core/models/usuario.model';
import { PotentialsService } from '../../core/services/potentials.service';
import { UserProfileService } from '../../core/services/user.service';

@Component({
  selector: 'app-potential',
  templateUrl: './potential.component.html',
  styleUrls: ['./potential.component.scss']
})
export class PotentialComponent implements OnInit {
  usuario: DetalleUsuario = {};
  breadCrumbItems: Array<{}>;
  constructor(
    private route: ActivatedRoute,
    public _user: PotentialsService,
    public userService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.userService.applyPermissions();
    this.route.params.subscribe( parametros => {
      // console.log(parametros);
      this._user.getPotential(parametros['id']).subscribe( usuario =>{
        this.usuario = usuario.payload.data();
        this.usuario['id'] = parametros['id'];
        this.usuario['foto'] = ((this.usuario['foto'] === undefined || this.usuario['foto'] == '') ? '../../../assets/images/error-img.png' : this.usuario['foto']);
        this.usuario['birthDate'] = new Date(((this.usuario['birthDate'] === undefined) ? this.usuario['birthDtate'] : this.usuario['birthDate'])).toLocaleDateString('es-MX');
        // console.log(this.usuario);
      } )
    } )
  }

}
