import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IAddress } from 'src/app/shared/interfaces/IAddress';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { hasAnyError, hasFieldError } from 'src/app/shared/utils/validate';
import { validateAllFormFields } from 'src/app/shared/utils/validate';
import { resetForm } from 'src/app/shared/utils/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnInit, OnDestroy {
  user: IUser | null = null;
  addressForm: FormGroup;
  closeResult = '';
  subscriptions: Subscription[] = [];
  addresses: IAddress[] = [];
  hasAnyError = hasAnyError;
  hasFieldError = hasFieldError;
  // @ViewChild('content') private content: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.user = authService.getCurrentUserObject();
    this.addressForm = this.fb.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
    if (this.user) {
      this.subscriptions.push(
        authService
          .getUserAddresses(this.user)
          .subscribe((addresses: IAddress[]) => {
            this.addresses = addresses;
          })
      );
    }
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'add-address',
        windowClass: 'address-modal',
        centered: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
  }

  onSubmit() {
    if (this.addressForm.invalid || this.addressForm.pending) {
      validateAllFormFields(this.addressForm);
      return;
    }
    if (!this.user) {
      return;
    }

    const { name, city, address } = this.addressForm.value;

    this.authService.addUserAddress(this.user, name, city, address);

    resetForm(this.addressForm);
    this.modalService.dismissAll();
  }

  onDelete(address: IAddress) {
    if (this.user) {
      if (confirm('Are you sure?')) {
        this.authService.deleteUserAddressById(this.user, address.uid);
      }
    }
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
