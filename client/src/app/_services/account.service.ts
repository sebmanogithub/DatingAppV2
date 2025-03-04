import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  //Un ReplaySubject conserve une ou plusieurs valeurs dans le temps 
  // et les rejoue pour les abonnés.
  // Usage : Permet de stocker et de diffuser l'état actuel de l'utilisateur
  // connecté à travers l'application.
  private currentUserSource = new ReplaySubject<User>(1);
  //Rend les données de currentUserSource accessibles aux composants ou services 
  //abonnés. Le $ indique que c'est un Observable
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }

  // pipe : Permet de chaîner des opérateurs RxJS pour traiter les données de la réponse.
  // map : Transforme la réponse de l'API avant qu'elle ne soit transmise à l'abonné.
  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next({} as User);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
