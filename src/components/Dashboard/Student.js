import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Student(props) {
    const [id, setID] = React.useState(props.id);
    const [studentName, setName] = React.useState(props.name);
    const [editing, setEditing] = React.useState(false);

    const edit = () => setEditing(!editing);

    const save = () => {
        let newName = document.getElementById('textarea').value;
        setName(newName)
        props.updateName(newName, id);
    }

    const renderForm = () => {
        const content = (
            <div>
                <textarea defaultValue={studentName} className="note__textarea" onChange={() => save()} id='textarea' style={{ width: '100px' }} />
                <Button className="note__save" onClick={() => edit()}> Save </Button>
            </div>
        );
        return content;
    }

    return (

        <Card style={{ width: '10rem' }}>
            <Card.Body>
                {editing ? renderForm() : studentName}
                {editing ? "" : <Button variant='warning' onClick={() => edit()} > Edit Student</Button>}
            </Card.Body>
        </Card>

    );
}
export default Student;