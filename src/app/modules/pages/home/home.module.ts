import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../../shared/material.module';

// Components
import { ConfirmationModal } from "../../core/modals/confirmation/confirmation.modal";
import { VistaListadoPedidosComponent } from '../vista-listado-pedidos/vista-listado-pedidos.component';
import { VistaAsignacionRutasComponent } from '../vista-asignacion-rutas/vista-asignacion-rutas.component';
import { ReporteEntregasComponent } from '../reporte-entregas/reporte-entregas.component';
import { FormularioRegistroPedidosComponent } from '../formulario-registro-pedidos/formulario-registro-pedidos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarPedidoComponent } from '../formulario-registro-pedidos/editar-pedido/editar-pedido.component';


@NgModule({
  declarations: [
    HomeComponent,
    ConfirmationModal,
    VistaListadoPedidosComponent,
    VistaAsignacionRutasComponent,
    ReporteEntregasComponent,
    FormularioRegistroPedidosComponent,
    EditarPedidoComponent,
    VistaAsignacionRutasComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],


})
export class HomeModule { }
