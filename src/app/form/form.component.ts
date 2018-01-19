import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
	genders = ['right', 'left', 'middle'];
	signupForm: FormGroup;

	constructor(private fb: FormBuilder) {  }

	ngOnInit() {
		this.signupForm = this.fb.group ({
			basicData: this.fb.group({
				username: ['', [Validators.required, Validators.minLength(3)]],
				email: ['', [Validators.required, Validators.email]],
				gender: ['', Validators.required]
			}),
			extendedData: this.fb.group({
				address: []
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
		console.log(this.signupForm);
	}
}
