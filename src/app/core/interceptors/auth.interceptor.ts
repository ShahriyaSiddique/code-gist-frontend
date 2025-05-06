import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Request URL:', req.url);
  
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  req = req.clone({
    setHeaders: headers
  });

  console.log('Final Request Headers:', req.headers);

  return next(req).pipe(
    tap({
      next: (response) => console.log('API Response:', response),
      error: (error) => console.error('API Error:', { status: error.status, message: error.message, error })
    })
  );
};