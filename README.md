# API Leicester City - Backend 2020

API Rest construida con Express, Typescript y MongoDB que realiza scraping
de la web https://www.lcfc.com y ofrece endpoints para la consulta de los
datos obtenidos.

## Instalación 

*Primero debe cargar la db con los datos. Para ello ejecute el siguiente comando que hará el scraping, obtendrá los datos y los almacenara en la db.*
```
npm run init
```

*Una vez se haya completado la carga de los datos ejecute el siguiente comando que correrá el servidor en modo de desarrollo*
- `npm run dev`

*Si desea correrlo en modo de producción ejecute el siguiente comando que compilara el proyecto y seguido lo ejecutara*
- `npm start`

## Como usar

*Tomando como ejemplo una ejecución local, dispone de los siguientes endpoints:*

### endpoints users

- **[POST]** **http://localhost:4000/api/users/register** 
- **[POST]** **http://localhost:4000/api/users/signin**
- **[POST]** **http://localhost:4000/api/users/logout**

### endpoints matches ('$foo' se refiere a una variable)

- **[GET]** **http://localhost:4000/api/matches/last**
- **[GET]** **http://localhost:4000/api/matches/match/$matchId**
- **[GET]** **http://localhost:4000/api/matches/start/$startdate/end/$enddate**
- **[GET]** **http://localhost:4000/api/matches/points/start/$startdate/end/$enddate**
- **[GET]** **http://localhost:4000/api/matches/mostgoals**
- **[POST]** **http://localhost:4000/api/matches/new**

### Formatos de entrada de datos

- Para registrar un usuario:
  - `{`
       `"username":` `"username-example",`
       `"email":` `"email-example",`
       `"password":` `"password-example",`
       `"confirmpass":` `"confirm-example",`
    `}`


- Para agregar un partido:
  - `{`
       `"homeTeam":` `"homeTeam-example",`
       `"awayTeam":` `"awayTeam-example",`
       `"description":` `"description-example",`
       `"startDate":` `"startDate-example",`
       `"eventStatus":` `"eventStatus-example",`
       `"url":` `"url-example",`
       `"competition":` `"competition-example",`
       `"homeScore":` `"homeScore-example",`
       `"awayScore":` `"awayScore-example",`
       `"matchId":` `"matchId-example",`
    `}`


- El formato para las fechas:
  - `yyyy-mm-dd`


## Construido con
- Node.js
- Express.js
- Typescript
- MongoDB

## Aplicación

Esta API se encuentra deplegada en: [API Leicester City](https://api-leicestercity.herokuapp.com/).
