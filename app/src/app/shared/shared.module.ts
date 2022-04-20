import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ProductComponent } from './components/product/product.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [SpinnerComponent, ProductComponent, ProductFilterComponent],
  imports: [CommonModule, RouterModule, NgbModule, FontAwesomeModule],
  exports: [SpinnerComponent, ProductComponent, ProductFilterComponent],
})
export class SharedModule {}
