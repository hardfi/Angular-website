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
			})
		})

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
