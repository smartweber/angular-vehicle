import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-emulator',
  templateUrl: './emulator.component.html',
  styleUrls: ['./emulator.component.css']
})
export class EmulatorComponent implements OnInit {
	strIframeLink: SafeResourceUrl;

	constructor(private domSanitizer : DomSanitizer) { }

	ngOnInit() {
		let strEmulatorUrl = 'https://virtualevaluator.net/client/csl/';
		this.strIframeLink = this.domSanitizer.bypassSecurityTrustResourceUrl(strEmulatorUrl);
	}

}
