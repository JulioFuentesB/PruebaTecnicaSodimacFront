import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEntregasComponent } from './reporte-entregas.component';

describe('ReporteEntregasComponent', () => {
  let component: ReporteEntregasComponent;
  let fixture: ComponentFixture<ReporteEntregasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteEntregasComponent]
    });
    fixture = TestBed.createComponent(ReporteEntregasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
