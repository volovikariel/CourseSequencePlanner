let selectedCourseId = null;
let selectedProgram = 'Computer Science'

document.getElementById('program-information-content').innerHTML = formatProgramInformation(getProgramInformation(selectedProgram))

document.querySelectorAll('.course-node').forEach(courseNode => {
    courseNode.addEventListener('click', clickCourse);
})

document.getElementById('root-svg').addEventListener('click', () => {
    setCourseSelected(selectedCourseId, false);
    selectedCourseId = null;
    setCourseInformation();
})

function clickCourse(event) {
    // Clearing previous one
    if (selectedCourseId) {
        setCourseSelected(selectedCourseId, false);
    }
    const { target: { parentElement: courseNode } } = event
    selectedCourseId = courseNode.getAttribute('course-id');
    setCourseSelected(selectedCourseId, true);
    setCourseInformation(getCourseInformation(selectedCourseId));
    event.stopPropagation()
}

function setCourseSelected(selectedCourseId, isSelected) {
    const courseNode = document.querySelector(`[course-id=${selectedCourseId}]`)
    const courseCircle = courseNode.querySelector('circle')
    if (isSelected) {
        courseCircle.classList.add('selected')
    } else {
        courseCircle.classList.remove('selected')
    }
}

function setCourseInformation(courseInformation) {
    if (typeof courseInformation == 'undefined' || courseInformation == null) {
        document.getElementById('course-information-content').innerHTML = ''
    } else {
        document.getElementById('course-information-content').innerHTML = formatCourseInformation(courseInformation)
    }
}

function getCourseInformation(courseId) {
    const courseInformation = {
        'COMP233': {
            'courseName': 'The Course Name',
            'courseCode': 'COMP233',
            'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
        },
        'COMP234': {
            'courseName': 'The Course Name',
            'courseCode': 'COMP234',
            'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
        }
    }
    return courseInformation[courseId]
}

function formatCourseInformation({ courseName, courseCode, information }) {
    return `
            <span>Course name: ${courseName}</span>
            <p>Course Code: ${courseCode}</p>
            <p>${information}</p>
        `
}



function getProgramInformation(program) {
    const programInformation = {
        'Computer Science': {
            'Program Name': 'Computer Science',
            'electives': {
                'Computer science core': {
                    'completed': 0,
                    'need': 33
                },
                'Complementary core': {
                    'completed': 0,
                    'need': 6
                },
                'Computer science electives': {
                    'completed': 0,
                    'need': 18
                },
                'Mathematics electives': {
                    'completed': 0,
                    'need': 6
                },
                'Minor and general electives': {
                    'completed': 0,
                    'need': 27
                }
            }
        }
    }
    return programInformation[program];
}

function formatProgramInformation({ ['Program Name']: programName, electives }) {
    const formattedElectives = Object.entries(electives).map(([electiveName, { completed, need }]) => {
        return `
        <div>
            <p>${electiveName}:</p>
            <span style="padding-left:25%"><span style="color:green">Completed</span>/<span style="color:red">Need</span>: ${completed}/${need}</span>
        </div>
        `
    })
    return `
        <span>Program name: ${programName}</span>
        <div style="display: flex; flex-direction: column;">${formattedElectives.join('')}</div>
    `
}