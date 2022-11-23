/* eslint-disable no-restricted-syntax */
const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri'];
const courseScheduleInfo = {
  COMP248: {
    2022: {
      fall: [
        {
          courseName: 'Object-Oriented Programming 1',
          courseCode: 'COMP248',
          startTime: '10:00',
          endTime: '11:00',
          mon: false,
          tue: true,
          wed: false,
          thu: true,
          fri: false,
        },
        {
          courseName: 'Object-Oriented Programming 1',
          courseCode: 'COMP248',
          startTime: '10:00',
          endTime: '12:00',
          mon: false,
          tue: true,
          wed: false,
          thu: true,
          fri: false,
        },
      ],
      winter: [
        {
          courseName: 'Object-Oriented Programming 1',
          courseCode: 'COMP248',
          startTime: '10:00',
          endTime: '18:30',
          mon: false,
          tue: true,
          wed: false,
          thu: true,
          fri: false,
        },
        {
          courseName: 'Object-Oriented Programming 1',
          courseCode: 'COMP248',
          startTime: '10:00',
          endTime: '12:00',
          mon: false,
          tue: true,
          wed: false,
          thu: true,
          fri: false,
        },
      ],
    },
  },
  COMP249: {
    2022: {
      fall: [{
        courseName: 'Object-Oriented Programming 2',
        courseCode: 'COMP249',
        startTime: '13:30',
        endTime: '15:30',
        mon: true,
        tue: false,
        wed: true,
        thu: true,
        fri: false,
      }],
    },
  },
};

export function isCourseOffered(courseCode, year, term) {
  return Object.hasOwn(courseScheduleInfo, courseCode)
         && Object.hasOwn(courseScheduleInfo[courseCode], year)
         && Object.hasOwn(courseScheduleInfo[courseCode][year], term);
}

export function getCourseSchedule(course, year, term) {
  return courseScheduleInfo?.[course]?.[year]?.[term];
}

// Each schedule is composed of start/end times
function intersectDays(scheduleA, scheduleB, day) {
  if (scheduleA[day] === false) return [scheduleB];
  if (scheduleB[day] === false) return [scheduleA];
  const aStart = scheduleA.startTime;
  const aEnd = scheduleA.endTime;
  const bStart = scheduleB.startTime;
  const bEnd = scheduleB.endTime;
  // If they intersect, then these two don't match
  if (aStart < bEnd && aEnd > bStart) {
    return [];
  }

  return [scheduleA, scheduleB];
}

// Returns array of array of objects
export function intersectSchedules(schedulesA, schedulesB) {
  if (schedulesA.length === 0 && schedulesB.length > 0) return schedulesB;
  if (schedulesB.length === 0 && schedulesA.length > 0) return schedulesA;
  const validSchedules = [];
  for (const scheduleA of schedulesA) {
    for (const scheduleB of schedulesB) {
      const newScheduleCourseCodes = new Set();
      const newSchedule = [];
      let isValidSchedule = true;
      for (const day of daysOfWeek) {
        // If there is no intersecting to do
        if (scheduleA[day] === false && scheduleB[day] === false) continue;
        const mergedDay = intersectDays(scheduleA, scheduleB, day);
        // If their days intersect, it's an invalid pairing of scheduleA and scheduleB
        if (mergedDay.length === 0) {
          isValidSchedule = false;
          break;
        }
        // Push courses IF and ONLY IF they're not already present in the newSchedule
        for (const course of mergedDay) {
          if (!newScheduleCourseCodes.has(course.courseCode)) {
            newScheduleCourseCodes.add(course.courseCode);
            newSchedule.push(course);
          }
        }
      }
      if (isValidSchedule && newSchedule.length > 0) {
        validSchedules.push(newSchedule);
      }
    }
  }
  return validSchedules;
}

// https://coolors.co/392f5a-d1a94c-118ab2-06d6a0-757755-e3170a
const colors = ['#E3170A', '#d1a94c', '#118ab2', '#06d6a0', '#392F5A', '#023618'];

// Called from html
function cycleSchedules(schedules) { // eslint-disable-line no-unused-vars
  // TODO: Add a way to cycle through the possible schedules
}

function translateDay(courseCode) {
  // format weekday bools to numbers for timeslots
  const course = getCourseSchedule(courseCode);
  const weekdays = [course.mon, course.tue, course.wed, course.thu, course.fri];
  const weekdaysNum = weekdays.reduce(
    (accumulator, currentValue, currentIndex) => {
      if (currentValue === true) accumulator.push(currentIndex);
      return accumulator;
    },
    [],
  );
  return weekdaysNum;
}

function translateTime(hhmm) {
  // Format time to numbers for 'slices' of timeslots
  // goes from 9am to 630pm (9.5 hours) in 30min intervals,
  // Meaning that 9 is the first timeslot = 0 , 9:30 => 1, 9:45 => 1.5, 10 => 2, etc.
  const hours = parseInt(hhmm.split(':')[0], 10);
  const minutes = parseInt(hhmm.split(':')[1], 10) / 60;
  const time = hours + minutes;
  let x;

  if (time < 18) {
    x = (time % 9) * 2;
  } else x = (time % 9) * 2 + 18;
  return x;
}

function assignCourseBlockColor() {
  const random = Math.floor(Math.random() * colors.length);
  // Mutates original array, still returns removed element(s) as a list
  return colors.splice(random, 1);
}

function translateTimeForSlots(courseCode) {
  const course = getCourseSchedule(courseCode);
  const timeSlotStart = translateTime(course.startTime);
  const timeSlotEnd = translateTime(course.endTime);
  return [timeSlotStart, timeSlotEnd];
}

function addSelectedCourseToSchedule(courseCode) {
  // Add the selected course to the schedule
  const course = getCourseSchedule(courseCode);
  const days = translateDay(courseCode);
  const times = translateTimeForSlots(courseCode);
  const startTime = times[0];
  const endTime = times[1];
  const bg = assignCourseBlockColor(courseCode)[0];

  days.forEach((day) => {
    // Add the course to the schedule
    document.getElementById('schedule-content').innerHTML += ` 
    <span class = 'course'
    style='
    background-color: ${bg};
    --day: ${day}; 
    --timeslot-start: ${startTime};
    --timeslot-end: ${endTime}; 
    --course-length: calc(var(--timeslot-end) - var(--timeslot-start));
    --indexed-timeslot-start: calc(var(--timeslot-start) - 1); /* 1-indexing it */
    height: calc(var(--timeslot-height) * var(--course-length)); 
    left: calc(var(--column-width) * var(--day));
    top: calc(var(--timeslot-height) * var(--timeslot-start))'>

    ${course.courseCode} </span> `;
  });
}

// Lets say they selected 248 and 249
// addSelectedCourseToSchedule('COMP248');
// addSelectedCourseToSchedule('COMP249');
