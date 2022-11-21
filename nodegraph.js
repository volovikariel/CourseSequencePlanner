import setCourseInformation, { student } from './index.js';

export const circleRadius = Number(
  window
    .getComputedStyle(document.body)
    .getPropertyValue('--circle-radius')
    .trimStart()
    .replace('px', ''),
);
const svg = document.getElementById('root-svg');
const viewBox = svg.viewBox.baseVal;
let isPointerDown = false;
let pointerOrigin;

let selectedCourseId = null;

const mouseButtonByType = {
  1: 'left',
  2: 'middle',
  3: 'right',
};

// TODO: courses by university program
const courseInformationByCourseId = {
  COMP248: {
    courseName: 'The Course Name',
    courseCode: 'COMP248',
    prereqs: [],
    coreqs: [],
    xOffsetPercent: 0.65,
    yOffsetPercent: 0.39,
    information: 'Introduction to programming. Basic data types, variables, expressions, assignments, control flow. Classes, objects, methods. Information hiding, public vs. private visibility, data abstraction and encapsulation. References. Arrays.',
  },
  COMP249: {
    courseName: 'Object-Oriented Programming II',
    courseCode: 'COMP249',
    prereqs: ['COMP248'],
    coreqs: [],
    xOffsetPercent: 0.65,
    yOffsetPercent: 0.25,
    information: 'Design of classes. Inheritance. Polymorphism. Static and dynamic binding. Abstract classes. Exception handling. File I/O. Recursion. Interfaces and inner classes. Graphical user interfaces. Generics. Collections and iterators.',
  },
  COMP228: {
    courseName: 'The System Hardware',
    courseCode: 'COMP228',
    prereqs: ['COMP248'],
    coreqs: ['NYC', 'NYA', 'CEGEP105', 'MATH204', 'CEGEP103', 'MATH203'],
    xOffsetPercent: 0.10,
    yOffsetPercent: 0.37,
    information: 'Levels of system abstraction and von Neumann model. Basics of digital logic design. Data representation and manipulation. Instruction set architecture. Processor internals. Assembly language programming. Memory subsystem and cache management. I/O subsystem. Introduction to network organization and architecture.',
  },
  MATH203: {
    courseName: 'The Differential and Integral Calculus I',
    courseCode: 'MATH203',
    prereqs: [],
    coreqs: [],
    xOffsetPercent: 0.42,
    yOffsetPercent: 0.77,
    information: 'Functional notation. Differentiation of polynomials. The power, product, quotient, and chain rules. Differentiation of elementary functions. Implicit differentiation. Higher derivatives. Maxima and minima. Applications: tangents to plane curves, graphing, related rates. Approximations using the differential. Antiderivatives, definite integrals, area.',
  },
  CEGEP103: {
    courseName: 'CEGEP103',
    courseCode: 'CEGEP103',
    prereqs: [],
    coreqs: [],
    xOffsetPercent: 0.43,
    yOffsetPercent: 0.12,
    information: 'Calculus 1',
  },
  NYA: {
    courseName: 'Cegep Mathematics NYA',
    courseCode: 'NYA',
    prereqs: [],
    coreqs: [],
    xOffsetPercent: 0.52,
    yOffsetPercent: 0.25,
    information: 'Cegep Mathematics NYA',
  },
  NYC: {
    courseName: 'Cegep Mathematics NYC',
    courseCode: 'NYC',
    prereqs: [],
    coreqs: [],
    xOffsetPercent: 0.00,
    yOffsetPercent: 0.26,
    information: 'Cegep Mathematics NYC',
  },
  CEGEP105: {
    courseName: 'CEGEP105',
    courseCode: 'CEGEP105',
    prereqs: [],
    coreqs: [],
    xOffsetPercent: 0.61,
    yOffsetPercent: 0.08,
    information: 'Linear Algebra and Vector Geometry',
  },
  MATH204: {
    courseName: 'Vectors and Matrices',
    courseCode: 'MATH204',
    prereqs: [],
    coreqs: [],
    xOffsetPercent: 0.64,
    yOffsetPercent: 0.52,
    information: 'Algebra and geometry of vectors, dot and cross products, lines and planes. System of equations, operations on matrices, rank, inverse, quadratic form, and rotation of axes.',
  },
  COMP346: {
    courseName: 'The Operating Systems',
    courseCode: 'COMP346',
    prereqs: ['COMP228'],
    coreqs: [],
    xOffsetPercent: 0.00,
    yOffsetPercent: 0.50,
    information: 'Fundamentals of operating system functionalities, design and implementation. Multiprogramming: processes and threads, context switching, queuing models and scheduling. Interprocess communication and synchronization. Principles of concurrency. Synchronization primitives. Deadlock detection and recovery, prevention and avoidance schemes. Memory management. Device management. File systems. Protection models and schemes.',
  },
};

function convertPosToSvg(x, y) {
  const point = new DOMPoint();
  // clientX and cientY are relative to the document
  point.x = x;
  point.y = y;
  // getScreenCTM() returns the matrix transformation FROM svg TO document coordinates
  // We want the opposite (document TO svg), so we call inverse()
  // We then apply this same transformation to our x, y positions
  const docToSvgCoordinates = svg.getScreenCTM().inverse();
  return point.matrixTransform(docToSvgCoordinates);
}

function setupPanning() {
  // This section handles panning the node-graph by clicking and moving the mouse around
  function onMouseDown(e) {
    const mouseButtonClicked = mouseButtonByType[e.which];
    // If it's not a left click, don't initiate panning
    if (mouseButtonClicked !== 'left') return;
    isPointerDown = true;
    // Define new 'pan sequence' pointer orign
    pointerOrigin = convertPosToSvg(e.clientX, e.clientY);
    svg.classList.add('panning');
  }
  function onMouseMove(e) {
    if (!isPointerDown) return;
    // Prevent selection of text etc in the SVG
    e.preventDefault();

    const pointerPos = convertPosToSvg(e.clientX, e.clientY);
    // Get x and y delta of the move since pressing down on the mouse
    const deltaX = pointerPos.x - pointerOrigin.x;
    const deltaY = pointerPos.y - pointerOrigin.y;
    // We subtract the delta because our pan goes in the opposite direction
    // e.g: click and drag right means our 'camera' moves to the left
    viewBox.x -= (deltaX);
    viewBox.y -= (deltaY);
    const newViewboxString = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
    svg.setAttribute('viewBox', newViewboxString);
  }
  function onMouseUp() {
    isPointerDown = false;
    svg.classList.remove('panning');
  }
  svg.addEventListener('mousedown', onMouseDown);
  svg.addEventListener('mousemove', onMouseMove);
  svg.addEventListener('mouseup', onMouseUp);
  // Pointer leaves SVG area
  svg.addEventListener('mouseleave', onMouseUp);
  // Panning section end
}

function setupZooming() {
  // Zooming section start
  // This section handles zooming in and out the node-graph by scrolling the mousewheel
  function onMouseWheel(e) {
    // if the deltayY is negative, w're zooming
    const isZoomIn = e.deltaY < 0;
    // Keep the relative location of the contents of the svg the same
    const pointerPosOldCoords = convertPosToSvg(e.clientX, e.clientY);
    if (isZoomIn) {
      const newViewboxWidth = viewBox.width / 2;
      const newViewboxHeight = viewBox.height / 2;
      const circleDiameter = circleRadius * 2;
      // If the new viewbox won't even be able to accomodate the size of a node, don't zoom in
      if ((newViewboxWidth < circleDiameter) || (newViewboxHeight < circleDiameter)) {
        return;
      }
      // Make the viewbox smaller (we can see less content when zooming in)
      viewBox.width = newViewboxWidth;
      viewBox.height = newViewboxHeight;
      // Keep the item over the mouse pointer centered
      viewBox.x += (pointerPosOldCoords.x - viewBox.x) / 2;
      viewBox.y += (pointerPosOldCoords.y - viewBox.y) / 2;
    } else {
      // Make the viewbox larger (we can see more content when zooming out)
      viewBox.width *= 2;
      viewBox.height *= 2;
      // Keep the item over the mouse pointer centered
      /*
            Example:
            - mouse cursor is on a node on position (50,50), which is centered
            - ViewBox(x=0,y=0,width=100,height=100)
            Question: What values of x/y in VB=(x,y,200,200) will keep the node centered?
            Answer: TBH - I dont rememeber how I made it work XD
          */
      viewBox.x -= pointerPosOldCoords.x - viewBox.x;
      viewBox.y -= pointerPosOldCoords.y - viewBox.y;
    }
  }
  svg.addEventListener('wheel', onMouseWheel);
  // Zooming section end
}

function addCourseNode(courseId, xOffsetInPx = 0, yOffsetInPx = 0) {
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
            <g class="circle-group">
              <circle class="circle"/>
              <!--Offset the text by the same amount that the circle radius, so as to have it centered-->
              <text 
                class="course-text" 
                x="${circleRadius}" 
                y="${circleRadius}" 
                text-anchor="middle"
                dominant-baseline="central"
              >
                ${courseId}
              </text>
            </g>
        </svg>`;
}

// isPrereq = true: prereq
// isPrereq = false: coreq
function addEdge(fromX, fromY, toX, toY, isPrereq) {
  document.getElementById('root-svg').innerHTML += `
        <svg>
            <defs>
              <marker
                  id="head"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>

            <path
                id='arrow-line'
                marker-end='url(#head)'
                stroke-width='2'
                fill='none' stroke='black'  
                ${isPrereq ? '' : 'stroke-dasharray="5"'}
                d='M${fromX},${fromY} ${toX},${toY}'
            />
        </svg>
        `;
}

function setCourseSelected(courseId, isSelected) {
  if (typeof courseId === 'undefined' || courseId == null) {
    selectedCourseId = null;
    setCourseInformation(null);
    return;
  }
  const courseCircle = document.querySelector(`[course-id=${courseId}] .circle`);
  if (isSelected) {
    courseCircle.classList.add('selected');
  } else {
    courseCircle.classList.remove('selected');
    setCourseInformation(null);
  }
}

function getCourseInformation(courseId) {
  return courseInformationByCourseId[courseId];
}

function clickCourse(event) {
  const mouseButtonClicked = mouseButtonByType[event.which];
  const {
    target: { parentElement: { parentElement: courseNode } },
  } = event;
  const previouslySelectedCourse = selectedCourseId;
  selectedCourseId = courseNode.getAttribute('course-id');
  if (mouseButtonClicked === 'left') {
    // Clearing previous one
    if (previouslySelectedCourse) {
      setCourseSelected(previouslySelectedCourse, false);
    }

    setCourseSelected(selectedCourseId, true);
    setCourseInformation(getCourseInformation(selectedCourseId));
  } else if (mouseButtonClicked === 'right') {
    const courseCircle = courseNode.querySelector('.circle');
    if (courseCircle.classList.contains('desireable')) {
      student.removeDesiredCourse(selectedCourseId);
    } else {
      student.addDesiredCourse(selectedCourseId);
    }
  }
  // Stop the root-svg's onClick from firing
  event.stopPropagation();
}

function hideContextMenu(event) {
  // Stop context menu from showing up
  event.preventDefault();
}

export function setupNodegraph() {
  setupPanning();
  setupZooming();
  // Adding the nodes
  Object.entries(courseInformationByCourseId).forEach(([courseId, courseInformation]) => {
    // The fixed position of every node is relative to the root window
    addCourseNode(
      courseId,
      courseInformation.xOffsetPercent * viewBox.width + viewBox.x,
      courseInformation.yOffsetPercent * viewBox.height + viewBox.y,
    );
  });

  // Adding the edges
  // NOTE: Edge drawing is broken if the user zooms in/out with the browser
  const prereqsByCourseId = Object.entries(courseInformationByCourseId).map(
    ([courseId, { prereqs }]) => [courseId, prereqs],
  );
  const coreqsByCourseId = Object.entries(courseInformationByCourseId).map(
    ([courseId, { coreqs }]) => [courseId, coreqs],
  );

  [
    [prereqsByCourseId, true],
    [coreqsByCourseId, false],
  ]
    .forEach(([reqsByCourseId, isPrereq]) => {
      reqsByCourseId.forEach(([courseId, reqIds]) => {
        const destinationBoundingRect = document
          .querySelector(`[course-id='${courseId}']`)
          .getBoundingClientRect();
        const destinationCenterX = destinationBoundingRect.left
          + destinationBoundingRect.width / 2;
        const destinationCenterY = destinationBoundingRect.top
          + destinationBoundingRect.height / 2;
        reqIds.forEach((reqId) => {
          const sourceBoundingRect = document
            .querySelector(`[course-id=${reqId}]`)
            .getBoundingClientRect();
          const sourceCenterX = sourceBoundingRect.left
            + sourceBoundingRect.width / 2;
          const sourceCenterY = sourceBoundingRect.top
            + sourceBoundingRect.height / 2;
          const distanceBetweenSourceAndDestination = Math.sqrt(
            (destinationCenterX - sourceCenterX) ** 2
            + (destinationCenterY - sourceCenterY) ** 2,
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
        });
      });

      // Adding event listeners
      document.querySelectorAll('.course-node').forEach((courseNode) => {
        courseNode.addEventListener('mousedown', clickCourse);
        courseNode.addEventListener('contextmenu', hideContextMenu);
      });
      const rootSvg = document.getElementById('root-svg');
      rootSvg.addEventListener('mousedown', (event) => {
        const mouseButtonClicked = mouseButtonByType[event.which];
        if (mouseButtonClicked === 'left') setCourseSelected(selectedCourseId, false);
      });
      rootSvg.addEventListener('contextmenu', hideContextMenu);
    });
}
