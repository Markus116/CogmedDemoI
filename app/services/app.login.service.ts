import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from "rxjs";

@Injectable()
export class LoginService {

  public result: Object;
  public error: Object;

  constructor (private http:Http) {
    this.http = http;
  }

  login(){
    console.log("call Login");
    let credentials = JSON.stringify({"username":"rmtest", "password":"rmtest"});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    console.log(credentials);

    return this.http.post("https://213.80.97.109:444/auth",credentials,options)
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }

  login2(){
    console.log("call Login2");
    let credentials = "username=rmtest&password=rmtest";

    console.log(credentials);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post("https://213.80.97.109:444/auth",credentials,options)
      .map((res:Response) => res.json())
      .catch(this.handleError);
  }

  handleResult(res:Response){
    this.result = res.json();
  }

  handleError(error) {
    console.error("handleError", error || "Server Error");
    return Observable.throw(error.json().error || 'Server error');
  }
}
