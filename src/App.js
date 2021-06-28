import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef} from 'react';
import Select from "react-select";
import { useOnClickOutside } from "./hooks";
import { Drawer, Modal } from '@material-ui/core';

import Subject from './Subject';
import hamburgerMenuIcon from './assets/hamburger-thin-32px.png';
import gradHat from './assets/gradHat.png';

const CERTIFICATES = [
  { value: 'EGCSE', label: 'EGCSE' },
  { value: 'IGCSE', label: 'IGCSE' },
  { value: 'Matric HG', label: 'Matric HG' },
  { value: 'Matric SG', label: 'Matric SG' },
  { value: 'IEB', label: 'IEB' },
  { value: 'AS-Level', label: 'AS-Level' },
  { value: 'A-LEVEL', label: 'A-LEVEL' },
]

const COURSE_LIST = [
    {
        name: 'Associate Degree in Hotel Management',
        institution: 'Limkokwing',
        cutOff: 20,
    },
    {
        name: 'Associate Degree in Information Technology',
        institution: 'Limkokwing',
        cutOff: 20,
    },
    {
        name: 'Diploma in Business Finance and Accounting',
        institution: 'Gwamile Voctim',
        cutOff: 18,
    },
    {
        name: 'Diploma in Mechanical and Manufacturing Engineering',
        institution: 'Gwamile Voctim',
        cutOff: 18,
    },
    {
        name: 'Advanced Diploma in Multimedia',
        institution: 'RSTP - Advanced School of Information Technology',
        cutOff: 20,
    },
    {
        name: 'Advanced Diploma in Software Engineering',
        institution: 'RSTP - Advanced School of Information Technology',
        cutOff: 20,
    },
    {
        name: 'Primary Teachers Diploma',
        institution: 'Ngwane Teachers College',
        cutOff: 24,
    },
    {
        name: 'National Diploma in Mechanical Engineering',
        institution: 'Eswatini College of Technology',
        cutOff: 29,
    },
    {
        name: 'Diploma in Human Resources Management ',
        institution: 'Eswatini College of Technology',
        cutOff: 0,
    },
]

const INSTITUTIONS = function(){
    let defaultVal = { value: null, label: "All Schools" }
    let courseMap = COURSE_LIST.map((item)=>{
        return {value: item.institution, label: item.institution}
    })

    courseMap.unshift(defaultVal)

    return courseMap;
}();


const SUBJECTS = [
    'Accounting',
    'Additional Mathematics',
    'Agriculture',
    'Biology',
    'Business Studies',
    'Design And Technology',
    'Economics',
    'English Language',
    'Fashion And Fabrics',
    'First Language Siswati',
    'Food And Nutrition',
    'French',
    'Geography',
    'Hstory',
];

const gradeToPoints = {
    'A': 10,
    'B': 9,
    'C': 8,
    'D': 7,
    'E': 6,
    'Z': 0,
};

const initialSubjectValues = {
    'Accounting': null,
    'Agriculture': null,
    'Mathematics': null,
};

function App() {
    const [cert, setCert] = useState(null);
    const [institution, setInstitution] = useState(null);
    const [totalPoints, setTotalPoints] = useState(null);
    const [subjectPoints, setSubjectPoints] = useState({});
    const [studentSubjects, setStudentSubjects] = useState(initialSubjectValues);
    const [filteredCourses, setFilteredCourses] = useState([])

    const [open, setOpen] = useState(false);
    const [modalState, setModalState] = useState(false);

    const node = useRef();
    const menuId = "main-menu";

    useEffect(()=>{
        if(cert){
            console.log('new cert: ', cert);
        }
    }, [cert])

    useEffect(()=>{
        if(!!institution){
            filterCoursesByInstitution(institution)

        } else if(!!totalPoints) {
            filterCoursesByPoints(totalPoints)
        }
    }, [institution])

    useEffect(()=>{
        if(!!totalPoints && !!institution){
            filterCoursesByInstitution(institution);

        } else if (!!totalPoints ) {
            filterCoursesByPoints(totalPoints);
        }
    }, [totalPoints])

    useEffect(()=>{
        calcTotal()
    }, [studentSubjects])



    const handleCertSelect = (input) => {
        setCert(input.value);
    };

    const handleInstituteSelect = (input) => {
        setInstitution(input.value);
    };

    const calcTotal = () => {
        let keys = Object.keys(studentSubjects);

        let calc = keys.map((key)=> {
            if(!!studentSubjects[key]){
                return studentSubjects[key].points
            }
            return 0
        }).reduce((a, b) => a + b, 0)

        setTotalPoints(calc);
        return calc
    }

    const filterCoursesByPoints = (points) => {
        let filtered = COURSE_LIST.filter((course)=>{
            return points >= course.cutOff;
        });

        setFilteredCourses(filtered);
    }

    const filterCoursesByInstitution = (institution) => {
        let filtered = COURSE_LIST.filter((course)=>{
            return (course.institution == institution && totalPoints >= course.cutOff);
        });

        setFilteredCourses(filtered);
    }

    const handleGradeChange = (name, grade) => {
        let points = gradeToPoints[grade];
        let obj = {}
        obj[name] = {grade, points}
        Object.assign(studentSubjects, obj)
        let newObj = Object.assign({}, studentSubjects)
        setStudentSubjects(newObj);
    }

    const SubjectList = ({ subjects }) => {
        let list = subjects.map((subject, index) => <Subject
            name={subject}
            key={index}
            handleGradeChange={handleGradeChange}
            points={!!studentSubjects[subject] && studentSubjects[subject].points}
            grade={!!studentSubjects[subject] && studentSubjects[subject].grade}
        />);

        return (
            <>{ list }</>
        )
    };

    const CourseList = ({ courses }) => {
        let list = courses.map((course, index)=>{
            return (
                <div>
                    <div className='d-flex flex-row course-result-item'>
                        <p className='m-0 course-name'>{course.name}</p>
                        <p className='m-0 course-school'>{course.institution}</p>
                    </div>
                    <hr></hr>
                </div>
            )
        });

        return <>{ list }</>
    }

    return (
        <div className="App d-flex flex-column">
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>
                <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
            </head>

            <header className="App-header d-flex flex-row">
                <img src={gradHat} style={{marginRight:10}} className='mt-auto mb-auto'/>
                <p className='sasa-header-logo mt-auto mb-auto'>SaSa</p>

                <div className='d-none d-md-flex flex-row'>
                    <div className='left-links d-flex flex-row'>
                        <p className='left-link App-link mt-auto mb-auto'>
                            <a href='https://applysasa.io/browse_institutions'>school search</a>
                        </p>
                        <p className='left-link App-link mt-auto mb-auto'>
                            <a href='https://applysasa.io'>course matcher</a>
                        </p>
                    </div>

                    <div className='right right-links d-flex flex-row'>
                        <p className='right-link App-link mt-auto mb-auto'>
                            <a href='https://applysasa.io'>login</a>
                        </p>
                        <p className='right-link App-link mt-auto mb-auto'>
                            <a href='https://applysasa.io'>sign up</a>
                        </p>
                    </div>
                </div>

                <p className='left-link App-link mt-auto mb-auto d-flex d-md-none'>course matcher</p>

                <div className='d-flex d-md-none align-items-center'>
                        <img src={hamburgerMenuIcon} className='right hamburger' onClick={()=>setOpen(true)}/>

                        <Drawer anchor={'right'} open={open} onClose={()=>setOpen(false)}>
                            <ul className='nav-menu'>
                                <li><a href='https://applysasa.io/' target='_blank'>home</a></li>
                                <li><a href='https://applysasa.io/browse_institutions' target='_blank'>school search</a></li>
                                <li><a href='https://applysasa.io/' target='_blank'>login</a></li>
                                <li><a href='https://applysasa.io/' target='_blank'>sign up</a></li>
                            </ul>
                        </Drawer>
                </div>
            </header>

            <main className='col-xs-12 col-sm-10 m-auto'>
                <section className='intro d-flex flex-row'>
                    <div className='intro-copy'>
                        <p className='mb-0 pb-0 text-start'>Welcome to,</p>
                        <p className='mt-0 pt-0 text-start'>Course Matcher </p>
                        <p className='into-subcopy text-start ml-20'>Enter your grades to see which courses you match with</p>
                    </div>

                    <div className='d-none d-md-block right right-intro'>
                        <button className='button apply-button'>
                            <a href='https://applysasa.io/'>Apply To Matches</a>
                        </button>
                    </div>
                </section>

                <section className='d-flex flex-row table-header'>
                    <div className='left-table-header d-flex flex-row flex-md-column flex-lg-row'>
                        <p className='cert-title mt-auto mb-auto'>HIGH SCHOOL CERTIFICATE</p>
                        <div className='cert-options'>
                            <Select
                                plaholder= {'choose'}
                                options={CERTIFICATES}
                                className='cert-select'
                                onChange={(e)=>handleCertSelect(e)}
                            />
                        </div>
                    </div>
                    <div className='right right-table-header flex-column flex-lg-row d-none d-md-flex'>
                        <p className='inst-title bold mt-auto mb-auto'>FIND BY INSTITUTION</p>
                        <div className='cert-options'>
                            <Select
                                plaholder= {'choose'}
                                options={INSTITUTIONS}
                                className='inst-select'
                                onChange={(e)=>handleInstituteSelect(e)}
                            />
                        </div>
                    </div>
                </section>

                <hr className='table-divider'/>

                <section className='d-flex flex-row table-content'>
                    <div className='col-12 col-md-5 m-0 p-0 course-selection mr-auto'>
                        <div className='course-header d-flex flex-row'>
                            <p className='m-0 caps bold'>subjects</p>
                            <p className='right caps bold'>total points<span className='total-points'>{totalPoints}</span></p>
                        </div>
                        <div className='courses-list'>
                            { <SubjectList  subjects={SUBJECTS}/> }
                        </div>
                    </div>

                    <div className='d-none d-md-block col-5 m-0 p-0 course-result'>
                        <div className='course-header d-flex flex-row'>
                            <p className='caps bold'>courses</p>
                            <p className='right caps bold'>schools</p>
                        </div>
                        <div className='course-result-list'>
                            <CourseList courses={filteredCourses}/>
                        </div>
                    </div>
                </section>
            </main>

            <footer className='d-flex d-md-none footer'>
                <button className='button matches-button' onClick={()=>setModalState(true)}>view {filteredCourses.length > 0 ? filteredCourses.length: null} matches</button>
            </footer>

            <Modal open={modalState}>
                <div className='d-flex flex-column course-modal'>
                    <div className='inner-modal'>
                        <div className='d-flex flex-row align-items-center' style={{marginTop:10}}>
                            <b>Course Mathches</b>
                            <button className='right button modal-apply-button'>
                                <a href='https://applysasa.io/' target='_blank'>apply now</a>
                                </button>
                        </div>
                        <hr style={{marginTop: 30}}></hr>
                        <div className='modal-course-list'>
                            <CourseList courses={filteredCourses}/>
                        </div>
                    </div>
                    <button className='button modal-button' onClick={()=>setModalState(false)}>
                        <p className='p-10'>close</p>
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default App;
