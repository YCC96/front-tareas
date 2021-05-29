import axios from 'axios';

export async function obtenerTareas(){
    const urlService = process.env.REACT_APP_HOST_API + '/tareas/consulta';
    const service = await axios({
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
        url: urlService,
    }).catch(error => {
        console.log('*_* ocurrio un error: ', error, urlService);
    });
    return service.data;
}

export async function agregarTarea(data){
    const urlService = process.env.REACT_APP_HOST_API + '/tareas/crear';
    const service = await axios({
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        url: urlService,
        data: JSON.stringify(data)
    }).catch(error => {
        console.log('*_* ocurrio un error: ', error);
    });
    return service.data;
}

export async function modificarTarea(id, data){
    const urlService = process.env.REACT_APP_HOST_API + '/tareas/actualizar/' + id;
    const service = await axios({
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        url: urlService,
        data: JSON.stringify(data)
    }).catch(error => {
        console.log('*_* ocurrio un error: ', error);
    });
    return service.data;
}

export async function eliminarTarea(id){
    const urlService = process.env.REACT_APP_HOST_API + '/tareas/eliminar/' + id;
    const service = await axios({
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        url: urlService,
    }).catch(error => {
        console.log('*_* ocurrio un error: ', error);
    });
    return service.data;
}