import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../Firebase';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Class from './Class';
import Teacher from './Teacher';
import Student from './Student';
import Container from 'react-bootstrap/Container';

class DashboardAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            classes: [],
            teachers: []
        }
    }

    componentDidMount = () => {
        this.props.firebase.students().on('value', snapshot => {
            const studentObject = snapshot.val();
            let studentList = [];
            for (let student in studentObject) {
                studentList.push({
                    id: student,
                    name: studentObject[student].name
                })
            }
            this.setState({ students: studentList });
        })
        this.props.firebase.teachers().on('value', snapshot => {
            const teacherObj = snapshot.val();
            let teacherList = [];
            for (let teacher in teacherObj) {
                teacherList.push({
                    id: teacher,
                    name: teacherObj[teacher].name
                })
            }
            this.setState({ teachers: teacherList });
        })
        this.props.firebase.classes().on('value', snapshot => {
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
            this.setState({ classes: classList });
        })
    }

    updateStudentName = (newName, id) => {
        const { students } = this.state;
        students.map(student => {
            if (student.id === id) {
                student.name = newName;
                this.props.firebase.student(student.id)
                    .update({ name: newName });
                this.state.classes.map(room => {
                    room.students.map(student => {
                        if (student.id === id) {
                            student.name = newName
                        }
                    })
                    this.props.firebase.class(room.id)
                        .update({ students: room.students })
                })
            }
        })
    }

    updateTeacherName = (newName, id) => {
        const { teachers } = this.state;
        teachers.map(teacher => {
            if (teacher.id === id) {
                teacher.name = newName;
                this.props.firebase.teacher(teacher.id)
                    .update({ name: newName, id: teacher.id })
                this.state.classes.map(room => {
                    if (teacher.id === room.teacher.id) {
                        this.setState(prevState => {
                            let index = prevState.classes.indexOf(room);
                            let update = prevState.classes[index];
                            console.log(update);
                            update.name = newName;
                            console.log(update);
                            prevState.classes.splice(index, 1);
                            return { classes: [...prevState.classes, update] };
                        });
                        this.props.firebase.class(room.id)
                            .update({ teacher: { name: newName, id: teacher.id } })
                    }
                })
            }
        })

    }

    addStudent = () => {
        this.props.firebase.students().push({ name: 'Student' });
    }

    addTeacher = () => {
        this.props.firebase.teachers().push({ name: 'Teacher' });
    }

    addClass = () => {
        this.props.firebase.classes().push({ name: 'Class', teacher: { name: "NOT SET YET", id: ' ' }, amountOfStudents: 0, students: [] })
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col className='text-center'>
                        <Button variant='primary' onClick={() => this.addStudent()}>New Student</Button>
                        {this.state.students.map(student => <Student id={student.id} name={student.name} updateName={this.updateStudentName} />)}
                    </Col>
                    <Col className='text-center'>
                        <Button variant='primary' onClick={() => this.addTeacher()}>New Teacher</Button>
                        {this.state.teachers.map(teacher => <Teacher id={teacher.id} name={teacher.name} updateName={this.updateTeacherName} />)}
                    </Col>
                    <Col xs={5}>
                        <Button variant='primary' onClick={() => this.addClass()}>New Class</Button>
                        {this.state.classes.map(room => <Class teachers={this.state.teachers} students={this.state.students}
                            name={room.name} studentsAssigned={room.students} teacherAssigned={room.teacher} id={room.id} studentCount={room.amountOfStudents}
                            firebase={this.props.firebase} />)}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withFirebase(DashboardAdmin);