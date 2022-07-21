import React from 'react';
import '../styles/form.css';

interface Props extends React.PropsWithChildren {
    onSubmit: () => void,
};

const Form = ( { children, onSubmit }:  Props) => {

    return (
        <form id="form-component" onSubmit={ onSubmit }>
            { children }
        </form>
    );
};

export default Form;