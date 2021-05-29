import json
import random
import time
from urllib import request, parse
urlPreLlenado = "https://api-node-tareas.herokuapp.com/tareas/pre-llenado"
urlCrear = "https://api-node-tareas.herokuapp.com/tareas/crear"
resp = request.urlopen(urlPreLlenado)
respRead = resp.read()
data = json.loads(respRead)
if data['code'] == 0:
    data['response']['descripcion'] = 'Tarea autogenerada: #' + str(random.randint(0, 100))
    data['response']['inicio'] = int(round(time.time() * 1000))
    data['response']['duracion'] = int(60)
    dataService = parse.urlencode(data['response']).encode()
    req =  request.Request(urlCrear, data=dataService)
    resp = request.urlopen(req)
    print('Se creo la tarea con Exito.')
else:
    print ("ocurrio un error")
