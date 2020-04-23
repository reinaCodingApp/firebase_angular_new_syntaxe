import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditEditTemplateComponent } from './audit-edit-template.component';

describe('AuditEditTemplateComponent', () => {
  let component: AuditEditTemplateComponent;
  let fixture: ComponentFixture<AuditEditTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditEditTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditEditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
