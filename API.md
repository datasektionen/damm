<a id="start"></a>
# API-dokumentation
Här finns API-dokumentationen för damm.

Senast uppdaterad 2020-12-28.

<a id="content"></a>
# Innehållsförteckning
- [API-dokumentation](#start)
- [Innehållsförteckning](#content)
- [Modeller](#modeller)
  * [Märke (Patch)](#modeller-patch)
  * [FileLink](#modeller-filelink)
  * [Tag (Taggar)](#modeller-tag)
  * [User](#modeller-user)
  * [Events](#modeller-events)
- [Error-meddelanden](#error-meddelanden)
    + [Exempel](#error-exempel)
- [Tokens](#tokens)
- [Admin endpoints](#admin-endpoints)
- [General endpoints](#general-endpoints)
  * [GET /api](#get-api)
  * [GET /damm](#get-damm)
  * [GET /fuzzyfile](#get-fuzzyfile)
  * [GET api/isAdmin](#get-isAdmin)
  * [GET api/file/:filename](#get-file-filename)
  * [GET api/\*invalid path\*](#get-invalid)
- [General - Admin](#general-admin)
  * [GET /api/admin/refresh](#get-admin-refresh)
- [Märkesrelaterat](#märkesrelaterat)
  * [GET api/marken](#get-marken)
  * [GET api/marke/id/:id](#get-marke-id)
  * [GET api/tags](#get-tags)
- [Märkesrelaterat - Admin](#markesrelaterat-admin)
  * [POST /api/admin/marke/create](#post-admin-marke-create)
  * [POST /api/admin/marke/edit/id/:id](#post-admin-marke-edit-id)
  * [GET /api/admin/marke/remove/id/:id](#get-admin-marke-remove-id)
  * [POST /api/admin/marke/register-orders](#post-admin-marke-register-orders)
  * [GET /remove/file/:filename](#removefile)

---
<a id="modeller"></a>
# Modeller
<a id="modeller-patch"></a>
## Märke (Patch)
Modell för ett märke. Hänvisas till som `Patch` i detta API.

För att inte icke-admins ska få tillgång till "känslig" information (`files`, `comment` och `orders`) så strippas denna information i de endpoints där icke-admins kan hämta märken.

### Generell information
- `name`, `price` och `image`, `imageLowRes` är de enda fälten som är `required`.
- Märkets bild sparas i databasen och `image` håller URL:en till denna bild. När man uppdaterar bild tas den gamla bilden bort från databasen, den nya läggs upp och nya URL:en sparas.
- `date` har formatet YYYY-MM-DD
- `tags` är en `array` med id:s till Tag-objekt.
- Filer sparas liksom märken i databasen. `FileLink`-objekt håller koll på filens originalnamn och URL:en till filen. Därför sparar vi `FileLink`-objekt i en `array` i `files`.

<a id="pricetypes"></a>
### Pristyper
- Gratis
- Okänt
- Ange pris

### Modellen
```js
{
    name: String,
    description: String,
    date: String,
    image: String,
    imageLowRes: String,
    orders: [{
        date: String,
        amount: String,
        order: String,
        company: String
    }],
    price: {
        type: String,
        value: String
    },
    tags: [Tag.ObjectID],
    files: [FileLink.ObjectID],
    inStock: Boolean,
    comment: String,
    creators: [{
        name: String
    }]
}
```

Se även [Märke.js](server/models/Märke.js)

<a id="modeller-filelink"></a>
## FileLink
Modell som håller koll på filers URL:er och originalnamn (vi skriver över filens namn med en `uuid4`-sträng). Ett `FileLink`-objekt måste tas bort när filen den länkar till tas bort, detta görs i bland annat i [GET api/admin/marke/remove/file/:filename](#removefile).

Hänvisas till som `FileLink` i detta API.

### Modellen
```js
{
    name: String,
    url: String
}
```
Se även [FileLink.js](server/models/FileLink.js)

<a id="modeller-tag"></a>
## Tag (Taggar)
Modell för märkestaggar. Hänvisas till som `Tag` i detta API.

### Generell information
- `name` är det enda fältet som måste vara med.
- `color` och `backgroundColor` måste vara RGB-färger på formatet `#RRGGBB`.
- Lämnas `color` tom gör frontenden den vit, lämnas `backgroundColor` tom gör frotenden den cerise.
- `hoverText` är en textruta som visas när du hoovrar med musen över taggen.
- `main` är en boolean som säger om taggen är en huvudtagg eller ej.
- `children` är taggens undertaggar. Endast taggar som har `main=true` kan ha barn.

### Modellen
```js
{
    text: String,
    color: String,
    backgroundColor: String,
    hoverText: String,
    main: Boolean,
    children: [Tag.ObjectID]
}
```
Se även [Tag.js](server/models/Tag.js)

<a id="modeller-user"></a>
## User

<a id="modeller-events"></a>
## Events

---
<a id="error-meddelanden"></a>
# Error-meddelanden
Error-meddelanden följer samma konvention för alla endpoints. Alla errormeddelanden kommer i JSON-format och ser ut såhär:

```js
{
    "error": String,
    "httpStatus": Number,
    "errorMessage": String
}
```

- error
    - Innehåller oftast information om vad som gick fel. Används ofta för att på frontenden ge feedback till användaren.
- httpStatus
    - Vilken http-status felet har, syns även i response-headern.
- errorMessage
    - Skickas bara under utveckling (när `NODE_ENV` är satt till `development`). Innehåller stack-trace.

<a id="error-exempel"></a>
### Exempel
```json
{
    "error":"Unauthorized",
    "httpStatus": 401
}
```
---
<a id="tokens"></a>
# Tokens
För vissa endpoints krävs en token. En token läggs till med `?token=banankaka` på slutet av URL:en, exempelvis: `https://damm.datasektionen.se/api/admin/refresh?token=banankaka`

---
<a id="admin-endpoints"></a>
# Admin endpoints
Adminendpoints förväntar sig att du har en token.

För dessa adminendpoints gäller:
- Har du ingen token svarar servern med `403`.
- Har du ingen access svarar servern med `401`.
- Gick något fel svarar servern med `500`.
---
<a id="general-endpoints"></a>
# General endpoints

<a id="get-api"></a>
## GET /api
**Beskrivning:** Hämtar all data som visas på tidslinjen.

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.

<a id="get-damm"></a>
## GET /damm
**Beskrivning:** Skickar en dammig bild.

### Response
**Format:** `HTML`
- `200` om allt gick rätt till.

<a id="get-fuzzyfile"></a>
## GET /fuzzyfile
**Beskrivning:** Hämtar fuzzy-filen.

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.

<a id="get-isAdmin"></a>
## GET api/isAdmin
**Beskrivning:** Skickar tillbaka pls-rättigheter som finns för medskickad token.

### Request
**REQUIRED**: `token`

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {
        pls: [String]
    }
    ```
- `403` om ingen token medskickad.
- `404` om något gick fel, exempelvis om token är fel format.

<a id="get-file-filename"></a>
## GET api/file/:filename
**Beskrivning:** Hämtar en fil med specificerat filnamn

### Response
**Format:** `binary`
- `200` om allt gick rätt till.
- `403` om ingen token medskickad.
- `404` om något gick fel, exempelvis om token är fel format.

<a id="get-invalid"></a>
## GET api/\*invalid path\*
**Beskrivning:** Alla ogiltiga paths.

### Response
**Format:** `JSON`
```json
{
    "error": "Invalid API path.",
    "httpStatus": 404
}
```
---
<a id="general-admin"></a>
# General - Admin
<a id="get-admin-refresh"></a>
## GET /api/admin/refresh
**Beskrivning:** Refreshar tidslinjen, hämtar all data från olika källor och cachar den. Kan bara köras max en gång per minut.

Notera att servern kör refresh automatiskt varje dygn (görs med en `setInterval` i `app.js`).

### Request
**REQUIRED**: `token`

### Response
**Format:** `JSON`
- Om mindre än en minut gått sen senaste refresh svarar servern med `403`.
- Annars svarar servern med `200`.

<a id="get-admin-files-all"></a>
## GET /api/admin/files/all
**Beskrivning:** Hämtar alla fil-objekt från databasen (Inte `FileLink`-objekt).

### Request
**REQUIRED**: `token`

### Response
**Format:** `JSON`
- `200`

<a id="get-admin-files-size"></a>
## GET /api/admin/files/size
**Beskrivning:** Hämtar hur mycket plats alla filer tar upp i databasen. Visar i bytes, kilobytes, megabytes och gigabytes.

### Request
**REQUIRED**: `token`

### Response
**Format:** `JSON`
- `200`

---
<a id="märkesrelaterat"></a>
# Märkesrelaterat
Märkesrelaterade endpoints.

<a id="get-marken"></a>
## GET api/marken
**Beskrivning:** Hämtar alla märken från databasen. Med en giltig admin-`token` inkluderas adminfält tillhörande alla märken, dessa fält är: filer, information och ordrar.

### Request
**OPTIONAL**: `token`

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {[Patch]}
    ```
- `500` om något gick fel.

<a id="get-marke-id"></a>
## GET api/marke/id/:id
**Beskrivning:** Hämtar märket med angivet id från databasen. Med en giltig admin-`token` inkluderas adminfält tillhörande märket, dessa fält är: filer, information och ordrar.

### Request
**OPTIONAL**: `token`

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {Patch}
    ```
- `500` om något gick fel.

<a id="get-tags"></a>
## GET api/tags
**Beskrivning:** Hämtar alla taggar från databasen.

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {Tag}
    ```
- `500` om något gick fel.

---
<a id="markesrelaterat-admin"></a>
# Märkesrelaterat - Admin

<a id="post-admin-marke-create"></a>
## POST /api/admin/marke/create
**Beskrivning:** Skapar ett nytt märke.

För filer: Lägg till alla filer i form-datan med namnet "files".

### Request
**REQUIRED**: `token`

#### **Body**
Format: form-data

Required fields:
- name : `String`
- image : [`File`] (index 0 är högupplöst, index 1 är lågupplöst)
- price :
    ```js
    {type: String, value: String}
    ```
Optional fields:
- description : `String`
- date : `String`
- orders :
```js
[{company: String, amount: Number, order: String, date: String}]
```
- tags : `[ObjectID]`
- files : `[ObjectID]`
- inStock : `Boolean`
- comment : `String`
- creators : `[{name: String}]`

Se [pristyper](#pricetypes).

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {status: String, patch: Patch}
    ```
- `403` om någon slags data i requesten saknas eller är fel.
- `500` om något gick fel.

---
<a id="post-admin-marke-edit-id"></a>
## POST /api/admin/marke/edit/id/:id
**Beskrivning:** Redigerar märket. Ändrar de fält du skickar.

För filer: Lägg till alla filer i form-datan med namnet "files".

TODO: Separera filuppladdning till en egen endpoint, det kan bli knasigt nu när vi kör formdata och parsar objekt och arrayer till JSON för att de ska fungera. Kör man curl kan det bli konstigt.

### Request
**REQUIRED**: `token`

#### **Body**
Format: form-data

Optional fields:
- name : `String`
- image : [`File`]
- price :
    ```json
    {"type": "String", "value": "String"}
    ```
    Se [pristyper](#pricetypes).
- description : `String`
- date : `String`
- orders :
```json
[{"company": "String", "amount": "Number", "order": "String", "date": "String"}]
```
- tags : `[ObjectID]`
- files : `[binary]`
- inStock : `Boolean`
- comment : `String`
- creators : `[{"name": "String"}]`


### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {status: String}
    ```
- `403` om någon slags data i requesten saknas eller är fel.
- `404` om märket ej finns.
- `500` om något gick fel.
---
<a id="get-admin-marke-remove-id"></a>
## GET /api/admin/marke/remove/id/:id
**Beskrivning:** Tar bort märket.

### Request
**REQUIRED**: `token`

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {status: String}
    ```
- `404` om märket ej finns.
- `500` om något gick fel.
---
<a id="post-admin-marke-register-orders"></a>
## POST /api/admin/marke/register-orders
**Beskrivning:** Registrerar flera ordrar för ett märke

### Request
**REQUIRED**: `token`

#### **Body**
**Format:** `JSON`

Required fields:
- orders
```js
[{
    id: Patch.ObjectID,
    order: [{
        amount: "String",
        date: "String",
        order: "String",
        company: "String"
    }] 
}]
```

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {status: String}
    ```
- `404` om märket ej finns.
- `403` om något är fel med den skickade kroppen.
- `500` om något gick fel.
---
<a id="removefile"></a>
## GET api/admin/marke/remove/file/:filename
**Beskrivning:** Tar bort en fil. Tar bort både filen från databasen samt det tillhörande `FileLink`-objektet.

### Request
**REQUIRED**: `token`

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {status: String}
    ```
- `404` om filen inte hittades.
- `500` om något gick fel.
---