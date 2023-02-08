import { Component, OnInit } from '@angular/core';
import { AuthenticationResult } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: MsalService,
    private userService: UserService,
    private route: Router,
    private customAuthService: AuthService
  ) {}

  ngOnInit() {
    this.authService.instance.handleRedirectPromise().then((res) => {
      if (res != null && res.account != null) {
        this.authService.instance.setActiveAccount(res.account);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() != null;
  }

  login() {
    // this.authService.loginRedirect();
    this.authService
      .loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.authService.instance.setActiveAccount(response.account); // to be removed
        // this.customAuthService.currentUser.next(response.account);
        // this.customAuthService.addLogin(response.account).subscribe((result) => {
        console.log("logged in");
        this.userService.storeActiveUser().subscribe(
          (res) => {
            console.log("StoreActiveUser call is successful...");
            console.log(res);
            this.route.navigate(["dashboard/admin"]);
          },
          (err) => {
            console.log(err);
          }
        );
        //});
        this.route.navigateByUrl('dashboard/admin');
        // console.log(response);
      });
  }

  logout() {
    this.authService.logout();
  }
}
