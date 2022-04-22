import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { validateAllFormFields } from '../../utils/validate';
import { hasFieldError } from '../../utils/validate';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent implements OnInit, OnChanges {
  @Input('minProductPrice') minProductPrice: number = 0;
  @Input('maxProductPrice') maxProductPrice: number = 0;
  minPriceSliderValue: number = 0;
  maxPriceSliderValue: number = 0;
  minPriceInputValue: number = 0;
  maxPriceInputValue: number = 0;
  options: Options = {};

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.minPriceSliderValue = this.minProductPrice;
    this.maxPriceSliderValue = this.maxProductPrice;
    this.minPriceInputValue = this.minProductPrice;
    this.maxPriceInputValue = this.maxProductPrice;
    this.options = {
      floor: this.minProductPrice,
      ceil: this.maxProductPrice,
      // hidePointerLabels: true,
      hideLimitLabels: true,
      step: 0.01,
    };

  }

  onPriceInputChange() {
    // if (this.minPriceInputValue < this.minProductPrice){
    //   this.minPriceInputValue = this.minProductPrice;
    // } else if (this.minPriceInputValue > this.maxProductPrice){
    //   this.minPriceInputValue = this.maxProductPrice;
    // }
    // if (this.maxPriceInputValue < this.minProductPrice){
    //   this.maxPriceInputValue = this.minProductPrice;
    // } else if (this.maxPriceInputValue > this.minProductPrice){
    //   this.maxPriceInputValue = this.maxProductPrice;
    // }

    this.minPriceSliderValue = this.minPriceInputValue;
    this.maxPriceSliderValue = this.maxPriceInputValue;
  }
  onPriceSliderChange() {
    console.log('slider changed');
    this.minPriceInputValue = this.minPriceSliderValue;
    this.maxPriceInputValue = this.maxPriceSliderValue;
  }
}
