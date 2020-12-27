# API-dokumentation
Här finns API-dokumentationen för damm.

Senast uppdaterad 2020-12-27.

# Innehållsförteckning
<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Modeller
## Märke (Patch)


### <a id="pricetypes"></a>Pristyper
- Gratis
- Okänt
- Ange pris

## FileLink

## Tag (Taggar)

## Users

## Events


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

### Exempel
```json
{
    "error":"Unauthorized",
    "httpStatus": 401
}
```

# Tokens
För vissa endpoints krävs en token. En token läggs till med `?token=banankaka` på slutet av URL:en, exempelvis: `https://damm.datasektionen.se/api/admin/refresh?token=banankaka`

# Admin endpoints
Adminendpoints förväntar sig att du har en token. Token läggs till med `?token=banankaka` på slutet av URL:en, exempelvis: `https://damm.datasektionen.se/api/admin/refresh?token=banankaka`

För dessa adminendpoints gäller:
- Har du ingen token svarar servern med `403`.
- Har du ingen access svarar servern med `401`.
- Gick något fel svarar servern med `500`.

# General endpoints

## GET /api
**Beskrivning:** Hämtar all data som visas på tidslinjen.

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.

## GET /damm
**Beskrivning:** Skickar en dammig bild.

### Response
**Format:** `HTML`
- `200` om allt gick rätt till.

## GET /fuzzyfile
**Beskrivning:** Hämtar fuzzy-filen.

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.

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

## GET api/file/:filename
**Beskrivning:** Hämtar en fil med specificerat filnamn

### Response
**Format:** `binary`
- `200` om allt gick rätt till.
- `403` om ingen token medskickad.
- `404` om något gick fel, exempelvis om token är fel format.

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
# General - Admin
## GET /api/admin/refresh
**Beskrivning:** Refreshar tidslinjen, hämtar all data från olika källor och cachar den. Kan bara köras max en gång per minut.

Notera att servern kör refresh automatiskt varje dygn (görs med en `setInterval` i `app.js`).

### Response
**Format:** `JSON`
- Om mindre än en minut gått sen senaste refresh svarar servern med `403`.
- Annars svarar servern med `200`.

# Märkesrelaterat
Märkesrelaterade endpoints.

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

# Märkesrelaterat - Admin

## POST /api/admin/marke/create
**Beskrivning:** Skapar ett nytt märke.

### Request
**REQUIRED**: `token`

#### **Body**
Format: form-data

Required fields:
- name : `String`
- image : `File`
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
## POST /api/admin/marke/edit/id/:id
**Beskrivning:** Redigerar märket. Ändrar de fält du skickar.

TODO: Separera filuppladdning till en egen endpoint, det kan bli knasigt nu när vi kör formdata och parsar objekt och arrayer till JSON för att de ska fungera. Kör man curl kan det bli konstigt.

### Request
**REQUIRED**: `token`

#### **Body**
Format: form-data

Optional fields:
- name : `String`
- image : `File`
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
- files : `[ObjectID]`
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
## POST /api/admin/marke/replace-image/id/:id
**Beskrivning:** Byter bild för märket.

### Request
**REQUIRED**: `token`

#### **Body**
Format: form-data

Required fields:
- image : `File`

### Response
**Format:** `JSON`
- `200` om allt gick rätt till.
    
    **Body format:**
    ```js
    {status: String}
    ```
- `403` om ingen bild skickades med.
- `404` om märket ej finns.
- `500` om något gick fel.
---
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
## POST /api/admin/marke/register-orders
**Beskrivning:** Registrerar flera ordrar för ett märke

### Request
**REQUIRED**: `token`

#### **Body**
Format: form-data

Required fields:
- orders : `[{amount: "String", date: "String", order: "String", company: "String"}]`

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