import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../Firebase';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Class from './Class';
import Teacher from './Teacher';
import Student from './Student';

class Dashboard extends Component {
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
            }
        })
    }

    updateTeacherName = (newName, id) => {
        const { teachers } = this.state;
        teachers.map(teacher => {
            if (teacher.id === id) {
                teacher.name = newName;
                this.props.firebase.teacher(teacher.id)
                    .update({ name: newName })
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
        this.props.firebase.classes().push({ name: 'Class', teacher: "NOT SET YET", amountOfStudents: 0, students: [] })
    }

    render() {
        return (
            <Row>
                <Col>
                    <Button variant='primary' onClick={() => this.addStudent()}>New Student</Button>
                    {this.state.students.map(student => <Student id={student.id} name={student.name} updateName={this.updateStudentName} />)}
                </Col>
                <Col>
                    <Button variant='primary' onClick={() => this.addTeacher()}>New Teacher</Button>
                    {this.state.teachers.map(teacher => <Teacher id={teacher.id} name={teacher.name} updateName={this.updateTeacherName} />)}
                </Col>
                <Col>
                    <Button variant='primary' onClick={() => this.addClass()}>New Class</Button>
                    {this.state.classes.map(room => <Class teachers={this.state.teachers} students={this.state.students}
                        name={room.name} studentsAssigned={room.students} teacherAssigned={room.teacher} id={room.id} studentCount={room.amountOfStudents} />)}
                </Col>
            </Row>
        );
    }
}

export default withFirebase(Dashboard);