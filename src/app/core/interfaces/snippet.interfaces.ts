import { User } from './auth.interfaces';

export interface Snippet {
  id?: number;
  title: string;
  code: string;
  language: string;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSnippetDTO {
  title: string;
  code: string;
  language: string;
}