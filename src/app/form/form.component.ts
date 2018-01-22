import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';


@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
	genders = ['right', 'left', 'middle'];
	signupForm: FormGroup;
	forbiddenNames = ['admin', 'bullshit', 'fuck'];
	paymentMethod: string = 'bank';

	constructor(private fb: FormBuilder) {  }

	ngOnInit() {
		let self = this;
		this.signupForm = this.fb.group ({
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

		this.signupForm.get('basicData.gender').valueChanges.subscribe(
			(gender: string) => {
				if (gender === 'middle') {
					this.signupForm.get('extendedData.address').setValidators([Validators.required, Validators.minLength(5)]);
				} else {
					this.signupForm.get('extendedData.address').clearValidators();
				}
				this.signupForm.get('extendedData.address').updateValueAndValidity();
			}
		)
	}

	onSubmit() {
		this.signupForm.reset();
		console.log(this.signupForm);
	}

	setPaymentMethodType() {
		this.paymentMethod === 'bank' ? this.paymentMethod = 'card' : this.paymentMethod = 'bank';

		const ctrl = (<any>this.signupForm).controls.paymentDetails;
		const bankCtrl = ctrl.bank;
		const cardCtrl = ctrl.card;
		console.log(ctrl);

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
		const model = {
			cardNo: ['', Validators.required],
			cardHolder: ['', Validators.required],
			expiry: ['', Validators.required]
		};
		return model;
	}

	onAddData() {
		const control = new FormControl(null, Validators.required);
		(<FormArray>this.signupForm.get('extendedData.random')).push(control);
	}

	forbidden(control: FormControl): {[s: string]: boolean} {
		if (this.forbiddenNames.indexOf(control.value) !== -1) {
			return {nameForbidden: true};
		}
		return null;
	}
}
