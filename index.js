/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
import { setupNodegraph, courseInformationByCourseId } from './nodegraph.js';
import {
  getCourseSchedule, intersectSchedules, isCourseOffered, renderCourseSchedule,
} from './schedule.js';

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
      courses: ['COMP248', 'COMP249'],
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
    futureCourses = {},
    desiredCourses = new Set(),
    otherRequirementCompletion = new Set(),
  ) {
    const universities = Object.keys(universityDatabase);
    if (!universities.includes(university)) throw new Error('invalid university passed in');
    this.university = university;

    const universityPrograms = new Set(Object.keys(universityDatabase[university]));
    if (!universityPrograms.has(program)) throw new Error('invalid program passed in');
    this.program = program;

    this.futureCourses = futureCourses;
    this.desiredCourses = desiredCourses;
    this.otherRequirementCompletion = otherRequirementCompletion;
    this.schedules = [];
  }

  setSchedules(schedules) {
    this.schedules = schedules;
    renderCourseSchedule(this.schedules, Array.from(this.futureCourses[currYear][currTerm]));
  }

  isCourseReqForFutureCourses(course) {
    // Courses that depend on this course
    const dependantCourses = [];
    Object.entries(courseInformationByCourseId).forEach(([courseId, courseInfo]) => {
      if (courseInfo.prereqs.concat(courseInfo.coreqs).includes(course)) {
        dependantCourses.push(courseId);
      }
    });

    for (const dependantcourse of dependantCourses) {
      if (this.futureCourses[currYear][currTerm].has(dependantcourse)) {
        return true;
      }
    }

    return false;
  }

  haveCourseRequisitesForCourse(course, yearUpperBound, termUpperBound) {
    const termIndexByTerm = {
      winter: 0,
      summer: 1,
      fall: 2,
    };
    // All completed courses by year/term
    const completedCourses = new Set();

    let passedUpperBounds = false;
    for (const year of Object.keys(this.futureCourses)) {
      if (year > yearUpperBound || passedUpperBounds) break;
      for (const term of Object.keys(this.futureCourses[year])) {
        // We don't want to take into account courses taken THIS semester for the prerequisites
        // So we don't even want to be on the upperbound
        // e.g: if we curr term is w22, then we will markall courses taken BEFORE w22 as completed
        if (year === yearUpperBound && termIndexByTerm[term] >= termIndexByTerm[termUpperBound]) {
          passedUpperBounds = true;
          break;
        }
        for (const completedCourse of this.futureCourses[year][term]) {
          completedCourses.add(completedCourse);
        }
      }
    }

    const coursePrerequisites = courseInformationByCourseId[course].prereqs;
    for (const coursePrerequisite of coursePrerequisites) {
      if (!completedCourses.has(coursePrerequisite)) {
        return false;
      }
    }

    const courseCorequisites = courseInformationByCourseId[course].coreqs;
    for (const courseCorequisite of courseCorequisites) {
      if (!completedCourses.has(courseCorequisite)
      // Also take into account the year/term of addition
      && !this.futureCourses[yearUpperBound][termUpperBound].has(courseCorequisite)) {
        return false;
      }
    }

    return true;
  }

  addCourseToFuture(course, year, term) {
    if (!Object.hasOwn(this.futureCourses, year)
    || !Object.hasOwn(this.futureCourses[year], term)) {
      this.futureCourses[year] = {
        [term]: new Set(),
      };
    }

    if (!isCourseOffered(course, year, term)) {
      throw new Error(`${course} is not offered during ${year} ${term}`);
    }
    if (!this.haveCourseRequisitesForCourse(course, year, term)) {
      throw new Error(`You don't have the (pre/co)requisites for course ${course} during ${year} ${term}`);
    }
    const validSchedules = intersectSchedules(
      this.schedules,
      getCourseSchedule(course, currYear, currTerm),
    );
    if (validSchedules.length === 0) {
      throw new Error(`${course} clashes with your current schedule`);
    }
    this.futureCourses[year][term].add(course);
    document.querySelector(`[course-id=${course}] .circle`).classList.add('future');
    this.setSchedules(validSchedules);
  }

  removeCourseFromFuture(removedCourse, year, term) {
    if (!Object.hasOwn(this.futureCourses, year)
    || !Object.hasOwn(this.futureCourses[year], term)) {
      throw new Error('Trying to remove course from year or term that doesn\'t exist for User');
    }
    if (this.isCourseReqForFutureCourses(removedCourse)) {
      throw new Error('Trying to remove course which serves as a necessary prereq/coreq for other courses');
    }
    this.futureCourses[year][term].delete(removedCourse);
    document.querySelector(`[course-id=${removedCourse}] .circle`).classList.remove('future');

    // Find which courses are still present
    const courses = Array.from(this.futureCourses[year][term]);
    // Fetch the schedules of these courses
    const schedules = courses.map((course) => getCourseSchedule(course, year, term));
    // Intersect all of them to create all the valid schedules
    const validSchedules = schedules
      .reduce((scheduleA, scheduleB) => intersectSchedules(scheduleA, scheduleB), []);
    this.setSchedules(validSchedules);
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
  setupNodegraph();
}

setup();
