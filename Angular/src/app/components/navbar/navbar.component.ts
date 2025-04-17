import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppServiceService } from 'src/app/service/app-service.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  selectedCategory = '';
  loader: boolean = false;
  categoryList: any[] = [];
  username: string = '';
  constructor(
    public apiService: AppServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.username = this.apiService.logedInUser.username;
    if (this.username == '' || this.username == undefined) {
      this.router.navigate(['/login'], {
        state: { pageTitle: 'login' },
      });
      return;
    }
  }
  currentUrl: any;
  ngOnInit(): void {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
        console.log('Current URL:', this.currentUrl);
      });
  }
  goToSignUp(page: any) {
    let data = { pageTitle: 'sign-up' };
    if (page == 'login') {
      data = { pageTitle: 'login' };
      this.router.navigate(['/login'], {
        state: data, // Passing data
      });
    } else {
      this.router.navigate(['/sign_up'], {
        state: data, // Passing data
      });
    }
  }
}
