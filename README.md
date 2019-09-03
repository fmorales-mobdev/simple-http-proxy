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
        /* IE: http://localhost:8082/foo/baz -> http://localhost:8081/foo/baz*/
        { 
            "path": "/foo/*",
            "target": "http://localhost:8081"
        },
        /* IE: http://localhost:8082/bar/baz -> https://facebook.com/bar/baz */
        { 
            "path": "/bar/*",
            "target": "https://facebook.com"
        }
    ]
}
```
