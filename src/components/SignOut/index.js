import React from 'react';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
    <Button variant="danger" onClick={firebase.doSignOut}>
        Sign Out
    </Button>
);

export default withFirebase(SignOutButton);