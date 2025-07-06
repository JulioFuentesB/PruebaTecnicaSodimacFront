import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAsignacionRutasComponent } from './vista-asignacion-rutas.component';

describe('VistaAsignacionRutasComponent', () => {
  let component: VistaAsignacionRutasComponent;
  let fixture: ComponentFixture<VistaAsignacionRutasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaAsignacionRutasComponent]
    });
    fixture = TestBed.createComponent(VistaAsignacionRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
