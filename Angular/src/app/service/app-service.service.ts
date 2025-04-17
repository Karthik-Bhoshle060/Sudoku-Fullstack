import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppServiceService {
  constructor() {}

  logedInUser: any = {};
  isRulesShowedtoUser: boolean = false;
  isUserPlayingGame: boolean = false;
}
