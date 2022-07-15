import 'bootstrap';
import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { LoginBtn, LogoutBtn } from './form.component';
import { Carousel } from './carousel.component';

const Home = () => {
    const { isAuthenticated, user, isLoading } = useAuth0();
    useEffect(() => {
        console.log(user);
    }, [user]);
    return (
        <div className='home-container'>

            <Carousel />
            
            {isAuthenticated && <p> Hello {user?.name}</p>}
            {!isAuthenticated && <LoginBtn title='Login' />} 
            {isAuthenticated && <LogoutBtn title='Logout' /> }
            
        </div>
    );
};

export default Home;