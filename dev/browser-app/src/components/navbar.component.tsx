import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap';
import '../styles/navbar.css';


interface Props {
    logged_in: boolean,
    user?: {
        user_id: number,
        u_name: string,
        image?: "",
    },
}

const NavBar = ( {logged_in, user}: Props ) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/home">Gaucho.NET</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                
                { !logged_in &&  
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Sign Up</a>
                    </li>
                </ul>
                }
                { logged_in &&
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="#"></a>
                    </li>
                </ul>
                }
                {logged_in && 
                <form className="form-inline">
                    <Link role="button" className="btn btn-outline-primary" to="/login">Login</Link>
                </form>
                }
                    
            </div>
        </nav>
    );
};

export default NavBar;