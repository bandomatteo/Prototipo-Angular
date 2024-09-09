import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = sessionStorage.getItem('authToken');

  // Definisci i percorsi che vuoi escludere
  const excludedPaths: string[] = ['/register', '/login'];

  // Controlla se la richiesta riguarda uno dei percorsi esclusi
  const isExcludedPath = excludedPaths.some(path => req.url.includes(path));

  if (token && !isExcludedPath) {
    // Clona la richiesta e aggiungi il token solo se il percorso NON è tra quelli esclusi
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned);
  } else {
    // Passa la richiesta originale senza modifiche
    return next(req);
  }
};
