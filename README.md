# Notiz-App

## Übersicht

Die Notiz-App ist eine Fullstack-Webanwendung für kollaboratives Notizmanagement in Echtzeit. Benutzer können sich registrieren, einloggen, Notizen erstellen, bearbeiten, teilen und gemeinsam bearbeiten. Änderungen werden sofort per WebSocket an alle verbundenen Nutzer übertragen.

**Verwendete Technologien:**
- Frontend: Angular
- Backend: Node.js (Express)
- Datenbank: MySQL (im Docker-Container)
- Echtzeit: WebSocket (ws)
- API-Dokumentation: Swagger UI (OpenAPI 3)
- Containerisierung: Docker & Docker Compose

## Ausführen

### Voraussetzungen
- [Docker](https://www.docker.com/) und [Docker Compose](https://docs.docker.com/compose/) installiert

#### Frontend bauen
```powershell
cd frontend
npm install
ng build --configuration=production
```

#### Alle Container starten
```powershell
docker-compose up --build
```

Damit wird ... gestartet:
- Die MySQL-Datenbank (mit automatischer Initialisierung)
- Das Express-Backend (serviert auch die Angular-App und WebSocket-Server)
- Das Angular-Frontend (über Nginx)

#### Zugriff auf die Anwendung
- Web-App: http://localhost:4200
- API-Dokumentation (Swagger UI): http://localhost:3000/api-docs

