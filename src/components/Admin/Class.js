import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { withFirebase } from '../Firebase';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import Col from 'react-bootstrap/Col';

const Class = (props) => {
    const [className, setName] = useState(props.name);
    const [editing, setEditing] = useState(false);
    const [studentCount, setAmount] = useState(props.studentCount);
    const [_students, setStudents] = useState((props.studentsAssigned ? props.studentsAssigned : []));
    const [_teacher, setTeacher] = useState(props.teacherAssigned);
    const [id] = useState(props.id);

    useEffect(() => {
        props.firebase.classes().on('value', snapshot => {
            let classes = snapshot.val();
            for (let room in classes) {
                if (room === id) {
                    setTeacher(classes[room].teacher);
                    setStudents(classes[room].students ? classes[room].students : []);
                    setAmount(classes[room].amountOfStudents);
                }
            }
        })
    }, [editing])

    const edit = () => setEditing(true);

    const saveClass = () => {
        let newName = document.getElementById('roomName').value;
        props.firebase.class(id)
            .update({
                name: newName,
            })
        return setName(newName);
    }

    const save = () => {
        setEditing(false);
        saveClass();
    }

    const handleTeacherSet = (e) => {
        let tid = e.value;
        if (tid === 0)
            return;

        props.teachers.map(teacher => {
            if (teacher.id === tid) {
                setTeacher(teacher);
                props.firebase.class(id)
                    .update({ teacher: { id: teacher.id, name: teacher.name } })
            }
        })
    }

    const handleAddToClass = (e) => {
        let sid = e.value;
        if (sid === 0)
            return;
        console.log(studentCount);

        props.students.map(student => {
            if (student.id === sid) {
                setStudents([..._students, student]);
                setAmount(studentCount + 1);
                props.firebase.class(id)
                    .update({
                        students: [..._students, student],
                        amountOfStudents: studentCount + 1
                    })
            }
        })
    }

    const renderEditForm = () => {
        let possibleStudents = []
        let teachers = []
        props.students.map(student => {
            if (!_students.includes(student)) {
                possibleStudents.push({ value: student.id, label: student.name });
            }
        })
        props.teachers.map(teacher => {
            teachers.push({ value: teacher.id, label: teacher.name });
        })

        return (
            <Card>
                <Accordion>
                    <Card.Header>
                        Change class name:
                        <textarea defaultValue={className} className="note__textarea" onChange={() => saveClass()} id='roomName' style={{ height: '25px', }} />
                        <Accordion.Toggle as={Button} variant='link' eventKey={id}>
                            with {studentCount} total students, the teacher is {_teacher.name}.
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={id}>
                        <Card.Body>
                            <Select options={teachers} onChange={event => handleTeacherSet(event)} placeholder='Select a teacher to set' value={0} />
                            {_students.map(student => <Col>{student.name}</Col>)}
                            <Select options={possibleStudents} onChange={(event) => handleAddToClass(event)} placeholder='Select a student to add' value={0} />
                            <Button variant='dark' onClick={() => save()} >Save Class!</Button>
                        </Card.Body>
                    </Accordion.Collapse>
                </Accordion>
            </Card >
        );
    }

    const renderNormalForm = () => {
        return (
            <Card>
                <Accordion>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant='link' eventKey={id}>
                            {className} with {studentCount} total students, the teacher is {_teacher.name}.
                    </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={id}>
                        <Card.Body>
                            {_students.map(student => <Col>{student.name}</Col>)}
                            <Button onClick={() => edit()} >Edit Class!</Button>
                        </Card.Body>
                    </Accordion.Collapse>
                </Accordion>
            </Card>
        );
    }


    return (
        <div>
            {editing ? renderEditForm() : renderNormalForm()}
        </div>
    );

}
export default withFirebase(Class);