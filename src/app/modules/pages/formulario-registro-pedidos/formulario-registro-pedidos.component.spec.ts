import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRegistroPedidosComponent } from './formulario-registro-pedidos.component';

describe('FormularioRegistroPedidosComponent', () => {
  let component: FormularioRegistroPedidosComponent;
  let fixture: ComponentFixture<FormularioRegistroPedidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioRegistroPedidosComponent]
    });
    fixture = TestBed.createComponent(FormularioRegistroPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
