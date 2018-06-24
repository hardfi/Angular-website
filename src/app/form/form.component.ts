import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  genders = ['right', 'left', 'middle'];
  form: FormGroup;
  forbiddenNames = ['admin', 'bullshit', 'fuck'];
  paymentMethod: string = 'bank';
  submitted: boolean = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      basicData: this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3), this.forbidden.bind(this)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required]
      }),
      extendedData: this.fb.group({
        address: [],
        random: new FormArray([])
      }),
      paymentDetails: this.fb.group({
        bank: this.fb.group(this.bankValidation()),
        card: this.fb.group(this.cardValidation())
      })
    });

    this.form.get('basicData.gender').valueChanges.subscribe(
      (gender: string) => {
        if (gender === 'middle') {
          this.form.get('extendedData.address').setValidators([Validators.required, Validators.minLength(5)]);
        } else {
          this.form.get('extendedData.address').clearValidators();
        }
        this.form.get('extendedData.address').updateValueAndValidity();
      }
    );
  }

  setPaymentMethodType() {
    this.paymentMethod === 'bank' ? this.paymentMethod = 'card' : this.paymentMethod = 'bank';

    const ctrl = (<any>this.form).controls.paymentDetails;
    const bankCtrl = ctrl.controls.bank;
    const cardCtrl = ctrl.controls.card;

    if (this.paymentMethod === 'bank') {
      // apply validators to each bank fields, retrieve validators from bank model
      Object.keys(bankCtrl.controls).forEach(key => {
        bankCtrl.controls[key].setValidators(this.bankValidation()[key][1]);
        bankCtrl.controls[key].updateValueAndValidity();
      });

      // remove all validators from card fields
      Object.keys(cardCtrl.controls).forEach(key => {
        cardCtrl.controls[key].setValidators(null);
        cardCtrl.controls[key].updateValueAndValidity();
      });
    } else {
      Object.keys(bankCtrl.controls).forEach(key => {
        bankCtrl.controls[key].setValidators(null);
        bankCtrl.controls[key].updateValueAndValidity();
      });

      // apply validators to each card fields, retrieve validators from card model
      Object.keys(cardCtrl.controls).forEach(key => {
        cardCtrl.controls[key].setValidators(this.cardValidation()[key][1]);
        cardCtrl.controls[key].updateValueAndValidity();
      });
    }
  }

  bankValidation() {
    const model = {
      accountNo: ['', Validators.required],
      accountHolder: ['', Validators.required],
      routingNo: ['', Validators.required]
    };
    return model;
  }

  cardValidation() {
    const expiryRegex = `^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$`;
    // const cardNoRegex = `^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$`;

    const model = {
      // cardNo: ['', [Validators.required, Validators.pattern(cardNoRegex)]],
      cardNo: ['', Validators.required],
      cardHolder: ['', Validators.required],
      expiry: ['', [Validators.required, Validators.pattern(expiryRegex)]]
    };
    return model;
  }

  onAddData() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.form.get('extendedData.random')).push(control);
  }

  forbidden(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenNames.indexOf(control.value) !== -1) {
      return {nameForbidden: true};
    }
    return null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.form.reset();
      console.log(this.form);
    }
  }
}
