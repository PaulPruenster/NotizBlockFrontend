import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectorService {

  baseurl = 'http://127.0.0.1:8080/WebServiceTest/rest/notizblock/';

  constructor(private http: HttpClient) { }

  getThemen(user: string, pass: string) {
    return this.http.get(this.baseurl + 'themen/' + user + '/' + pass);
  }

  getNotizen(user: string, pass: string, sort: string) {
    const decode = {
      t: 'thema',
      d: 'datum',
      tg: 'thema nicht gelesen',
      dg: 'datum nicht gelesen'
    };
    return this.http.get(this.baseurl + 'notizen/' + user + '/' + pass + '/' + decode[sort]);
  }
  getNotiz(user: string, pass: string, nummer) {
    return this.http.get(this.baseurl + 'notizen/' + user + '/' + pass + '/' + nummer);
  }

  getBenutzer(user: string, pass: string) {
    return this.http.get(this.baseurl + 'benutzer/' + user + '/' + pass);
  }

  postNotiz(user: string, pass: string, obj) {
    return this.http.post(this.baseurl + 'notiz/' + user + '/' + pass, obj);
  }
  putNotiz(user: string, pass: string, obj) {
    return this.http.put(this.baseurl + 'notiz/' + user + '/' + pass, obj);
  }

  deleteNotiz(user: string, pass: string, nummer) {
    return this.http.delete(this.baseurl + 'notiz/' + user + '/' + pass + '/' + nummer);
  }
}
