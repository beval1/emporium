import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSpecificationsComponent } from './manage-specifications.component';

describe('ManageSpecificationsComponent', () => {
  let component: ManageSpecificationsComponent;
  let fixture: ComponentFixture<ManageSpecificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSpecificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
