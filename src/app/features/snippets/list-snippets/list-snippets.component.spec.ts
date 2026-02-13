import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ListSnippetsComponent } from './list-snippets.component';
import { SnippetService } from '../../../core/services/snippet.service';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';

describe('ListSnippetsComponent', () => {
  let component: ListSnippetsComponent;
  let fixture: ComponentFixture<ListSnippetsComponent>;
  let snippetService: jasmine.SpyObj<SnippetService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const snippetServiceSpy = jasmine.createSpyObj('SnippetService', [
      'getSnippets',
      'deleteSnippet'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListSnippetsComponent, HttpClientTestingModule],
      providers: [
        { provide: SnippetService, useValue: snippetServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListSnippetsComponent);
    component = fixture.componentInstance;
    snippetService = TestBed.inject(SnippetService) as jasmine.SpyObj<SnippetService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load snippets on init (success path)', () => {
    const mockSnippets: Snippet[] = [
      {
        id: 1,
        title: 'Snippet 1',
        code: 'code 1',
        language: 'typescript'
      }
    ];

    snippetService.getSnippets.and.returnValue(
      of({ data: mockSnippets } as any)
    );

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.isLoading()).toBeFalse();
    expect(component.error()).toBeNull();
    expect(component.snippets()).toEqual(mockSnippets);
  });

  it('should handle error when loading snippets fails', () => {
    snippetService.getSnippets.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.isLoading()).toBeFalse();
    expect(component.error()).toBe('Failed to load snippets');
    expect(component.snippets()).toEqual([]);
  });

  it('should navigate to edit page on onEdit when id is present', () => {
    const snippet: Snippet = {
      id: 123,
      title: 'Snippet',
      code: 'code',
      language: 'typescript'
    } as Snippet;

    component.onEdit(snippet);

    expect(router.navigate).toHaveBeenCalledWith(['/snippets', 123, 'edit']);
  });

  it('should not navigate on onEdit when id is missing', () => {
    const snippet = {
      title: 'Snippet',
      code: 'code',
      language: 'typescript'
    } as Snippet;

    component.onEdit(snippet);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should delete snippet and update list on onDelete', () => {
    const snippetToDelete: Snippet = {
      id: 1,
      title: 'Snippet 1',
      code: 'code 1',
      language: 'typescript'
    } as Snippet;

    const remainingSnippet: Snippet = {
      id: 2,
      title: 'Snippet 2',
      code: 'code 2',
      language: 'typescript'
    } as Snippet;

    component.snippets.set([snippetToDelete, remainingSnippet]);

    snippetService.deleteSnippet.and.returnValue(of(void 0));

    component.onDelete(snippetToDelete);

    expect(snippetService.deleteSnippet).toHaveBeenCalledWith(1);
    expect(component.snippets()).toEqual([remainingSnippet]);
  });

  it('should not call deleteSnippet when id is null or undefined', () => {
    const snippet = {
      id: null,
      title: 'Snippet',
      code: 'code',
      language: 'typescript'
    } as unknown as Snippet;

    component.onDelete(snippet);

    expect(snippetService.deleteSnippet).not.toHaveBeenCalled();
  });

  it('should set error when delete fails', () => {
    const snippetToDelete: Snippet = {
      id: 1,
      title: 'Snippet 1',
      code: 'code 1',
      language: 'typescript'
    } as Snippet;

    component.snippets.set([snippetToDelete]);

    snippetService.deleteSnippet.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );

    component.onDelete(snippetToDelete);

    expect(component.error()).toBe('Failed to delete snippet');
  });

  it('should navigate to create snippet page on onCreateNew', () => {
    component.onCreateNew();

    expect(router.navigate).toHaveBeenCalledWith(['/snippets/create']);
  });
});

