import React from 'react';
import { Link } from 'react-router-dom';
import '../../style.css';
import Dashboard from '../Dashboard'

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = ({ authUser }) => (
    <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => (
    <div>
        <ul>
            <li>
                <SignOutButton />
            </li>
        </ul>
        <Dashboard />
    </div>
);

const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
);

export default Navigation;