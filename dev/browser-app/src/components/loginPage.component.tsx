import React from 'react';
import Form from './form.component';
import bootstrap from 'bootstrap';

const LoginPage = () => {
    
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = () => {

    }

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" />
            </div>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Password</label>
                <input type="password" className="form-control" id="plainTextPwd" />
            </div>
            <button id="submitBtn" type="submit" className="btn btn-primary">Sign in</button>
        </Form>
    );
};

export default LoginPage;