# QueueFlow – Gestion des réservations en temps réel

Application de réservation avec files d'attente et suivi en temps réel.

**Stack :** React (Vite) · NestJS · PostgreSQL (TypeORM) · Socket.io

## Fonctionnalités
- Création de plusieurs files d'attente (guichets / services)
- Prise de ticket avec numérotation automatique
- Appel du client suivant, marquage « servi » / « annulé »
- Synchronisation instantanée des statuts via WebSockets (une room Socket.io par file)

## Architecture
```
React (hook useQueueSocket) <── REST ──> NestJS (Controller → Service → TypeORM → PostgreSQL)
        ▲                                         │
        └───────── Socket.io (queue:update) ──────┘  (QueueGateway)
```
Toute modification passe par le service, qui sauvegarde en base puis diffuse
la liste à jour aux clients abonnés à la file.

## Lancer le projet
```bash
docker compose up -d                              # PostgreSQL
cd backend  && npm install && npm run start:dev   # API  :3000
cd frontend && npm install && npm run dev         # UI   :5173
```
Ouvrez deux onglets sur http://localhost:5173 : une action dans l'un apparaît instantanément dans l'autre.

## API REST
| Méthode | Route | Description |
|---|---|---|
| GET/POST | /queues | Lister / créer une file |
| GET/POST | /queues/:id/tickets | Lister / créer un ticket |
| POST | /queues/:id/call-next | Appeler le suivant |
| PATCH | /tickets/:id/status | Changer le statut |

## Évolutions possibles
Authentification JWT, notifications, tests e2e, déploiement Docker complet.
