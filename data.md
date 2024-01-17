instalar docker desktop y tableplus

configurar docker-compose.yaml

ejecutar docker: docker-compose up -d
esperar a que este levantado (revisamos docker desktop)

conectar table plus a base de datos mongo recien creada

crear nueva conexion: URL mongodb://localhost:27017/nest-pokemon
(puertos y nombres de docker-compose.yaml)


crear modulo common
nest g mo common
agregar pipes dentro de modulo nuevo
nest g pi common/pipes/parseMongoId --no-spec
esto deberia quedar src/common/pipes/parse-mongo-id.pipe.ts
