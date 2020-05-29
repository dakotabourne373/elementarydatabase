import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Teacher(props) {
    const [id, setID] = React.useState(props.id);
    const [teacherName, setName] = React.useState(props.name);
    const [editing, setEditing] = React.useState(false);

    const edit = () => setEditing(!editing);

    const save = () => {
        let newName = document.getElementById('teacher').value;
        setName(newName)
        props.updateName(newName, id);
    }

    const renderForm = () => {
        const content = (
            <div>
                <textarea defaultValue={teacherName} className="note__textarea" onChange={() => save()} id='teacher' style={{ width: '100px' }} />
                <Button className="note__save" onClick={() => edit()}> Save </Button>
            </div>
        );
        return content;
    }

    return (

        <Card style={{ width: '10rem' }}>
            <Card.Body>
                {editing ? renderForm() : teacherName}
                {editing ? "" : <Button variant='warning' onClick={() => edit()}> Edit Teacher</Button>}
            </Card.Body>
        </Card>

    );
}
export default Teacher;