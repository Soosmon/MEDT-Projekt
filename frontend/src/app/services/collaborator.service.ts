import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  constructor(private http: HttpClient) {}

  addCollaborator(noteId: number, userId: number, role: string = 'editor'): Observable<any> {
    return this.http.post('/api/collaborators', { noteId, userId, role });
  }

  removeCollaborator(collaboratorId: number): Observable<any> {
    return this.http.delete(`/api/collaborators/${collaboratorId}`);
  }

  getCollaborators(noteId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/collaborators/${noteId}`);
  }
}
