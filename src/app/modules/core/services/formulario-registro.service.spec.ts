import { TestBed } from '@angular/core/testing';

import { FormularioRegistroService } from './formulario-registro.service';

describe('FormularioRegistroService', () => {
  let service: FormularioRegistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormularioRegistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
