import { useAuth0 } from "@auth0/auth0-react";

export interface LoginBtnProps {
    title: string,
};
export const LoginBtn = ({ title }: LoginBtnProps) => {
    const { loginWithRedirect } = useAuth0();
    return (
        <button onClick={ loginWithRedirect }>{ title }</button>
    );
};

export interface LogoutBtnProps {
    title: string,
};
export const LogoutBtn = ({ title }: LogoutBtnProps) => {
    const { logout } = useAuth0();
    return (
        <button onClick={ () => logout({ returnTo: window.location.origin }) }>{ title }</button>
    );
};