import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit, OnDestroy {
  notes: any[] = [];
  private wsSub?: Subscription;
  username: string | null = null;
  showCreateForm = false;
  editingNote: any = null;

  constructor(
    private noteService: NoteService,
    private wsService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    if (!this.username) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.loadNotes();
    this.wsSub = this.wsService.notesChanged$.subscribe(() => this.loadNotes());
  }

  ngOnDestroy() {
    this.wsSub?.unsubscribe();
  }

  loadNotes() {
    this.noteService.getNotes().subscribe(data => this.notes = data);
    this.editingNote = null;
    this.showCreateForm = false;
  }

  editNote(note: any) {
    this.editingNote = { ...note };
    this.showCreateForm = false;
  }

  deleteNote(note: any) {
    if (confirm('Möchtest du diese Notiz wirklich löschen?')) {
      this.noteService.deleteNote(note.id).subscribe(() => this.loadNotes());
    }
  }

  onNoteSaved() {
    this.loadNotes();
  }

  logout() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    this.router.navigateByUrl('/login');
  }
}
