import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
	items: MenuItem[];

	constructor() { }

	ngOnInit() {
		this.items = [
			{
				label: 'File',
				items: [{
					label: 'New',
					icon: 'fa-plus',
					items: [
						{label: 'Project'},
						{label: 'Other'},
					]
				},
					{label: 'Open'},
					{label: 'Quit'}
				]
			},
			{
				label: 'Edit',
				icon: 'fa-edit',
				items: [
					{label: 'Undo', icon: 'fa-mail-forward'},
					{label: 'Redo', icon: 'fa-mail-reply'}
				]
			}
		];
	}
}

