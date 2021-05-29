import { useState, useEffect } from 'react';
import * as tareasService from '../services/Tareas.service';


//Components
import Header from '../components/Header';

function Tareas() {

    const [list, setList] = useState([]);
    const [mensajeModExito, setMensajeModExito] = useState('');
    const [modalAgregar, setModalAgregar] = useState({
        tipo: '',
        titulo: '',
        botonExito: ''
    });
    const [bandera, setBandera] = useState(false);
    const [itemEliminar, setItemEliminar] = useState({
        id: '',
        descripcion: ''
    });
    const [itemModificar, setItemModificar] = useState();
    const [itemCompletar, setItemCompletar] = useState();
    const [datos, setDatos] = useState({
        descripcion: '',
        duracionEstimada: 0
    });

    useEffect(() => {
        obtenerTareas();
    }, []);

    const obtenerTareas = async () => {
        var resp = await tareasService.obtenerTareas();
        if(resp){
            setList(resp.response);
        }
    }

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
    }

    const openModalAgregar = () => {
        setBandera(false);
        limpiarForm();
        etiquetasModalAgregar('agregar');
        global.$('#modAgregar').modal('show');
    }

    const openModalEditar = (item) => {
        etiquetasModalAgregar('editar');
        setDatos({
            descripcion: item.descripcion,
            duracionEstimada: item.duracion
        });
        setItemModificar(item);
        global.$('#modAgregar').modal('show');
    }

    const submitAgEd = () => {
        if (modalAgregar.tipo === 'agregar') {
            agregarTarea();
        } else {
            modificarTarea();
        }
    }

    const agregarTarea = async () => {
        setBandera(true);
        let data = {
            descripcion: datos.descripcion,
            duracion: +datos.duracionEstimada,
            inicio: new Date().getTime(),
            fin: 0,
            tiempo: '',
            tiempoRegistrado: '',
            estatus: 'Pendiente'
        }
        var resp = await tareasService.agregarTarea(data);
        if (resp) {
            setBandera(false);
            var modAgregar = document.getElementById('modAgregar');
            modAgregar.click();
            obtenerTareas();
            limpiarForm();
            openModExito(resp.message);
        }
    }

    const modificarTarea = async () => {
        setBandera(true);
        let data = {
            descripcion: datos.descripcion,
            duracion: +datos.duracionEstimada,
            inicio: itemModificar.inicio,
            fin: itemModificar.fin,
            tiempo: itemModificar.tiempo,
            tiempoRegistrado: itemModificar.tiempoRegistrado,
            estatus: itemModificar.estatus
        }
        var resp = await tareasService.modificarTarea( itemModificar.id, data);
        if (resp) {
            setBandera(false);
            var modAgregar = document.getElementById('modAgregar');
            modAgregar.click();
            obtenerTareas();
            limpiarForm();
            openModExito(resp.message);
        }
    }

    const openModalFinalizar = (item) => {
        setItemCompletar(item);
        global.$('#modCompletar').modal('show');

    }

    const finalizarTarea = async () => {
        setBandera(true);
        let fin = new Date().getTime();
        let tiempoRegistrado = convertirMilisegundos(fin - itemCompletar.inicio);
        let data = {
            descripcion: itemCompletar.descripcion,
            duracion: itemCompletar.duracion,
            inicio: itemCompletar.inicio,
            fin: fin,
            tiempo: tiempo(tiempoRegistrado),
            tiempoRegistrado: tiempoRegistrado,
            estatus: 'Completada'
        }
        var resp = await tareasService.modificarTarea( itemCompletar.id, data);
        if (resp) {
            setBandera(false);
            var modCompletar = document.getElementById('modCompletar');
            modCompletar.click();
            obtenerTareas();
            limpiarForm();
            openModExito('La tarea se completo.');
        }
    }

    const tiempo = (minutos) => {
        let min = +minutos.substring(0, minutos.indexOf(':'));
        var respuesta = '';
        if (min >= 0 && min <= 30) respuesta = 'Corto';
        if (min > 30 && min <= 45) respuesta = 'Mediano';
        if (min > 45 && min <= 60) respuesta = 'Largo';
        if (min > 60) respuesta = 'Muy largo';
        return respuesta;
    }

    const convertirMilisegundos = (ms) => {
        var minutes = Math.floor(ms / 60000);
        var seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    const openModalEliminar = (item) => {
        setItemEliminar({
            id: item.id,
            descripcion: item.descripcion
        })
        global.$('#modEliminar').modal('show');
    }

    const eliminarTarea = async () => {
        setBandera(true);

        var resp = await tareasService.eliminarTarea(itemEliminar.id);
        if (resp) {
            setBandera(false);
            var modEliminar = document.getElementById('modEliminar');
            modEliminar.click();
            obtenerTareas();
            openModExito(resp.message);
        }
    }

    const limpiarForm = () => {
        setDatos(
            {
                descripcion: '',
                duracionEstimada: 0
            }
        )
        document.getElementById('form-agregar').reset();
    }

    const etiquetasModalAgregar = (tipo) => {
        setModalAgregar({
            tipo: tipo,
            titulo: (tipo==='agregar'?'Nueva tarea':'Modificar tarea'),
            botonExito: (tipo==='agregar'?'Guardar':'Actualizar')
        });
    }

    const openModExito = async (mensaje) => {
        setMensajeModExito(mensaje)
        setTimeout(() => {
            global.$('#modExito').modal('show');
        }, 100);
    }
    
    return (
        <div>
            <Header/>
            <div className="container container-tareas">
                <h2>Lista de tareas</h2>
                <hr/>

                <button type="button" className="btn btn-primary rounded-circle" style={{ width:"50px", height: "50px"}}
                    data-bs-toggle="tooltip" data-bs-placement="right" title="Agregar"
                    onClick={openModalAgregar}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
                    </svg>
                </button>
                
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr className="text-center">
                                <th scope="col">Descripción</th>
                                <th scope="col">Duración estimada (min)</th>
                                <th scope="col">Tiempo registrado (min/sec)</th>
                                <th scope="col">Tiempo</th>
                                <th scope="col">Estatus</th>
                                <th width="200px" scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                            list?.map(item => (
                                <tr key={item.id} className="text-center">
                                    <td>{item.descripcion}</td>
                                    <td>{item.duracion}</td>
                                    <td>{item.tiempoRegistrado}</td>
                                    <td>{item.tiempo}</td>
                                    <td>{item.estatus}</td>
                                    <td>
                                        <button className="btn btn-outline-info" style={{marginRight: "10px"}} data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" onClick={(e) => openModalEditar(item)} disabled={item.estatus==='Completada'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                            </svg>
                                        </button>
                                        <button className="btn btn-outline-success" style={{marginRight: "10px"}} data-bs-toggle="tooltip" data-bs-placement="top" title="Finalizar" onClick={(e) => openModalFinalizar(item)} disabled={item.estatus==='Completada'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                                            </svg>
                                        </button>
                                        <button className="btn btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" onClick={(e) => openModalEliminar(item)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {
                //Modal agregar o editar
            }
            <div className="modal fade" id="modAgregar" tabIndex="-1" aria-labelledby="modAgregarLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modAgregarLabel">{modalAgregar.titulo}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form id="form-agregar">
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" value={datos.descripcion} onChange={handleInputChange} name="descripcion" id="floatingInput" placeholder="Descripcion"/>
                                <label forname="floatingInput">Descripción</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="number" className="form-control" value={datos.duracionEstimada} onChange={handleInputChange} name="duracionEstimada" id="floatingInput" placeholder="Duracion"/>
                                <label forname="floatingInput">Duración estimada en minutos</label>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={limpiarForm}>Cancelar</button>
                        <button type="button" className="btn btn-outline-primary" onClick={submitAgEd} disabled={datos.descripcion===''||bandera} style={{width: '100px'}}>
                            {
                                (
                                    !bandera?modalAgregar.botonExito:
                                        <div className="spinner-border text-primary" role="status" style={{width: '20px', height: '20px'}}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                )
                            }
                        </button>
                    </div>
                    </div>
                </div>
            </div>

            {
                //Modal eliminar
            }
            <div className="modal fade" id="modEliminar" tabIndex="-1" aria-labelledby="modEliminarLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modEliminarLabel">Eliminar tarea</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Desea eliminar la tarea "{itemEliminar.descripcion}"</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-outline-danger" onClick={eliminarTarea} disabled={bandera} style={{width: '80px'}}>
                            {
                                (
                                    !bandera?"Eliminar":
                                        <div className="spinner-border text-danger" role="status" style={{width: '20px', height: '20px'}}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                )
                            }
                        </button>
                        
                    </div>
                    </div>
                </div>
            </div>

            {
                //Modal completar
            }
            <div className="modal fade" id="modCompletar" tabIndex="-1" aria-labelledby="modCompletarLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modCompletarLabel">Finalizar tarea</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Desea completar la tarea "{itemCompletar?.descripcion}"</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-outline-success" onClick={finalizarTarea} disabled={bandera} style={{width: '80px'}}>
                            {
                                (
                                    !bandera?"Finalizar":
                                        <div className="spinner-border text-success" role="status" style={{width: '20px', height: '20px'}}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                )
                            }
                        </button>
                        
                    </div>
                    </div>
                </div>
            </div>


            {
                //Modal Exito
            }
            <div className="modal fade" id="modExito" tabIndex="-1" aria-labelledby="modExitoLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modExitoLabel">Éxito</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>{mensajeModExito}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tareas;