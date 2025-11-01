import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
  
    //jada ter token se auth se fetch krege 
    //and User ko Profile data me se Fetch krege ! 
    const {token} = useSelector((state) => state.auth);

    if(token !== null)
        return children
    else
        return <Navigate to="/login" />

}

export default PrivateRoute
