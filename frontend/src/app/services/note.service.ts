import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private http: HttpClient) {}

  getNotes(): Observable<any[]> {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      // Gibt leeres Array zurück, wenn kein userId vorhanden ist
      return new Observable<any[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.http.get<any[]>(`/api/notes?userId=${userId}`);
  }

  getNote(id: number): Observable<any> {
    return this.http.get<any>(`/api/notes/${id}`);
  }

  createNote(note: any): Observable<any> {
    return this.http.post('/api/notes', note);
  }

  updateNote(id: number, note: any): Observable<any> {
    return this.http.put(`/api/notes/${id}`, note);
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`/api/notes/${id}`);
  }
}
