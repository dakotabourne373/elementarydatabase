import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../style.css';
import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = ({ authUser, firebase }) => {
    const [display, setDisplay] = useState(<NavigationNonAuth />)
    const [user, setUser] = useState(authUser);

    const onAuthStateChanged = callback => {
        return firebase.auth.onAuthStateChanged(user => {
            if (user) {
                callback(user)
            } else {
                callback(user)
            }
        })
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(setUser);
        return () => {
            unsubscribe();
        }
    }, [])

    useEffect(() => {
        if (user) {
            firebase.user(user.uid).once('value')
                .then(snapshot => {
                    let userObject = snapshot.val();
                    if (userObject.role === 'admin') {
                        setDisplay(<AdminAuth />);
                    } else {
                        setDisplay(<TeacherAuth />);
                    }
                })
        } else {
            setDisplay(<NavigationNonAuth />);
        }
    }, [user]);

    return (
        <div>
            {display}
        </div>
    );
}

const AdminAuth = () => (
    <div>
        <ul>
            <SignOutButton />
            <li>
                <Link as={Button} to={ROUTES.HOME}>View Only</Link>
            </li>
            <li>
                <Link as={Button} to={ROUTES.ADMIN}>Admin View</Link>
            </li>
        </ul>
    </div>
);

const TeacherAuth = () => (
    <div>
        <ul>
            <SignOutButton />
            <li>
                <Link to={ROUTES.HOME}>Home!</Link>
            </li>
        </ul>
    </div>
);

const NavigationNonAuth = () => (
    <ul>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </ul>
);

export default withFirebase(Navigation);