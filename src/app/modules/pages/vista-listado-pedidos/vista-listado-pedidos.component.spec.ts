import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaListadoPedidosComponent } from './vista-listado-pedidos.component';

describe('VistaListadoPedidosComponent', () => {
  let component: VistaListadoPedidosComponent;
  let fixture: ComponentFixture<VistaListadoPedidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaListadoPedidosComponent]
    });
    fixture = TestBed.createComponent(VistaListadoPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
