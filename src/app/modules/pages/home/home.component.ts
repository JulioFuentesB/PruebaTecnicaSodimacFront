import { Component, OnInit } from '@angular/core';
import { HeaderObj, PageService } from '../../core/services/page.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeTab: string = 'orders';
  loading = false;

  tabs = [
    {
      id: 'orders',
      label: 'Lista Pedidos',
      icon: 'list_alt',
      disabled: false,
      badge: false
    },
    {
      id: 'register',
      label: 'Nuevo Pedido',
      icon: 'note_add',
      disabled: false,
      badge: false
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: 'group',
      disabled: false,
      badge: false
    }, {
      id: 'productos',
      label: 'Productos',
      icon: 'inventory_2', // Ícono adecuado para productos/inventario
      disabled: false,
      badge: false
    },
    {
      id: 'routes',
      label: 'Asignar Rutas',
      icon: 'alt_route',
      disabled: false,
      badge: false // Ejemplo de badge
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'assessment',
      disabled: false,
      badge: false
    }
  ];

  constructor(private pageService: PageService) {
    this.pageService.setHeaderPage(new HeaderObj('TEST', '/', false));
  }

  ngOnInit(): void {
    // Puedes cargar datos iniciales aquí si es necesario
    // this.activeTab="orders"
  }

  changeTab(tabId: string): void {
    if (this.activeTab === tabId) return;

    this.loading = true;
    this.activeTab = tabId;

    // Simular carga (opcional)
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  isActive(tabId: string): boolean {
    return this.activeTab === tabId;
  }

}
