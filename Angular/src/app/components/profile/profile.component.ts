import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppServiceService } from 'src/app/service/app-service.service';
import { Location } from '@angular/common';
import { APIFactoryService } from 'src/app/service/api-factory.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  username: string = '';
  userBestScore: any = '';
  constructor(
    private route: ActivatedRoute,
    public apiService: AppServiceService,
    private router: Router,
    private location: Location,
    private apiFactoryService: APIFactoryService
  ) {
    this.username = this.apiService.logedInUser.username;
    if (this.username == '' || this.username == undefined) {
      this.router.navigate(['login']);
    }
    let payload = {
      username: this.username,
    };
    this.apiFactoryService.userBestScore(payload).subscribe((res) => {
      this.userBestScore = res.data.timeTakenInSeconds || null;
    });
  }
  logout() {
    this.apiService.logedInUser = {};
    this.router.navigate(['/login'], {
      state: { pageTitle: 'login' },
    });
  }
  back() {
    this.router.navigate(['solve-sudoku']);
  }
  formattedTime(seconds: any = ''): any {
    if (seconds == null) return;
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }
}
