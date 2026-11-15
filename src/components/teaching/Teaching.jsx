import React from 'react';
import Terminal from './Terminal';
import PageSection from '../PageSection';
import teaching from '../../info/teaching.json';
import Style from './Teaching.module.scss';

function CourseList({ courses }) {
    return (
        <ul className={Style.entries}>
            {courses.map(course => (
                <li key={`${course.period}-${course.title}-${course.program}`}>
                    <span className={Style.period}>{course.period}</span>
                    <div>
                        <strong>{course.title}</strong>{course.credits && ` (${course.credits} CFU)`}
                        {course.moduleOf && <span className={Style.detail}>Module in <em>{course.moduleOf}</em> ({course.integratedCredits} CFU for the integrated course).</span>}
                        <span className={Style.detail}>{course.program}</span>
                        {course.role && <span className={Style.detail}>{course.role} · {course.institution}</span>}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default function Teaching({ innerRef }) {
    return (
        <PageSection id="teaching" title="Teaching" innerRef={innerRef}>
            <Terminal text={
                <div className={Style.content}>
                    <p className={Style.intro}>{teaching.intro}</p>
                    <div className={Style.group}>
                        <h3 className={Style.heading}>Current Courses</h3>
                        <p>Course Instructor · {teaching.current.institution}</p>
                        <CourseList courses={teaching.current.courses} />
                        <details className={Style.disclosure}>
                            <summary>Previous Teaching Appointments</summary>
                            <CourseList courses={teaching.previous} />
                        </details>
                    </div>
                </div>
            } />
        </PageSection>
    );
}
