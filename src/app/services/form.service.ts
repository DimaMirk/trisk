import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  saveData(data: FormData) {
    return of(data).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 400:
              console.error('Bad Request: The server could not understand the request.');
              break;
            case 401:
              console.error('Unauthorized: Access is denied due to invalid credentials.');
              break;
            case 403:
              console.error('Forbidden: You do not have permission to perform this action.');
              break;
            case 404:
              console.error('Not Found: The requested resource could not be found.');
              break;
            case 500:
              console.error('Internal Server Error: An error occurred on the server.');
              break;
            case 502:
              console.error('Bad Gateway: Invalid response from the upstream server.');
              break;
            case 503:
              console.error('Service Unavailable: The server is currently unavailable.');
              break;
            default:
              console.error(`Unexpected Error: ${err.message}`);
          }
        } else {
          console.error('An unexpected error occurred:', err);
        }
        return of(null);
      })
    );
  }

}
