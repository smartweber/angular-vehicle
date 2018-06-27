import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-zip',
	templateUrl: './zip.component.html',
	styleUrls: ['./zip.component.css']
})
export class ZipComponent implements OnInit {
	user: any;
	strSlugId: string;

	constructor(private router: Router,
		private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params.subscribe(params=> {
	      this.strSlugId = params['slugId'];
	    });

		this.user = {
	      zipcode: '',
	      email: ''
	    };
	}

	next(form: any) {
		if(form.value.zipcode) {
			this.router.navigate( ['/vehicle_model/ps', this.strSlugId,
				form.value.zipcode]);
		} else {
			alert('Please insert zipcode.');
		}
	}
}
