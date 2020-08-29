# Så här kör du server + klient

## Testning/lokalt
Kör ```npm run start-server``` i ett terminalfönster så startar servern (på port 5000 om inget annat anges). Du måste döda processen och köra om kommandot för att dina ändringar ska köras.
Kör ```npm start``` i ett annat terminalfönster så startar klienten (på port 3000 om inget annat anges). Den watchar när du ändrar filer så vid ändringar i klienten behöver du inte köra om kommandot. Du kan behöva ändra URLen i src/App.js för att den ska hämta från rätt URL. (Snälla kan någon lösa det här med miljövariabler istället).

## Produktion
Kör ```npm run build``` så byggs React-applikationen (klienten) och läggs i /build.
Kör ```npm run start-server``` så byggs körs Node.js-applikationen (servern) på defaultport 500 och servar /api och /build (React-builden) (på /).

## Environment tables
Du behöver LOGIN2_API_KEY, MONGO_URL