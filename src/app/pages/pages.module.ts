import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiModule } from '../shared/ui/ui.module';
import { WidgetModule } from '../shared/widget/widget.module';

import { PagesRoutingModule } from './pages-routing.module';

import { NgbNavModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxEchartsModule } from 'ngx-echarts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DndModule } from 'ngx-drag-drop';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { KanbanComponent } from './kanban/kanban.component';
import { EmailModule } from './email/email.module';
import { UIModule } from './ui/ui.module';
import { IconsModule } from './icons/icons.module';
import { ChartModule } from './chart/chart.module';
import { FormModule } from './form/form.module';
import { TablesModule } from './tables/tables.module';
import { MapsModule } from './maps/maps.module';
import { HomeComponent } from './home/home.component';
import { ImproversComponent } from './improvers/improvers.component';
import { SpeakersComponent } from './speakers/speakers.component';
import { DataTablesModule } from 'angular-datatables';
import { ImproverComponent } from './improver/improver.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { BannersComponent } from './banners/banners.component';
import { PagosComponent } from './pagos/pagos.component';
import { FacturasComponent } from './facturas/facturas.component';
import { SoporteComponent } from './soporte/soporte.component';
import { MetricasComponent } from './metricas/metricas.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddBannerComponent } from './add-banner/add-banner.component';
import { PotentialsComponent } from './potentials/potentials.component';
import { PotentialComponent } from './potential/potential.component';
import { AddPotentialComponent } from './add-potential/add-potential.component';
import * as echarts from 'echarts';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 0.3
};

@NgModule({
  declarations: [DashboardComponent, CalendarComponent, ChatComponent, KanbanComponent, HomeComponent, ImproversComponent, SpeakersComponent, ImproverComponent, AdministratorsComponent, BannersComponent, PagosComponent, FacturasComponent, SoporteComponent, MetricasComponent, SpeakerComponent, AddAdminComponent, AddBannerComponent, PotentialsComponent, PotentialComponent, AddPotentialComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    UiModule,
    UIModule,
    Ng2SearchPipeModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgApexchartsModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    PerfectScrollbarModule,
    DndModule,
    FullCalendarModule,
    EcommerceModule, EmailModule,
    IconsModule,
    ChartModule,
    FormModule,
    TablesModule,
    MapsModule,
    LeafletModule,
    WidgetModule,
    DataTablesModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class PagesModule { }
