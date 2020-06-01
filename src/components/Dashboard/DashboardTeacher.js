import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../Firebase';

const DashboardTeacher = props => {
    const [students, setStudents] = useState([])
    const [teachers, setTeachers] = useState([])
    const [classes, setClasses] = useState([])

    useEffect(() => {
        props.firebase.students().on('value', snapshot => {
            const studentObject = snapshot.val();
            let studentList = [];
            for (let student in studentObject) {
                studentList.push({
                    id: student,
                    name: studentObject[student].name
                })
            }
            setStudents(studentList);
        })
        props.firebase.teachers().on('value', snapshot => {
            const teacherObj = snapshot.val();
            let teacherList = [];
            for (let teacher in teacherObj) {
                teacherList.push({
                    id: teacher,
                    name: teacherObj[teacher].name
                })
            }
            setTeachers(teacherList);
        })
        props.firebase.classes().on('value', snapshot => {
            const classes = snapshot.val();
            let classList = [];
            for (let room in classes) {
                classList.push({
                    id: room,
                    name: classes[room].name,
                    amountOfStudents: classes[room].amountOfStudents,
                    students: (classes[room].students ? classes[room].students : []),
                    teacher: classes[room].teacher
                })
            }
            setClasses(classList);
        })
    }, [props.firebase]);

    return (
        <Container>
            <Row>
                <Col>
                    {students.map(student => {
                        return (
                            <Card style={{ width: '10rem' }}>
                                <Card.Body>
                                    Student: {student.name}
                                </Card.Body>
                            </Card>
                        );
                    })}
                </Col>
                <Col>
                    {teachers.map(teacher => {
                        return (
                            <Card style={{ width: '10rem' }}>
                                <Card.Body>
                                    Teacher: {teacher.name}
                                </Card.Body>
                            </Card>
                        );
                    })}
                </Col>
                <Col >
                    {classes.map(room => {
                        return (
                            <Card>
                                <Accordion>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant='link' eventKey={room.index}>
                                            {room.name} with {room.amountOfStudents} total students, the teacher is {room.teacher.name}.
                                </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={room.index}>
                                        <Card.Body>
                                            {room.students.map(student => <Col>{student.name}</Col>)}
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Accordion>
                            </Card>
                        );
                    })}
                </Col>
            </Row>
        </Container>
    );
}
export default withFirebase(DashboardTeacher);