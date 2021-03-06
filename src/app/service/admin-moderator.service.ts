import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {apiUrls} from '../../api-urls';
import {Observable} from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminModeratorService {

  private readonly API_CREATE_ADMIN_MODERATOR;
  private readonly API_DELETE_ADMIN_MODERATOR;
  private readonly API_UPDATE_ADMIN_MODERATOR;

  constructor(private httpClient: HttpClient, private service: AccountService) {
    this.API_CREATE_ADMIN_MODERATOR = apiUrls.API_CREATE_ADMIN_MODERATOR;
    this.API_DELETE_ADMIN_MODERATOR = apiUrls.API_DELETE_ADMIN_MODERATOR;
    this.API_UPDATE_ADMIN_MODERATOR = apiUrls.API_UPDATE_ADMIN_MODERATOR;
   }

createAdminModer(user: any): Observable<any> {
  let headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.httpClient.post<any>(this.API_CREATE_ADMIN_MODERATOR, JSON.stringify(user), {headers: headers});
}

deleteAdminModer(email): Observable<any> {
 return this.httpClient.delete<any>(this.API_DELETE_ADMIN_MODERATOR + '/' + email);
}

updateAdminModer(user: any): Observable<any> {
  const token = this.service.getToken();

  let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
  return this.httpClient.put(this.API_UPDATE_ADMIN_MODERATOR, JSON.stringify(user),  {headers: headers});
}


}
