let selectedCourseId = null;
let selectedProgram = 'Computer Science'
const courseInformationByCourseId = {
    'COMP248': {
        'courseName': 'The Course Name',
        'courseCode': 'COMP248',
        'prereqs': [],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'COMP249': {
        'courseName': 'The Course Name',
        'courseCode': 'COMP249',
        'prereqs': ['COMP248'],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'COMP228': {
        'courseName': 'The Course Name',
        'courseCode': 'COMP228',
        'prereqs': ['COMP248'],
        'coreqs': ['NYC', 'NYA', 'CEGEP105', 'MATH204', 'CEGEP103', 'MATH203'],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'MATH203': {
        'courseName': 'The Course Name',
        'courseCode': 'MATH203',
        'prereqs': [],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'CEGEP103': {
        'courseName': 'The Course Name',
        'courseCode': 'CEGEP103',
        'prereqs': [],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'NYA': {
        'courseName': 'The Course Name',
        'courseCode': 'NYA',
        'prereqs': [],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'NYC': {
        'courseName': 'The Course Name',
        'courseCode': 'NYC',
        'prereqs': [],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'CEGEP105': {
        'courseName': 'The Course Name',
        'courseCode': 'CEGEP105',
        'prereqs': [],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'MATH204': {
        'courseName': 'The Course Name',
        'courseCode': 'MATH204',
        'prereqs': [],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    'COMP346': {
        'courseName': 'The Course Name',
        'courseCode': 'COMP346',
        'prereqs': ['COMP228'],
        'coreqs': [],
        'information': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
}

setup()

function setup() {
    document.getElementById('program-information-content').innerHTML = formatProgramInformation(getProgramInformation(selectedProgram))
    const circleRadius = Number(window.getComputedStyle(document.body).getPropertyValue('--circle-radius').trimStart().replace('px', ''))

    // Adding the nodes
    let xOffset = 0;
    let yOffset = 0;
    const rootElementBounds = document.getElementById('root-svg').getBoundingClientRect()
    for (let courseId of Object.keys(courseInformationByCourseId)) {
        addCourseNode(courseId, xOffset, yOffset)
        xOffset = Math.random() * (rootElementBounds.right - circleRadius * 2)
        yOffset = Math.random() * (rootElementBounds.bottom - circleRadius * 2)
    }

    // Adding the edges
    const prereqsByCourseId = Object.entries(courseInformationByCourseId).map(([courseId, { prereqs }]) => {
        return [courseId, prereqs]
    });
    const coreqsByCourseId = Object.entries(courseInformationByCourseId).map(([courseId, { coreqs }]) => {
        return [courseId, coreqs]
    });
    for (let [reqsByCourseId, isPrereq] of [[prereqsByCourseId, true], [coreqsByCourseId, false]]) {
        for (let [courseId, reqIds] of reqsByCourseId) {
            console.log(courseId, reqIds, isPrereq)
            const destinationBoundingRect = document.querySelector(`[course-id=${courseId}]`).getBoundingClientRect()
            const destinationCenterX = destinationBoundingRect.left + (destinationBoundingRect.right - destinationBoundingRect.left) / 2
            const destinationCenterY = destinationBoundingRect.top + (destinationBoundingRect.bottom - destinationBoundingRect.top) / 2
            for (let prereqId of reqIds) {
                const sourceBoundingRect = document.querySelector(`[course-id=${prereqId}]`).getBoundingClientRect()
                const sourceCenterX = sourceBoundingRect.left + (sourceBoundingRect.right - sourceBoundingRect.left) / 2
                const sourceCenterY = sourceBoundingRect.top + (sourceBoundingRect.bottom - sourceBoundingRect.top) / 2
                const distanceBetweenSourceAndDestination = Math.sqrt(Math.pow((destinationCenterX - sourceCenterX), 2) + Math.pow((destinationCenterY - sourceCenterY), 2))
                const d2 = distanceBetweenSourceAndDestination - circleRadius;
                const ratio = d2 / distanceBetweenSourceAndDestination
                const dx = (destinationCenterX - sourceCenterX) * ratio
                const dy = (destinationCenterY - sourceCenterY) * ratio
                const destX = sourceCenterX + dx
                const destY = sourceCenterY + dy
                const sourceX = destinationCenterX - dx
                const sourceY = destinationCenterY - dy
                addEdge(sourceX, sourceY, destX, destY, isPrereq)
            }
        }
    }

    // Adding even tlisteners
    document.querySelectorAll('.course-node').forEach(courseNode => {
        courseNode.addEventListener('click', clickCourse);
    })

    document.getElementById('root-svg').addEventListener('click', () => {
        setCourseSelected(selectedCourseId, false);
        selectedCourseId = null;
        setCourseInformation();
    })

}

// isPrereq = true: prereq
// isPrereq = false: coreq
function addEdge(fromX, fromY, toX, toY, isPrereq) {
    document.getElementById('root-svg').innerHTML +=
        `
        <svg>
            <defs>
            < <marker
            id="head"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
      
            </defs>

            <path
                id='arrow-line'
                marker-end='url(#head)'
                stroke-width='2'
                fill='none' stroke='black'  
                z="-1"
                ${isPrereq ? "" : 'stroke-dasharray="5"'}
                d='M${fromX},${fromY} ${toX},${toY}'
            />
        </svg>
    `
}

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
    if (typeof selectedCourseId == 'undefined' || selectedCourseId == null) {
        return;
    }
    const courseNode = document.querySelector(`[course-id=${selectedCourseId}]`)
    const courseCircle = courseNode.getElementById('circle')
    if (isSelected) {
        courseCircle.classList.add('selected')
    } else {
        courseCircle.classList.remove('selected')
    }
}

function setCourseInformation(courseInformation) {
    if (typeof courseInformation == 'undefined' || courseInformation == null) {
        document.getElementById('course-information-content').innerHTML = 'Click on a course to display its course information'
    } else {
        document.getElementById('course-information-content').innerHTML = formatCourseInformation(courseInformation)
    }
}

function getCourseInformation(courseId) {
    return courseInformationByCourseId[courseId]
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
        <p>Graduation Requirements</p>
        <div style="display: flex; flex-direction: column;">${formattedElectives.join('')}</div>
    `
}

function addCourseNode(courseId, xOffsetInPx = 0, yOffsetInPx = 0) {
    // All in pixels
    const circleRadius = window.getComputedStyle(document.body).getPropertyValue('--circle-radius').trimStart()
    document.getElementById('root-svg').innerHTML += `
        <svg 
            course-id="${courseId}" 
            class="course-node" 
            x="${xOffsetInPx}" 
            y="${yOffsetInPx}"
        >
            <!--The inside border of the circle (yes, kind of wacky, taken from https://stackoverflow.com/a/70013225)-->
            <defs>
                <clipPath id="clip-path">
                    <circle id="clip-path-circle"/>
                </clipPath>
            </defs>
            <circle id="circle"/>
            <!--Offset the text by the same amount that the circle radius, so as to have it centered-->
            <!-- NOTE: Can use foreign object instead of <text> (this'll allow us to place native HTML elements inside) -->
            <text class="course-text" x="${circleRadius}" y="${circleRadius}" text-anchor="middle"
                dominant-baseline="central">${courseId}</text>
        </svg>
    `
}

function removeCourseNode(courseId) {
    document.getElementById(courseId)?.remove()
}