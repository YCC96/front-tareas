function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#/">ABRAXAS</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#/">Tareas</a>
                        </li>
                    </ul>
                    <form className="d-flex">
                        <div className="btn-group dropstart">
                            <div className="cursor" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="avatar.jpg" className="rounded-circle avatar" alt="..."/>
                            </div>
                            <ul className="dropdown-menu">
                                <li className="dropdown-item">Yordy Cruz</li>
                                <li><a className="dropdown-item" href="#/">Perfil</a></li>
                                <li><a className="dropdown-item" href="#/">Configuración</a></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><a className="dropdown-item" href="#/">Cerrar Sesión</a></li>
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Header;