import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sub_main.css';
import Header from '../base_components/header';
import { useLocation } from 'react-router-dom';
import Main from './single_card';

function Sub_main() {
    const location = useLocation();
    const state = location.state || {}; // provide an empty object as fallback
    const { category, brand } = state;

    // Optional: Handle case when state is missing
    if (!category || !brand) {
        return <div>Error: Missing category or brand</div>;
    }

    console.log(category, brand);

    return (
        <>
            <Header />
            <Main id={brand} />
        </>
    );
}

export default Sub_main;
