import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Rack } from './components/shared/models/rack';
import { Observable, throwError, pipe } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RackService {
  private racksUrl = 'http://localhost:3000';
  racks: Rack[];
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  constructor(private http: HttpClient) {}

  getListado(): Observable<Rack[]> {
    return this.http
      .get<Rack[]>(`${this.racksUrl}/racks`)
      .pipe(catchError(this.handleError));
  }

  getRack(id: number): Observable<Rack> {
    const url = `${this.racksUrl}/racks/${id}`;
    return this.http.get<Rack>(url);
  }

  addRack(host: string, lat: any, lng: any, archivo: File): Observable<any> {
    const rackData = new FormData();
    const id: any = 0;
    rackData.append('host', host);
    rackData.append('lat', lat);
    rackData.append('lng', lng);
    rackData.append('id', id);
    rackData.append('archivo', archivo, archivo.name);
    return this.http.post(`${this.racksUrl}/racks`, rackData);
  }
  // crearRack(rack: Rack): Observable<Rack> {
  //   return this.http.post<Rack>(`${this.racksUrl}/racks`, rack, httpOptions);
  // }

  borraRack(rack: Rack | number): Observable<Rack> {
    const id = typeof rack === 'number' ? rack : rack.id;
    const url = `${this.racksUrl}/racks/${id}`;

    return this.http.delete<Rack>(url, httpOptions);
  }

  actualizaRack(
    id: number,
    host: string,
    lat: any,
    lng: any,
    img: string,
    archivo: File | string
  ): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let rackData: Rack | FormData;

    if (typeof archivo === 'object') {
      rackData = new FormData();
      rackData.append('host', host);
      rackData.append('lat', lat);
      rackData.append('img', img);
      rackData.append('lng', lng);
      rackData.append('archivo', archivo, archivo.name);
    }

    return this.http.put(`${this.racksUrl}/racks/${id}`, rackData);
  }
}
