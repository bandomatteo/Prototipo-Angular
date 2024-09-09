import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = sessionStorage.getItem('authToken');

  
  const excludedPaths: string[] = ['/register', '/login'];

  
  const isExcludedPath = excludedPaths.some(path => req.url.includes(path));

  if (token && !isExcludedPath) {
    
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned);
  } else {
    
    return next(req);
  }
};
