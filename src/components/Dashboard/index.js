import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { withFirebase } from '../Firebase'

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            total: 0
        }
    }

    componentDidMount = () => {
        this.props.firebase.students().on('value', snapshot => {
            const studentObject = snapshot.val();

            // if (studentObject) {
            //     const studentList 
            // } else {
            //     this.setState({ students: null })
            // }
        })
    }

    componentWillUnmount = () => {
        this.props.firebase.students.push({
            students: this.state.students,
        });
        this.props.firebase.students.off();
    }

    edit = () => {
        this.setState({ editing: true });
    }
    save = () => {
        this.setState({ editing: false });
    }
    add = () => {
        let currentStudent = this.props.total;
        currentStudent++;

        this.setState(prevState => {
            return {
                students: [...prevState.students, <Student id={currentStudent} student={'Student'} />],
                total: currentStudent
            }
        })
    }

    render() {
        return (
            <div>
                <Button variant='primary' onClick={() => this.add()}>New Student</Button>
                {this.state.students.map(student => student)}
            </div>
        );
    }
}



function Student(props) {
    const [id, setID] = React.useState(props.id);
    const [student, setStudent] = React.useState(props.student);
    const [editing, setEditing] = React.useState(false);

    const edit = () => setEditing(!editing);

    const save = (e) => {
        setStudent(document.getElementById('textarea').value)
    }

    const renderForm = () => {
        const content = (
            <div>
                <textarea defaultValue={student} className="note__textarea" onChange={e => save(e)} id='textarea' />
                <Button className="note__save" onClick={() => edit()}> Save </Button>
            </div>
        );
        return content;
    }

    return (

        <Card style={{ width: '10rem' }}>
            <Card.Body>
                {editing ? renderForm() : student}
                {editing ? "" : <Button variant='warning' onClick={() => edit()} > Edit Student</Button>}
            </Card.Body>
        </Card>

    );
}

export default withFirebase(Dashboard);