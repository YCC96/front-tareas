import { Route, Switch } from 'react-router-dom';

//components
import Tareas from '../pages/Tareas';

const Routes = () => {
    return(
        <Switch>
            <Route exact path="/" component={Tareas}/>
        </Switch>
    )
}

export default Routes;