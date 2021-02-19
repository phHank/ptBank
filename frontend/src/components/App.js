import React from 'react'

import { 
    Switch, 
    Route,
    Redirect
} from 'react-router-dom'

import Home from './Home'
import Login from './Login'


const App = () => (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login}/>
    </Switch>
)

export default App