import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { SnippetService } from './snippet.service';
import { environment } from '../../../environments/environment';
import { CreateSnippetDTO, Snippet } from '../interfaces/snippet.interfaces';
import { ServerResponse } from '../interfaces/server-response.interface';

describe('SnippetService', () => {
  let service: SnippetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SnippetService]
    });

    service = TestBed.inject(SnippetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /snippets on createSnippet', () => {
    const dto: CreateSnippetDTO = {
      title: 'Test Snippet',
      code: 'console.log("test")',
      language: 'javascript'
    };

    const mockResponse: ServerResponse<Snippet> = {
      status: 201,
      msg: 'Created',
      data: {
        id: 1,
        title: 'Test Snippet',
        code: 'console.log("test")',
        language: 'javascript'
      }
    };

    service.createSnippet(dto).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/snippets`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('should call GET /snippets on getSnippets', () => {
    const mockSnippets: Snippet[] = [
      {
        id: 1,
        title: 'Snippet 1',
        code: 'code 1',
        language: 'typescript'
      }
    ];

    const mockResponse: ServerResponse<Snippet[]> = {
      status: 200,
      msg: 'OK',
      data: mockSnippets
    };

    service.getSnippets().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/snippets`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call GET /snippets/:id on getSnippetById', () => {
    const id = '123';
    const mockSnippet: Snippet = {
      id: Number(id),
      title: 'Snippet',
      code: 'code',
      language: 'javascript'
    };

    const mockResponse: ServerResponse<Snippet> = {
      status: 200,
      msg: 'OK',
      data: mockSnippet
    };

    service.getSnippetById(id).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/snippets/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call PATCH /snippets/:id on updateSnippet', () => {
    const id = '123';
    const update: Partial<Snippet> = {
      title: 'Updated title'
    };

    const mockResponse: ServerResponse<Snippet> = {
      status: 200,
      msg: 'Updated',
      data: {
        id: Number(id),
        title: 'Updated title',
        code: 'code',
        language: 'javascript'
      }
    };

    service.updateSnippet(id, update).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/snippets/${id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(update);
    req.flush(mockResponse);
  });

  it('should call DELETE /snippets/:id on deleteSnippet', () => {
    const id = '123';

    service.deleteSnippet(id).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/snippets/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should call POST /snippets/:id/share on shareSnippet', () => {
    const id = '123';
    const userIds = ['u1', 'u2'];

    const mockResponse: ServerResponse<any> = {
      status: 200,
      msg: 'Shared',
      data: {}
    };

    service.shareSnippet(id, userIds).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/snippets/${id}/share`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userIds });
    req.flush(mockResponse);
  });

  it('should call GET /snippets/shared on getSharedSnippets', () => {
    const mockSnippets: Snippet[] = [
      {
        id: 1,
        title: 'Shared Snippet',
        code: 'code',
        language: 'javascript'
      }
    ];

    const mockResponse: ServerResponse<Snippet[]> = {
      status: 200,
      msg: 'OK',
      data: mockSnippets
    };

    service.getSharedSnippets().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/snippets/shared`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});

