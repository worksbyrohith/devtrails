import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundReviewComponent } from './inbound-review.component';

describe('InboundReviewComponent', () => {
  let component: InboundReviewComponent;
  let fixture: ComponentFixture<InboundReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboundReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InboundReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
