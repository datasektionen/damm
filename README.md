# Damm - sektionens historiesystem
## Om Damm
Damm är sektionens historiesystem. Systemet började skrivas i januari 2018 av Jonas Dahl (tidslinjen), men låg sedan orört i mer än två år innan sektionshistorikerna 2020 (Axel Elmarsson, 
Douglas Fischer Horn af Rantzien, William Agnér) beslöt sig för att fortsätta utvecklingen av systemet.

Systemets huvudfokus är alltså att bokföra sektionens mycket viktiga historia. Systemet gör detta på tre sätt:
- Tidslinjen
    - Visar viktiga händelser i sektionens historia såsom SM, funktionärsval, viktiga datum eller andra händelser. Vem som helst kan föreslå en händelse man tycker borde upp på tidslinjen, men sektionshistorikerna måste acceptera innan de kommer upp.
- Märkesarkivet
    - Arkiverar sektionens märken. Tidigare (t.o.m. 2020) förvarades ett exemplar av alla sektionens märken i ett fysiskt märkesarkiv (en gammal rutten papperspåse).
- Historiska föremål/artefakter
    - Arkiverar viktiga föremål som tillhör sektionen. Det kan till exempel vara presenter från andra sektioner eller en historiskt stor dammtuss fån sektionslokalen (helst inte).

## Dependencies (Sektionens system)
Systemet använder sig av dessa system och API:er
- **Login2** - för inloggning med KTH-konto.
- **Pls** - för att kolla om inloggad är admin/sektionshistoriker eller prylis
- **Dfunkt** - för att hämta information om vilka dataloger som blev funktionärer och när de valdes. Hämtar från [API:et](https://github.com/datasektionen/dfunkt)
- **Zfinger** - för att hämta bilder på funktionärer i tidslinjen
- **Bawang-content** - för att hämta information och protokoll från SM
    - Hämtar specifikt från https://raw.githubusercontent.com/datasektionen/bawang-content/master/organisation/protokoll/body.md, alltså markdown-filen för sidan med protokoll till sektionens hemsida. Damm parsar denna fil, vilket betyder att om formatet görs om så måste parsern skrivas om. TODO: Gör en databas istället?

Och så använder sig systemet såklart av Aurora och Methone, men det gör i princip alla system.

# Så här kör du server + klient
## Dependencies
Du behöver npm/nodejs och mongodb.

## Environment tables
Du behöver variablerna LOGIN2_API_KEY, MONGO_URL (gärna i en .env-fil i ./)

En login2-nyckel fås av systemansvarig (d-sys@d.kth.se)

| Variable              | Description                           |
|-----------------------|---------------------------------------|
| LOGIN2_API_KEY        | Login2 api-nyckel                     |
| MONGO_URL             | URL till mongodatabasen               |


## Testning/lokalt
### Server
Det finns två alternativ:

1. Kör ```npm run dev``` i ett terminalfönster så startar servern(på port 5000 om inget annat anges). Detta kräver att du har nodemon, kör ```npm install -g nodemon``` om du ej har det installerat. Nodemon gör att servern automatiskt kommer starta om när du gör ändringar i koden.

2. Kör ```npm run start-server``` i ett terminalfönster så startar servern (på port 5000 om inget annat anges). Du måste döda processen och köra om kommandot för att dina ändringar ska köras.

### Klient
Kör ```npm run start-client``` i ett annat terminalfönster så startar klienten (på port 3000 om inget annat anges). React kommer automatiskt uppdatera när du gör ändringar i koden.

## Produktion
Kör ```npm run build``` så byggs React-applikationen (klienten) och läggs i /build.
Kör ```npm start``` så byggs körs Node.js-applikationen (servern) på defaultport 5000 och servar /api och /build (React-builden) (på /).
