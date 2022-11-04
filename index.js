let selectedCourseId = null;
let selectedProgram = "Computer Science";
const courseInformationByCourseId = {
    'COMP248': {
        'courseName': 'The Course Name',
        'courseCode': 'COMP248',
        'prereqs': [],
        'coreqs': [],
        'xOffsetPercent': 0.65,
        'yOffsetPercent': 0.39,
        'information': 'Introduction to programming. Basic data types, variables, expressions, assignments, control flow. Classes, objects, methods. Information hiding, public vs. private visibility, data abstraction and encapsulation. References. Arrays.'
    },
    'COMP249': {
        'courseName': 'Object-Oriented Programming II',
        'courseCode': 'COMP249',
        'prereqs': ['COMP248'],
        'coreqs': [],
        'xOffsetPercent': 0.65,
        'yOffsetPercent': 0.25,
        'information': 'Design of classes. Inheritance. Polymorphism. Static and dynamic binding. Abstract classes. Exception handling. File I/O. Recursion. Interfaces and inner classes. Graphical user interfaces. Generics. Collections and iterators.'
    },
    'COMP228': {
        'courseName': 'The System Hardware',
        'courseCode': 'COMP228',
        'prereqs': ['COMP248'],
        'coreqs': ['NYC', 'NYA', 'CEGEP105', 'MATH204', 'CEGEP103', 'MATH203'],
        'xOffsetPercent': 0.10,
        'yOffsetPercent': 0.37,
        'information': 'Levels of system abstraction and von Neumann model. Basics of digital logic design. Data representation and manipulation. Instruction set architecture. Processor internals. Assembly language programming. Memory subsystem and cache management. I/O subsystem. Introduction to network organization and architecture.'
    },
    'MATH203': {
        'courseName': 'The Differential and Integral Calculus I',
        'courseCode': 'MATH203',
        'prereqs': [],
        'coreqs': [],
        'xOffsetPercent': 0.42,
        'yOffsetPercent': 0.77,
        'information': 'Functional notation. Differentiation of polynomials. The power, product, quotient, and chain rules. Differentiation of elementary functions. Implicit differentiation. Higher derivatives. Maxima and minima. Applications: tangents to plane curves, graphing, related rates. Approximations using the differential. Antiderivatives, definite integrals, area.'
    },
    'CEGEP103': {
        'courseName': 'CEGEP103',
        'courseCode': 'CEGEP103',
        'prereqs': [],
        'coreqs': [],
        'xOffsetPercent': 0.43,
        'yOffsetPercent': 0.12,
        'information': 'Calculus 1'
    },
    'NYA': {
        'courseName': 'Cegep Mathematics NYA',
        'courseCode': 'NYA',
        'prereqs': [],
        'coreqs': [],
        'xOffsetPercent': 0.52,
        'yOffsetPercent': 0.25,
        'information': 'Cegep Mathematics NYA'
    },
    'NYC': {
        'courseName': 'Cegep Mathematics NYC',
        'courseCode': 'NYC',
        'prereqs': [],
        'coreqs': [],
        'xOffsetPercent': 0.00,
        'yOffsetPercent': 0.26,
        'information': 'Cegep Mathematics NYC'
    },
    'CEGEP105': {
        'courseName': 'CEGEP105',
        'courseCode': 'CEGEP105',
        'prereqs': [],
        'coreqs': [],
        'xOffsetPercent': 0.61,
        'yOffsetPercent': 0.08,
        'information': 'Linear Algebra and Vector Geometry'
    },
    'MATH204': {
        'courseName': 'Vectors and Matrices',
        'courseCode': 'MATH204',
        'prereqs': [],
        'coreqs': [],
        'xOffsetPercent': 0.64,
        'yOffsetPercent': 0.52,
        'information': 'Algebra and geometry of vectors, dot and cross products, lines and planes. System of equations, operations on matrices, rank, inverse, quadratic form, and rotation of axes.'
    },
    'COMP346': {
        'courseName': 'The Operating Systems',
        'courseCode': 'COMP346',
        'prereqs': ['COMP228'],
        'coreqs': [],
        'xOffsetPercent': 0.00,
        'yOffsetPercent': 0.50,
        'information': 'Fundamentals of operating system functionalities, design and implementation. Multiprogramming: processes and threads, context switching, queuing models and scheduling. Interprocess communication and synchronization. Principles of concurrency. Synchronization primitives. Deadlock detection and recovery, prevention and avoidance schemes. Memory management. Device management. File systems. Protection models and schemes.'
    },
}

setup();

function setup() {
    document.getElementById("program-information-content").innerHTML =
        formatProgramInformation(getProgramInformation(selectedProgram));
    const circleRadius = Number(
        window
            .getComputedStyle(document.body)
            .getPropertyValue("--circle-radius")
            .trimStart()
            .replace("px", "")
    );

    // Adding the nodes
    const rootElementBounds = document.getElementById('root-svg').getBoundingClientRect()
    const rootElementWidth = rootElementBounds.width;
    const rootElementHeight = rootElementBounds.height;
    for (let [courseId, courseInformation] of Object.entries(courseInformationByCourseId)) {
        // The fixed position of every node is relative to the root window
        addCourseNode(courseId, courseInformation.xOffsetPercent * rootElementWidth, courseInformation.yOffsetPercent * rootElementHeight)
    }

    // Adding the edges
    const prereqsByCourseId = Object.entries(courseInformationByCourseId).map(
        ([courseId, { prereqs }]) => {
            return [courseId, prereqs];
        }
    );
    const coreqsByCourseId = Object.entries(courseInformationByCourseId).map(
        ([courseId, { coreqs }]) => {
            return [courseId, coreqs];
        }
    );
    for (let [reqsByCourseId, isPrereq] of [
        [prereqsByCourseId, true],
        [coreqsByCourseId, false],
    ]) {
        for (let [courseId, reqIds] of reqsByCourseId) {
            const destinationBoundingRect = document
                .querySelector(`[course-id=${courseId}]`)
                .getBoundingClientRect();
            const destinationCenterX =
                destinationBoundingRect.left +
                (destinationBoundingRect.right - destinationBoundingRect.left) / 2;
            const destinationCenterY =
                destinationBoundingRect.top +
                (destinationBoundingRect.bottom - destinationBoundingRect.top) / 2;
            for (let prereqId of reqIds) {
                const sourceBoundingRect = document
                    .querySelector(`[course-id=${prereqId}]`)
                    .getBoundingClientRect();
                const sourceCenterX =
                    sourceBoundingRect.left +
                    (sourceBoundingRect.right - sourceBoundingRect.left) / 2;
                const sourceCenterY =
                    sourceBoundingRect.top +
                    (sourceBoundingRect.bottom - sourceBoundingRect.top) / 2;
                const distanceBetweenSourceAndDestination = Math.sqrt(
                    Math.pow(destinationCenterX - sourceCenterX, 2) +
                    Math.pow(destinationCenterY - sourceCenterY, 2)
                );
                const d2 = distanceBetweenSourceAndDestination - circleRadius;
                const ratio = d2 / distanceBetweenSourceAndDestination;
                const dx = (destinationCenterX - sourceCenterX) * ratio;
                const dy = (destinationCenterY - sourceCenterY) * ratio;
                const destX = sourceCenterX + dx;
                const destY = sourceCenterY + dy;
                const sourceX = destinationCenterX - dx;
                const sourceY = destinationCenterY - dy;
                addEdge(sourceX, sourceY, destX, destY, isPrereq);
            }
        }
    }

    // Adding even tlisteners
    document.querySelectorAll(".course-node").forEach((courseNode) => {
        courseNode.addEventListener("click", clickCourse);
    });

    document.getElementById("root-svg").addEventListener("click", () => {
        setCourseSelected(selectedCourseId, false);
        selectedCourseId = null;
        setCourseInformation();
    });
}

// isPrereq = true: prereq
// isPrereq = false: coreq
function addEdge(fromX, fromY, toX, toY, isPrereq) {
    document.getElementById("root-svg").innerHTML += `
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
    const {
        target: { parentElement: courseNode },
    } = event;
    selectedCourseId = courseNode.getAttribute("course-id");
    setCourseSelected(selectedCourseId, true);
    setCourseInformation(getCourseInformation(selectedCourseId));
    event.stopPropagation();
}

function setCourseSelected(selectedCourseId, isSelected) {
    if (typeof selectedCourseId == "undefined" || selectedCourseId == null) {
        return;
    }
    const courseNode = document.querySelector(`[course-id=${selectedCourseId}]`);
    const courseCircle = courseNode.getElementById("circle");
    if (isSelected) {
        courseCircle.classList.add("selected");
    } else {
        courseCircle.classList.remove("selected");
    }
}

function setCourseInformation(courseInformation) {
    if (typeof courseInformation == "undefined" || courseInformation == null) {
        document.getElementById("course-information-content").innerHTML =
            "Click on a course to display its course information";
    } else {
        document.getElementById("course-information-content").innerHTML =
            formatCourseInformation(courseInformation);
    }
}

function getCourseInformation(courseId) {
    return courseInformationByCourseId[courseId];
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
        "Computer Science": {
            "Program Name": "Computer Science",
            electives: {
                "Computer science core": {
                    completed: 0,
                    need: 33,
                },
                "Complementary core": {
                    completed: 0,
                    need: 6,
                },
                "Computer science electives": {
                    completed: 0,
                    need: 18,
                },
                "Mathematics electives": {
                    completed: 0,
                    need: 6,
                },
                "Minor and general electives": {
                    completed: 0,
                    need: 27,
                },
            },
        },
    };
    return programInformation[program];
}

function formatProgramInformation({
    ["Program Name"]: programName,
    electives,
}) {
    const formattedElectives = Object.entries(electives).map(
        ([electiveName, { completed, need }]) => {
            return `
        <div>
            <p>${electiveName}:</p>
            <span style="padding-left:25%"><span style="color:green">Completed</span>/<span style="color:red">Need</span>: ${completed}/${need}</span>
        </div>
        `;
        }
    );
    return `
        <span>Program name: ${programName}</span>
        <p>Graduation Requirements</p>
        <div style="display: flex; flex-direction: column;">${formattedElectives.join(
        ""
    )}</div>
    `;
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
    document.getElementById(courseId)?.remove();
}
