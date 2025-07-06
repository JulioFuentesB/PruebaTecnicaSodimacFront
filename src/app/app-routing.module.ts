import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarPedidoComponent } from './modules/pages/formulario-registro-pedidos/editar-pedido/editar-pedido.component';
import { VistaListadoPedidosComponent } from './modules/pages/vista-listado-pedidos/vista-listado-pedidos.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'vista-listado-pedidos',
    component: VistaListadoPedidosComponent
  },
   {
    path: 'editar-pedido/:id',
    component: EditarPedidoComponent
  },
  {
    path: '**',
    redirectTo: 'home', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
