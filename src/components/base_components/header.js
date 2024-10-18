import { useEffect,useState } from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';
import {FaHome,FaSearch} from 'react-icons/fa';

function Header()
{

    const navigate = useNavigate();

    function route(a)
    {
        navigate(a);
    }
    return (<>
    <div id="navbar">
        <div id="title">
        <FaSearch size="2em"/>
        <h2 id="tit_name">Movie-Rulz</h2>
        </div>
        <li className='links' onClick={(e)=>route('/')}>
            Home
        </li>

        <li className='links' onClick={(e)=>route('/watch_later')}>
            Watch later
        </li>

        <li className='links' onClick={(e)=>route('/recommend')}>
            Recommandation
        </li>

        <li className='links' onClick={(e)=>route('/login')}>
            Logout
        </li>

      
    </div>
    </>);
}

export default Header;