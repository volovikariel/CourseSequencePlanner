/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
import { setupNodegraph } from './nodegraph.js';

const programsByUniversityDatabase = {
  'Concordia University': new Set(['Computer Science']),
  'McGill University': new Set(['Computer Science', 'Software Engineering']),
};
const universityDatabase = {
  'Concordia University': {
    'Computer Science': {
      creditRequirements: {
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

export let currYear = 2022;
export let currTerm = 'fall';
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

function formatCourseInformation({ courseName, courseCode, information }) {
  return `
            <span><span class="title">Course Name: </span>${courseName}</span>
            <p><span class="title">Course Code:</span> ${courseCode}</p>
            <p>${information}</p>
    `;
}
function formatProgramInformation(university, program) {
  const { creditRequirements } = universityDatabase[university][program];
  const formattedCreditRequirements = Object.entries(creditRequirements).map(
    ([electiveName, { completed, need }]) => `
        <div>
            <p>${electiveName}:</p>
            <span style="padding-left:25%"><span style="color:green">Completed</span>/<span style="color:red">Need</span>: ${completed}/${need}</span>
        </div>
        `,
  );
  return `
        <span><span class="title">Program Name:</span> ${program}</span>
        <p><span class="title">Graduation Requirements</span></p>
        <div style="display: flex; flex-direction: column;">${formattedCreditRequirements.join('')}</div>
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
  document.getElementById('program-information-content').innerHTML = formatProgramInformation(student.university, student.program);
  document.getElementById('schedule-title').innerText = `${currYear} ${currTerm}`;
  // TODO: load schedule for currYear and currTerm
  setupNodegraph();
}
setup();

for (const term of ['summer', 'winter', 'fall']) {
  document.querySelector(`button#${term}`).addEventListener('click', () => {
    currTerm = term;
    document.getElementById('schedule-title').innerText = `${currYear} ${currTerm}`;
    // TODO: load schedule for currYear and currTerm
  });
}

document.getElementById('year-dropdown').addEventListener('change', (event) => {
  currYear = parseInt(event.target.value, 10);
  document.getElementById('schedule-title').innerText = `${currYear} ${currTerm}`;
  // TODO: load schedule for currYear and currTerm
});
