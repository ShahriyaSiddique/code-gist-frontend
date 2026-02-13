import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

class AuthServiceStub {
  isLoading = signal(false);
  isAuthenticated = signal(false);
}

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('authGuard', () => {
  let authService: AuthServiceStub;
  let router: RouterStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: Router, useClass: RouterStub }
      ]
    });

    authService = TestBed.inject(AuthService) as unknown as AuthServiceStub;
    router = TestBed.inject(Router) as unknown as RouterStub;
  });

  it('should allow activation when authenticated', (done) => {
    authService.isAuthenticated.set(true);

    const result$ = TestBed.runInInjectionContext(
      () => authGuard({} as any, {} as any)
    ) as unknown as Observable<boolean>;

    result$.subscribe(
      (canActivate: boolean) => {
        expect(canActivate).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }
    );
  });

  it('should redirect to /login when not authenticated', (done) => {
    authService.isAuthenticated.set(false);

    const result$ = TestBed.runInInjectionContext(
      () => authGuard({} as any, {} as any)
    ) as unknown as Observable<boolean>;

    result$.subscribe(
      (canActivate: boolean) => {
        expect(canActivate).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    );
  });
});

