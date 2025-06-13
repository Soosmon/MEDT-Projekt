import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { UserService } from '../../services/user.service';
import { CollaboratorService } from '../../services/collaborator.service';

@Component({
  selector: 'app-note-edit',
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.scss']
})
export class NoteEditComponent implements OnChanges {
  @Input() note: any = { title: '', content: '', ownerId: 1 };
  @Output() noteSaved = new EventEmitter<void>();
  @Output() noteDeleted = new EventEmitter<void>();
  public internalNote: any = { title: '', content: '', ownerId: 1 };
  users: any[] = [];
  selectedCollaboratorId: number | null = null;
  addCollabError: string = '';
  collaborators: any[] = [];

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private collaboratorService: CollaboratorService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['note'] && changes['note'].currentValue) {
      this.internalNote = { ...this.note };
      if (this.internalNote.id) {
        this.loadCollaborators(this.internalNote.id);
      } else {
        this.collaborators = [];
      }
    }
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadCollaborators(noteId: number) {
    this.collaboratorService.getCollaborators(noteId).subscribe(collabs => {
      this.collaborators = collabs;
    });
  }

  isUserDisabled(user: any): boolean {
    if (!user || !this.internalNote) { return false; }
    if (this.internalNote.ownerId && user.id === this.internalNote.ownerId) { return true; }
    if (Array.isArray(this.collaborators) && this.collaborators.some((c: any) => c && c.userId === user.id)) { return true; }
    return false;
  }

  saveNote() {
    const userId = Number(sessionStorage.getItem('userId')) || 1;
    const username = sessionStorage.getItem('username') || '';
    if (this.internalNote.id) {
      this.noteService.updateNote(this.internalNote.id, {
        ...this.internalNote,
        lastEditorId: userId,
        lastEditorName: username
      }).subscribe(() => {
        this.noteSaved.emit();
      });
    } else {
      this.noteService.createNote({
        ...this.internalNote,
        ownerId: userId,
        lastEditorId: userId,
        lastEditorName: username
      }).subscribe(() => {
        this.noteSaved.emit();
      });
    }
    this.internalNote = { title: '', content: '', ownerId: userId };
    this.collaborators = [];
  }

  addCollaborator() {
    this.addCollabError = '';
    if (!this.internalNote.id) {
      this.addCollabError = 'Notiz muss zuerst gespeichert werden.';
      return;
    }
    if (!this.selectedCollaboratorId) {
      return;
    }
    // Check if already collaborator
    if (this.collaborators.some(c => c.userId === this.selectedCollaboratorId)) {
      this.addCollabError = 'Benutzer ist bereits Collaborator.';
      return;
    }
    this.collaboratorService.addCollaborator(this.internalNote.id, this.selectedCollaboratorId, 'editor').subscribe({
      next: () => {
        this.loadCollaborators(this.internalNote.id);
        this.selectedCollaboratorId = null;
      },
      error: err => {
        this.addCollabError = err.error?.error || 'Fehler beim Hinzufügen.';
      }
    });
  }

  removeCollaborator(collabId: number) {
    if (!collabId) return;
    this.collaboratorService.removeCollaborator(collabId).subscribe(() => {
      if (this.internalNote.id) this.loadCollaborators(this.internalNote.id);
    });
  }

  deleteNote() {
    if (!this.internalNote.id) return;
    if (confirm('Möchtest du diese Notiz wirklich löschen?')) {
      this.noteService.deleteNote(this.internalNote.id).subscribe(() => {
        this.noteDeleted.emit();
      });
    }
  }
}