import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent implements OnInit, OnChanges {
  @Input('minProductPrice') minProductPrice: number = 0;
  @Input('maxProductPrice') maxProductPrice: number = 0;
  @Output() orderChanged = new EventEmitter<string>();
  @Output() priceChanged = new EventEmitter<number[]>();
  minPriceSliderValue: number = 0;
  maxPriceSliderValue: number = 0;
  minPriceInputValue: number = 0;
  maxPriceInputValue: number = 0;
  selectedOrder: string = 'Ascending';
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

  onOrderChange(){
    this.orderChanged.emit(this.selectedOrder)
  }

  onPriceInputChange() {
    this.minPriceSliderValue = this.minPriceInputValue;
    this.maxPriceSliderValue = this.maxPriceInputValue;
    this.priceChanged.emit([this.minPriceSliderValue, this.maxPriceSliderValue])
  }
  onPriceSliderChange() {
    console.log('slider changed');
    this.minPriceInputValue = this.minPriceSliderValue;
    this.maxPriceInputValue = this.maxPriceSliderValue;
    this.priceChanged.emit([this.minPriceSliderValue, this.maxPriceSliderValue])
  }
}
