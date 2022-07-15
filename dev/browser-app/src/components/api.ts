import axios from 'axios';

export interface User {
    _id: string,
    username: string,
    email: string,
};

export interface Session {
    Users: {
        getClientUser: () => User
    }, 
    Posts: {},
    accessToken: string,
};
