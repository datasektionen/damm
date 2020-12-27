# Damm - sektionens historiesystem
## Om Damm
Damm är sektionens historiesystem. Systemet började skrivas i januari 2018 av Jonas Dahl (tidslinjen), men låg sedan orört i mer än två år innan en av sektionshistorikerna 2020 (Axel Elmarsson) beslöt sig för att fortsätta utvecklingen av systemet.

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
- **Dfunkt** - för att hämta information om vilka dataloger som blev funktionärer och när de valdes.
- **Zfinger** - för att hämta bilder på funktionärer i tidslinjen
- **Bawang-content** - för att hämta information och protokoll från SM
    - Hämtar specifikt från https://raw.githubusercontent.com/datasektionen/bawang-content/master/organisation/protokoll/body.md, alltså markdown-filen för sidan med protokoll till sektionens hemsida. Damm parsar denna fil, vilket betyder att om formatet görs om så måste parsern skrivas om. Se till att sekreterare följer konventionen. Vid mörkläggning blir `bawang-content` privat, då kan inte damm komma åt denna fil utan en token. Kör man admin-refresh då så försvinner SM och DM från tidslinjen.

Och så använder sig systemet såklart av Aurora och Methone, men det gör i princip alla system.

## API-dokumentation
API-dokumentation finnes [här](API.md)

## Pls permissions
För tillfället finns två rättigheter i pls:
- admin
    - Adminrättigheter: full adminaccess.
- prylis
    - Denna rättighet är en delmängd av admin och kan hantera prylisrelaterade grejer, dvs märkesrelaterade grejer.


<a name="dependencies"></a>
### Dependencies
Du behöver npm/nodejs och mongodb.

- ```nodemon```
    - Används för att hot-restart:a servern under utveckling. På så sätt behöver du själv inte manuellt starta om servern.
    - Installeras genom ```npm install -g nodemon```
- ```migrate-mongo```
    - Används för att skapa databasmigreringar.
    - Installeras genom ```npm install -g migrate-mongo```

## Environment tables
Du behöver variablerna nedan (PORT och HOST är inte ett krav, HOST måste däremot finnas om du kör mot login.datasektionen.se).

Placera .env-filen i projektets rot (utanför ```server``` och ```client```). **```HOST``` placeras dock i en .env-fil i `/client`**

En login2-nyckel fås av systemansvarig (d-sys@d.kth.se)

| Variabel              | Beskrivning                           | Standardvärde | Exempelvärde |
|-----------------------|---------------------------------------| --------------| ------------ |
| MONGO_URL             | URL till mongodatabasen               | -             | mongodb://localhost:27017/damm |
| LOGIN2_API_KEY        | Login2 API-nyckel                     | -             | - |
| LOGIN2_URL            | URL till login2                       | -             | https://login.datasektionen.se |
| PLS_API_URL           | URL till pls                          | -             | https://pls.datasektionen.se/api |
| NODE_ENV              | Om du kör i "production" eller "development". Antagligen "development" om du kör lokalt | - | development |
| PORT                  | Port som servern körs på, måste förmodligen också ändras i package.json (för development) om du inte kör standard | 5000 | - |

### I client/
| Variabel              | Beskrivning                           | Standardvärde | Exempelvärde |
|-----------------------|---------------------------------------| --------------| ------------ |
| HOST                  | När du utvecklar damm lokalt och inte kör login lokalt måste du ange detta som `localhost.datasektionen.se`, annars får du dels `Invalid host header` samt att login kommer neka din callback eftersom `localhost` inte är en subdomän till datasektionen. | -             | - |

# Så här kör du server + klient
## Utveckling/lokalt

Kör ```npm install``` i roten så kommer den automatiskt köra ```npm install``` i både client och server.

### Server
Det finns två alternativ:

1. Kör ```npm run dev:server``` från ```/``` i ett terminalfönster så startar servern (på port 5000 om inget annat anges). Detta kräver att du har nodemon, kör ```npm install -g nodemon``` om du ej har det installerat. Nodemon gör att servern automatiskt kommer starta om när du gör ändringar i koden.

2. Kör ```npm start``` från ```server/``` i ett terminalfönster så startar servern (på port 5000 om inget annat anges). Du måste döda processen och köra om kommandot för att dina ändringar ska köras.

### Klient
Kör ```npm run dev:client``` från ```/``` i ett annat terminalfönster så startar klienten (på port 3000 om inget annat anges). React kommer automatiskt uppdatera när du gör ändringar i koden.

## Produktion
Kör ```npm install``` i ```/``` så installeras både server och klient. React-applikationen (klienten) byggs och läggs i /build.
Kör ```npm start``` så byggs körs Node.js-applikationen (servern) på defaultport 5000 och servar /api och /build (React-builden) (på /).

# Testning
Unittester finns (fler behöver skrivas). Dessa finns i mappen `/server/test`. För att köra testen kör du `npm test` i roten av projektet, eller `npm test` i server.

Det finns en github-action som kör dessa unittester när något pushas eller mergas till master-grenen.

# Databasmigrering
För detaljerad information, läs dokumentationen på [npmjs.com](https://www.npmjs.com/package/migrate-mongo) eller [Github](https://github.com/seppevs/migrate-mongo) för `migrate-mongo`.

Se till att ha `migrate-mongo` installerat, står om detta under [Dependencies](#dependencies).
