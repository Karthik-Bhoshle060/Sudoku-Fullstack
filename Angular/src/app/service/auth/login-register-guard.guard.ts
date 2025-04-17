import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppServiceService } from '../app-service.service';

@Injectable({
  providedIn: 'root',
})
export class LoginRegisterGuardGuard implements CanMatch {
  constructor(
    private router: Router,
    private appServiceService: AppServiceService
  ) {}
  canMatch(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isLoggedIn = this.appServiceService.logedInUser.username; // Replace with real logic

    if (isLoggedIn) {
      this.router.navigate(['/profile']);
      return false;
    }
    return true;
  }
}
