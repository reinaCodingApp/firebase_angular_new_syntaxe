import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardTaskDialogComponent } from './add-card-task-dialog.component';

describe('AddCardTaskDialogComponent', () => {
  let component: AddCardTaskDialogComponent;
  let fixture: ComponentFixture<AddCardTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardTaskDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCardTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
