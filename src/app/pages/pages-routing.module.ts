import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KanbanComponent } from './kanban/kanban.component';
import { HomeComponent } from './home/home.component';
import { ImproversComponent } from './improvers/improvers.component';
import { ImproverComponent } from './improver/improver.component';
import { SpeakersComponent } from './speakers/speakers.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { BannersComponent } from './banners/banners.component';
import { PagosComponent } from './pagos/pagos.component';
import { FacturasComponent } from './facturas/facturas.component';
import { SoporteComponent } from './soporte/soporte.component';
import { MetricasComponent } from './metricas/metricas.component';
import { ChartjsComponent } from './chart/chartjs/chartjs.component';
import { PotentialsComponent } from './potentials/potentials.component';
import { PotentialComponent } from './potential/potential.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'metricas', component: MetricasComponent },
    { path: 'improvers', component: ImproversComponent },
    { path: 'improver/:id', component: ImproverComponent },
    { path: 'speakers', component: SpeakersComponent },
    { path: 'speaker/:id', component:  SpeakerComponent },
    { path: 'administrators', component: AdministratorsComponent },
    { path: 'banners', component: BannersComponent },
    { path: 'pagos', component: PagosComponent },
    { path: 'facturas', component: FacturasComponent },
    { path: 'soporte', component: SoporteComponent },
    { path: 'chart', component: ChartjsComponent },
    { path: 'potentials', component: PotentialsComponent },
    { path: 'potential/:id', component:  PotentialComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
