import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../interfaces/auth.interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(() => {
    localStorage.clear();

    const routerStub = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useValue: routerStub }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerNavigateSpy = TestBed.inject(Router).navigate as jasmine.Spy;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login and store token and user', () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password'
    };

    const mockResponse: AuthResponse = {
      accessToken: 'jwt-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }
    };

    const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();

    service.login(credentials).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush(mockResponse);

    expect(setItemSpy).toHaveBeenCalledWith('access_token', 'jwt-token');
    expect(service.getToken()).toBe('jwt-token');
    expect(service.user()).toEqual(mockResponse.user);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should perform register and store token and user', () => {
    const credentials: RegisterCredentials = {
      email: 'new@example.com',
      password: 'password'
    } as RegisterCredentials;

    const mockResponse: AuthResponse = {
      accessToken: 'jwt-token',
      user: {
        id: 2,
        name: 'New User',
        email: 'new@example.com'
      }
    };

    const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();

    service.register(credentials).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush(mockResponse);

    expect(setItemSpy).toHaveBeenCalledWith('access_token', 'jwt-token');
    expect(service.getToken()).toBe('jwt-token');
    expect(service.user()).toEqual(mockResponse.user);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should clear token, user and navigate on logout', () => {
    localStorage.setItem('access_token', 'jwt-token');

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(service.getToken()).toBeNull();
    expect(service.user()).toBeNull();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/login']);
  });
});

