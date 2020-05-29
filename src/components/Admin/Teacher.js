import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

function Teacher(props) {
    const [id, setID] = React.useState(props.id);
    const [teacherName, setName] = React.useState(props.name);
    const [editing, setEditing] = React.useState(false);

    const edit = () => {
        if (editing)
            save();
        setEditing(!editing);

    }

    const save = () => {
        let newName = document.getElementById('teacher').value;
        setName(newName)
        props.updateName(newName, id);
    }

    const renderForm = () => {
        const content = (
            <div>
                <textarea defaultValue={teacherName} className="note__textarea" id='teacher' style={{ width: '100px' }} />
                <Button className="note__save" variant='dark' onClick={() => edit()}> Save </Button>
            </div>
        );
        return content;
    }

    return (

        <Card style={{ width: '25rem' }}>
            <Card.Body>
                <Row>
                    {editing ? renderForm() : teacherName}
                </Row>
                <Row>
                    {editing ? "" : <Button variant='warning' onClick={() => edit()}> Edit Teacher</Button>}
                </Row>
            </Card.Body>
        </Card>

    );
}
export default Teacher;