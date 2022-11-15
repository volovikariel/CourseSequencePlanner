import { setupNodegraph } from './nodegraph.js';

const universities = ['Concordia University', 'McGill University'];
const programsByUniversity = {
  'Concordia University': ['Computer Science'],
  'McGill University': ['Computer Science', 'Software Engineering'],
};
const requirementsByUniversityProgram = {
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
const courseSequenceState = {
  university: {
    universityName: undefined,
  },
  program: {
    programName: undefined,
    programRequirements: undefined,
  },
  userState: {
    externalRequirementsCompleted: undefined,
    termStates: {
      termA: {
        taken: true, // if true, then term has already passed, can't change past, else, can change
        courses: undefined,
      },
      termB: {
        taken: false,
        courses: undefined,
      },
    },
    // Ranked in ascending order
    rankedCourseDesireability: ['courseA', 'courseB'],
  },
};
const selectedProgram = 'Computer Science';

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

function setup() {
  document.getElementById('program-information-content').innerHTML = formatProgramInformation(getProgramInformation(selectedProgram));
  setupNodegraph();
}

setup();
