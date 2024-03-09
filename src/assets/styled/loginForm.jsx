import styled from "styled-components";
import { Link as a } from 'react-router-dom';

export const SignInWrapper = styled.div`
    height:auto;
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: 50% 50%;
    border-radius: 10px;
    margin-top: 3rem;


    @media screen and (max-width: 768px){
        display: flex;
        flex-direction: column;
        height: 700px;
    }

    @media screen and (max-width: 480px){
        height: 400px;
        display: flex;
        flex-direction: column;
    }
`


export const LoginButton = styled.button`
    height: 30px;
    width: 100px;
    border-radius: 5px;
    background: "#FF9B50";
    padding: 5px;

`