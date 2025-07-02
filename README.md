# Progetto IoT - App Frontend

APP: Taxi sociale

Questa applicazione è sviluppata con [Expo] e [React Native] e offre un sistema di gestione corse, autenticazione utenti e driver, mappa e chatbot.

## Struttura del progetto

- **/app**: contiene tutte le pagine principali dell'app, organizzate per sezioni e ruoli (utente, driver, autenticazione, ecc.).

  - **(auth)**: pagine di autenticazione e registrazione (login, registrazione utente, registrazione driver).
  - **(tabs)**: pagine principali per l'utente (chatbot, profilo, about, ride-booked).
  - **driver-tabs**: pagine principali per il driver (home, profilo, about).
  - **dashboard.tsx**: dashboard generale.
  - **corse.tsx**: gestione delle corse.
  - **mappa.tsx**: visualizzazione della mappa.
  - **partenza.tsx**: selezione della partenza.
  - **ride-accepted.tsx**: conferma corsa accettata.
  - **scan.tsx**: scanner QR/barcode.
  - **globals.css**: stili globali.

- **/components**: componenti riutilizzabili come Header e ThemedText.

- **/constants**: costanti (utenti, driver, ecc.).

- **/types**: tipi TypeScript custom per una tipizzazione.

- **/assets**: grafica (icone e immagini).

## Dipendenze principali

- **React Native** e **Expo** per lo sviluppo mobile multipiattaforma
- **expo-router** per routing, cioè per passare da una pagina all'altra
- **react-navigation** per la navigazione avanzata
- **nativewind** e **tailwindcss** per la gestione degli stili
- **react-native-maps** per la mappa
- **expo-barcode-scanner** per la scansione QR

## Script utili

- `npm install` – Installa tutte le dipendenze
- `npm start` – Avvia l'app
- `npm run web` – Avvia in modalità web
- `npx expo start` – Avvia l'app per accedere da smartphone con expo

## Come iniziare

1. Clona il repository
2. Esegui `rm -rf node_modules package-lock.json` (solo su macOS)
3. Installa le dipendenze con `npm install`
4. Avvia l'app con `npx expo start` e entra scannerizzabdo il QRcode che viene creato

## Note aggiuntive

- La struttura delle cartelle segue la logica del routing di Expo: ogni file `.tsx` in `/app` rappresenta una pagina.
- Le risorse grafiche sono in `/assets/icons` e `/assets/images`.
- La tipizzazione è gestita in `/types`.
