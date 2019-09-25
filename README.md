# simple-http-proxy

## Ejecución

```bash
npm start
```

## Ejemplo configuración

```json
{
   "port": 8082,
   "proxy": [
       {
           "path": "/ahorro/vida*",
           "target": "http://localhost:8080"
       },
       {
           "path": "/vida*",
           "target": "http://localhost:8080"
       },
       {
           "path": "/*",
           "target": "https://consorcio-integracion.modyo.be"
       }
   ],
   "mocks": [
       {
           "path": "/hola/mundo",
           "method": "get",
           "responseBody": {
                "text": "hola mundogsdf"
           } 
       }
   ]
}
```
* http://localhost:8082/foo/baz --> http://localhost:8081/foo/baz
* http://localhost:8082/bar/baz --> https://facebook.com/bar/baz
