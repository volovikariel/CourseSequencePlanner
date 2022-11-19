/* eslint-disable no-prototype-builtins */
import { setupNodegraph } from './nodegraph.js';

const programsByUniversityDatabase = {
  'Concordia University': new Set(['Computer Science']),
  'McGill University': new Set(['Computer Science', 'Software Engineering']),
};
const universityDatabase = {
  'Concordia University': {
    'Computer Science': {
      requirement1: '',
      requirement2: '',
    },
  },
  'McGill University': {
    'Computer Science': {
      requirement1: '',
    },
    'Software Engineering': {
      requirement1: '',
    },
  },
};
export const currYear = 2022;
export const currTerm = 'fall';
class Student {
  constructor(
    university,
    program,
    completedCourses,
    desiredCourses = new Set(),
    otherRequirementCompletion = new Set(),
  ) {
    const universities = Object.keys(universityDatabase);
    if (!universities.includes(university)) throw new Error('invalid university passed in');
    this.university = university;

    const universityPrograms = programsByUniversityDatabase[university];
    if (!universityPrograms.has(program)) throw new Error('invalid program passed in');
    this.program = program;

    this.completedCourses = completedCourses;
    this.desiredCourses = desiredCourses;
    this.otherRequirementCompletion = otherRequirementCompletion;
  }

  addCourseToCompleted(course, year, term) {
    if (!this.completedCourses.hasOwnProperty(year)
    || !this.completedCourses[year].hasOwnProperty(term)) {
      this.completedCourses[year] = {
        [term]: new Set(),
      };
    }
    this.completedCourses[year][term].add(course);
  }

  removeCourseFromCompleted(course, year, term) {
    if (!this.completedCourses.hasOwnProperty(year)
    || !this.completedCourses[year].hasOwnProperty(term)) {
      throw new Error('Trying to remove course from year or term that doesn\'t exist for User');
    }
    this.completedCourses[year][term].remove(course);
  }

  addDesiredCourse(course) {
    this.desiredCourses.add(course);
    const courseNode = document.querySelector(`[course-id=${course}]`);
    const courseCircle = courseNode.querySelector('.circle');
    courseCircle.classList.add('desireable');
  }

  removeDesiredCourse(course) {
    this.desiredCourses.delete(course);
    const courseNode = document.querySelector(`[course-id=${course}]`);
    const courseCircle = courseNode.querySelector('.circle');
    courseCircle.classList.remove('desireable');
  }
}

function formatProgramInformation({
  'Program Name': programName,
  electives,
}) {
  const formattedElectives = Object.entries(electives).map(
    ([electiveName, { completed, need }]) => `
        <div>
            <p>${electiveName}:</p>
            <span style="padding-left:25%"><span style="color:green">Completed</span>/<span style="color:red">Need</span>: ${completed}/${need}</span>
        </div>
        `,
  );
  return `
        <span><span class="program">Program name:</span> ${programName}</span>
        <p><span class="graduation">Graduation Requirements</span></p>
        <div style="display: flex; flex-direction: column;">${formattedElectives.join('')}</div>
    `;
}

function getProgramInformation(program) {
  const programInformation = {
    'Computer Science': {
      'Program Name': 'Computer Science',
      electives: {
        'Computer science core': {
          completed: 0,
          need: 33,
        },
        'Complementary core': {
          completed: 0,
          need: 6,
        },
        'Computer science electives': {
          completed: 0,
          need: 18,
        },
        'Mathematics electives': {
          completed: 0,
          need: 6,
        },
        'Minor and general electives': {
          completed: 0,
          need: 27,
        },
      },
    },
  };
  return programInformation[program];
}

function formatCourseInformation({ courseName, courseCode, information }) {
  return `
            <span><span class="coursename">Course name:</span> ${courseName}</span>
            <p><span class="coursecode">Course Code:</span> ${courseCode}</p>
            <p>${information}</p>
    `;
}

export default function setCourseInformation(courseInformation) {
  if (typeof courseInformation === 'undefined' || courseInformation == null) {
    document.getElementById('course-information-content').innerHTML = 'Click on a course to display its course information';
  } else {
    document.getElementById('course-information-content').innerHTML = formatCourseInformation(courseInformation);
  }
}

const university = 'Concordia University';
const program = 'Computer Science';
export const student = new Student(
  university,
  program,
  undefined,
  new Set(['COMP249']),
);
function setup() {
  document.getElementById('program-information-content').innerHTML = formatProgramInformation(getProgramInformation(student.program));
  setupNodegraph();
}

setup();
