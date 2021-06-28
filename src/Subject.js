import React, { useState, useEffect} from 'react';
import Select, { components } from "react-select";
const shortid = require('shortid');

const Subject = ({ name, points=null, handleGradeChange, grade }) => {

    const handleOnChange = (e) => {
        let grade = e.target.value;
        handleGradeChange(name, grade);
    };

    return (
        <div className='d-flex flex-row course-item' key={shortid.generate()}>
            <p className='m-0 subject-name'>{ name }</p>
            <div className='m-auto'>
                <select onChange={handleOnChange} value={grade}>
                    <option value={'Z'}>select grade</option>
                    <option value={'A'}>A</option>
                    <option value={'B'}>B</option>
                    <option value={'C'}>C</option>
                    <option value={'D'}>D</option>
                    <option value={'E'}>E</option>
                </select>
            </div>

            {!!points && <p className='m-0 mr-10 subject-points'>{`${points}`}</p> }
        </div>
    )
};

export default Subject
