import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopcViewerComponent } from './copc-viewer.component';

describe('CopcViewerComponent', () => {
  let component: CopcViewerComponent;
  let fixture: ComponentFixture<CopcViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopcViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopcViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
