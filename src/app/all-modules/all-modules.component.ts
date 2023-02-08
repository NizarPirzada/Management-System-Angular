import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-all-modules',
  templateUrl: './all-modules.component.html',
  styleUrls: ['./all-modules.component.css']
})
export class AllModulesComponent implements OnInit {


  constructor(private authService: MsalService, private route: Router) {

  }

  ngOnInit() {
    //console.log(this.authService.instance.getActiveAccount());
    if (this.authService.instance.getActiveAccount() == null)
      this.route.navigate(["login"]);
  }

}
