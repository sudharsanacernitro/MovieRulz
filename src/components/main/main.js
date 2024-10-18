import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../base_components/header';
import Cards from './cards';
function Main()
{
    return (
        <>
        <Header></Header>
        <Cards/>
        </>
    );
}

export default Main;