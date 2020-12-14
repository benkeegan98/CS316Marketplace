import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// defining a Private Route so you can only access internal pages if you are logged in

export const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            localStorage.getItem('session_id')
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />
    )
};