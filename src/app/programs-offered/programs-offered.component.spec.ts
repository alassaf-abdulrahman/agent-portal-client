import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsOfferedComponent } from './programs-offered.component';

describe('ProgramsOfferedComponent', () => {
  let component: ProgramsOfferedComponent;
  let fixture: ComponentFixture<ProgramsOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramsOfferedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramsOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
