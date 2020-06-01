import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

function Student(props) {
    const [id, setID] = React.useState(props.id);
    const [studentName, setName] = React.useState(props.name);
    const [editing, setEditing] = React.useState(false);

    const edit = () => {
        if (editing)
            save();
        setEditing(!editing);

    }

    const save = () => {
        let newName = document.getElementById('textarea').value;
        setName(newName)
        props.updateName(newName, id);
    }

    const renderForm = () => {
        const content = (
            <div>
                <textarea defaultValue={studentName} className="note__textarea" id='textarea' style={{ width: '100px' }} />
                <Button className="note__save" variant='dark' onClick={() => edit()}> Save </Button>
            </div>
        );
        return content;
    }

    return (

        <Card style={{ width: '25rem' }}>
            <Card.Body>
                <Row>
                    {editing ? renderForm() : studentName}
                </Row>
                <Row>
                    {editing ? "" : <Button variant='warning' onClick={() => edit()} > Edit Student</Button>}
                </Row>
            </Card.Body>
        </Card>

    );
}
export default Student;