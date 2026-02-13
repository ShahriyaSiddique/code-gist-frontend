import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call AuthService.login with form values and navigate on success', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password'
    };

    component.loginForm.setValue(credentials);

    authService.login.and.returnValue(of({} as any));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(credentials);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set error message and stop loading on login error', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password'
    };

    component.loginForm.setValue(credentials);

    const errorResponse = {
      error: { message: 'Invalid credentials' }
    };

    authService.login.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(credentials);
    expect(component.error()).toBe('Invalid credentials');
    expect(component.isLoading()).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});

