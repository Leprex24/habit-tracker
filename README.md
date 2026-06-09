# Habit Tracker

Aplikacja internetowa do śledzenia codziennych, tygodniowych i miesięcznych nawyków.

## Funkcjonalności

- Rejestracja i logowanie (JWT)
- Dodawanie, edytowanie i usuwanie nawyków
- Oznaczanie nawyków jako wykonanych (z uwzględnieniem częstotliwości)
- Statystyki: aktualna passa, rekordowa passa, heatmapa aktywności

## Technologie

**Backend:** Node.js, Express, MongoDB, Mongoose, bcryptjs, jsonwebtoken, Joi

**Frontend:** React, React Router, Axios

## Uruchomienie

### Backend
```bash
cd server
npm install
cp .env.example .env   # uzupełnij zmienne
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

### Zmienne środowiskowe (server/.env)
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=twoj_tajny_klucz
```