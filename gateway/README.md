## Description

AMRIT API Gateway. Forward requests to differents APIs.

endpoints :
'/api/{api-name}'

exemple : 

```
GET localhost:3000/api/alerta/alerts
```

## Environnement variables
```
ALERTA_HOST=

ALERTA_READ_API_KEY=
```

## Project setup

```bash
$ npm install
```

## Compile and run the project


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
