# web-2-projekti "Film-Listing"
 
 Author Sampo Bredenberg
 
## Kuvaus
**Film-Listing** rajapinta tallentaa elokuviva ja näyttelijöitä, sekä mahdollistaa näyttelijöiden lisäämisen elokuviin. 
Rajapinnan tietojen tarkasteleminen on vapaata. Tietojen lisääminen, muuttaminen ja poistaminen edellyttää käyttäjän luomista. 
Rajapinta pyynnöt lisäämiselle, muokkaamiselle ja poistamiselle tarvitsevat jwt tokenia, jonka käyttäjä saa kirjautumalla sisään
sähköposti ja salasana yhdistelmällä. 

- Client - React
- Server - Express
- Database - MySQL
- Styling - react-bootstrap

Rajapinnan hyväksymät pyynnöt alempana.


## Käyttöliittymän ja serverin käynnistäminen
Komento `npm install` täytyy juosta client ja server kansioissa ennen käynnistämistä.

### Käyttöliittymä
Käynnistääkseen käyttöliittymän, kansiossa client käytetään komentoa `npm start`, joka käynnistää sen osoitteessa `localhost:3000`.

### Server
Serveri kuuntelee porttia **5000**. Se käynnistetään käyttämällä `node` (tai `nodemon`) komentoa tiedostolle `server.js`.


## Rajapinta pyynnöt
Rajapinnan eri pyynnöt on jaettu omiin `.js` tiedostoihin, jotka vievät (export) pyynnöt `express.Router()`:in avulla. `server.js` 
tuo (import) pyynnöt yhteen, konfiguroi portin ja aloittaa pyyntöjen kuuntelun.

Jos pyyntö ei mene läpi tuntemattomasta syystä rajapinta palauttaa `400 "Error"` ja vika tulostetaan.

### `POST /newUser` 

Luo uuden käyttäjän tietokantaan. Pyyntö odottaa body parametria jossa 'username', 'email', 'password'.

#### Esimerkki

    (Pyyntö)
    POST /newUser Body: {"username": "Name", "email": "example@email.com", "password": "verysecret"} 
    
    (Palauttaa)
    Onnistuessa - 201 "POST successful"
    Jos email jo käytössä - 406 {"text": "Email already in use", field: 2}

### `POST /loginUser`

Palauttaa käyttäjälle jwt (tokenin), jolla käyttäjä pystyy todentamaan itsensä. Tokeni tallennetaan local storageen.
Pyyntö odottaa body parametria jossa 'email', 'password'.

#### Esimerkki

    (Pyyntö)
    POST /loginUser Body: {"email": "example@email.com", "password": "verysecret"}

    (Palauttaa)
    Onnistuessa - 200 {"accessToken": "rw3oijun1234", "username": "Name"}
    Väärä email - 400 {"text": "User not found", "field": 2}
    Väärä salasana - 400 {"text": "Wrong password", "field": 3}

### `POST /authenticateUser`
Käyttäjän jwt (tokeni) todennetaan kutsulla. Käyttöliittymässä poistetaan elementtejä käytöstä kutsun avulla.
Pyyntö odottaa body parametria jossa 'accessToken'.

#### Esimerkki

    (Pyyntö)
    POST /authenticateUser Body: {"accessToken": "r32j08i"}

    (Palauttaa)
    Todennettu - 200 "User authenticated
    Ei todennettu - 401 "User not authenticated"

### `POST /addMovie`
Lisää elokuvan tietokantaan. Ainoa tarvittava tieto elokuvasta on *title*. Käyttäjällä on oltava kelpo jwt (tokeni).
Pyyntö odottaa body parametria jossa 'accessToken', 'title'. Näiden lisäksi voi liittää 'description'. Posterin lisääminen jatkokehitys idea.

#### Esimerkki

    (Pyyntö)
    POST /addMovie Body: {"accessToken": "fmni3o4", "title": "The Pianist", "description": "Polish pianist during the Second World War"}

    (Palauttaa)
    Onnistuessa - 201 "POST successful"
    Käyttäjä ei todennettu - 401 {"text": "Unauthorized"}
    Ei titleä - 400 {"text": "Title can't be null"}
    Elokuva jo tietokannassa - 400 {"text": "Movie already in database"}

### `PUT /editMovie/:movie`
Muokkaa tietokannassa olevaa elokuvaa. Elokuvan *title* ja *poster* mahdollista muokata.
Muokattava elokuva valitaan pyynnön parametrina osoitteessa. Bodyyn lisätään muokattava tieto 'description', 'poster'. 
Käyttäjällä on oltava kelpo jwt (tokeni). Pyyntö odottaa body parametria jossa 'accessToken'. 

#### Esimerkki

    (Pyyntö)
    PUT /editMovie/The Pianist Body: {"accessToken": "32hui9", "description": "WW2 movie"}

    (Palauttaa)
    Onnistuessa - 200 "PUT successful"
    Käyttäjä ei todennettu - 401 {"text": "Unauthorized"}
    Tyhjä muokkaus - 400 {"text": "Empty edit"}

### `DELETE /deleteMovie/:movie:/:token`
Poistaa elokuvan tietokannasta. Poistettava elokuva valitaan pyynnön parametrina osoitteessa ja kutsu todennetaan 
jwt:n avulla joka annetaan parametrina osoitteessa. Käytettävä axios moduuli ei tue body dataa DELETE kutsuissa joten 
data pitää viedä osoitteen kautta. 

#### Esimerkki

    (Pyyntö)
    DELETE /deleteMovie/Drive/noiugj45

    (Palauttaa)
    Onnistuessa - 200 "DELETE successful"
    Käyttäjä ei todennettu - 401 {"text": "Unauthorized"}
    Valittua elokuvaa ei tietokannassa - 400 {"text": "No such movie found"}

### `GET /getMovies:query`
Palauttaa kaikki elokuvat json muodossa, joissa esiintyy *query* jossain muodossa. Mahdollistaa saman nimisten elokuvien haun tietokannasta. 
Tyhjä *query* palauttaa kaikki elokuvat. Jatkokehityksenä palauttaa myös elokuvan näyttelijät.

### `GET /getMovies`
Palauttaa kaikki elokuvat json muodossa, sama kuin `GET /getMovies:`.

#### Esimerkki

    (Pyyntö)
    GET /getMovies:s 

    (Palauttaa)
    {
        "id": 1,
        "title": "The Pianist",
        "description": "Polish pianist's struggles during the Second World War.",
        "poster": null
    },
    {
        "id": 19,
        "title": "Saw",
        "description": "",
        "poster": null
    }

### `GET /getMovie:movie`
Palauttaa elokuvan json muodossa, joka vastaa *movie*.

#### Esimerkki

    (Pyyntö)
    GET /getMovie:The Pianist
    
    (Palauttaa)
    {
        "id": 1,
        "title": "The Pianist",
        "description": "Polish pianist's struggles during the Second World War.",
        "poster": null
    }

### `POST /addActor`
Lisää näyttelijän tietokantaan. Käyttäjällä on oltava kelpo jwt (tokeni).
Pyyntö odottaa body parametria jossa 'accessToken', 'name'. Kehitysideana näyttelijän lisäämisen yhteydessä voisi valita elokuvat joissa näytellyt.

#### Esimerkki

    (Pyyntö)
    POST /addActor Body: {"accessToken": "gf453", "name": "Nicholas Cage"}
    
    (Palauttaa)
    Onnistuessa - 201 "POST successful"
    Käyttäjä ei todennettu - 401 {"text": "Unauthorized"}
    Ei nimeä - 400 {"text": "Name can't be null"}
    Näyttelijä tietokannassa - 400 {"text": "Actor already in database"}

### `PUT /editActor:actor`
Ei toteutettu. Näyttelijöillä ei muokattavia tietoja.

#### Esimerkki
    
    (Pyyntö)
    POST /editActor:Nicholas Cage
    
    (Palauttaa)
    Käyttäjä ei todennettu - 401 {"text": "Unauthorized"}
    Todennettu - 501

### `DELETE /deleteActor/:actor/:token`
Poistaa näyttelijän tietokannasta. Poistettava näyttelijä valitaan pyynnön parametrina osoitteessa ja kutsu todennetaan
jwt:n avulla joka annetaan parametrina osoitteessa. Käytettävä axios moduuli ei tue body dataa DELETE kutsuissa joten
data pitää viedä osoitteen kautta. 

#### Esimerkki
    
    (Pyyntö)
    DELETE /deleteActor/Matt Damond/t54ikjn

    (Palauttaa)
    Onnistuessa - 200 "DELETE successful
    Käyttäjä ei todennettu - 401 {"text": "Unauthorized"}
    Näyttelijää ei tietokannassa - 400 {"text": "No actor found"}

### `GET /getActors:query`
Palauttaa kaikki näyttelijät json muodossa, joissa esiintyy *query* jossain muodossa. Mahdollistaa saman nimisten näyttelijöiden haun tietokannasta.
Tyhjä *query* palauttaa kaikki näyttelijät. Jatkokehityksenä palauttaa myös elokuvat jossa mukana. 

### `GET /getActors`
Palauttaa kaikki näyttelijät json muodossa, sama kuin `GET /getActors:`.

#### Esimerkki

    (Pyyntö)
    GET /getActors:att

    (Palauttaa)
    {
        "id": 9,
        "name": "Chris Pratt"
    },
    {
        "id": 10,
        "name": "Matt Damon"
    }

### `GET /getActor:actor`
Palauttaa näyttelijän json muodossa, joka vastaa *actor*.

#### Esimerkki

    (Pyyntö)
    GET /getActor:Matt Damon

    (Palauttaa)
    {
        "id": 10,
        "name": "Matt Damon"
    }

### `PUT /editTableActorMovie:actor`
Muokkaa actor_movie taulua, joka ylläpitää näyttelijä - elokuva yhteyksiä. Kutsun avulla voidaan muokata missä elokuvissa
näyttelijä on ollut mukana. Näyttelijä jonka elokuvia muokataan määritetään body parametrina osoitteessa. Elokuvat valitaan
'movies' arrayna, joka välitetään osana bodya. Arrayssa on elokuvien id:t. Käyttäjällä on oltava kelpo jwt.

#### Esimerkki

    (Pyyntö)
    PUT /editTableActorMovie:Matt Damon Body: {"accessToken": "t43bgn", "movies": [15, 5, 29]}

    (Palauttaa)
    Onnistuessa - 200 "PUT successful"
    Käyttäjä ei todennettu - 401 {"text": "Unauthorized"}

### `GET /selectActorMovies:actor`
Palauttaa elokuvat jossa valittu *actor* on mukana json muotona. 
Jatkokehitys elokuvissa mukana näyttelijät. 

#### Esimerkki

    (Pyyntö)
    GET /selectActorMovies:Matt Damon

    (Palauttaa)
    {
        "id": 20,
        "title": "The Departed"
    },
    {
        "id": 24,
        "title": "Will Hunting"
    }

### `GET /selectMovieActors:movie`
Palauttaa näyttelijät jotka on yhdistetty elokuvaan *movie* json muotona.
Jatkokehitys näyttelijöissä kaikki elokuvat joissa mukana. 

#### Esimerkki

    (Pyyntö)
    GET /selectMovieActors:Monty Python and the Holy Grail

    (Palauttaa)
    {
        "id": 21,
        "name": "John Cleese"
    },
    {
        "id": 17,
        "name": "Graham Chapman"
    }

## Kuvankaappauksia käyttöliittymästä
![addMovie](https://user-images.githubusercontent.com/75117957/197154685-320eb57f-7b23-4f4b-8ab0-aeec2e76bdac.png)
![kuva](https://user-images.githubusercontent.com/75117957/197155145-dd2647b8-0331-4d08-9212-c523915ca760.png)
![kuva](https://user-images.githubusercontent.com/75117957/197155239-7720d44a-cf8c-4af1-bd60-7f9c3f74eaa5.png)
![kuva](https://user-images.githubusercontent.com/75117957/197155343-bc6855be-aa32-44a7-b75a-26c340b0d096.png)
![kuva](https://user-images.githubusercontent.com/75117957/197155383-6c9dfd97-dba0-4ae6-91ca-38768e366b70.png)


