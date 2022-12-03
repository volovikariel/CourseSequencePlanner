import { PrismaClient } from '@prisma/client';
import { CourseScheduleAPIResponse, CourseScheduleSchema, fetchCourseSchedules } from '../courseSchedule.js';
const prisma = new PrismaClient();

async function main() {
  // Delete all entries
  await prisma.courseSchedule.deleteMany();

  // Insert all course schedule values
  const rawCourseScheduleData = await fetchCourseSchedules();
  const rawCourseScheduleDataFrom2022 = rawCourseScheduleData.filter((course: CourseScheduleAPIResponse) => course.classStartDate.endsWith('2022'));
  const courseSchedules = [];
  for (const rawCourseSchedule of rawCourseScheduleDataFrom2022) {
    const result = CourseScheduleSchema.safeParse(rawCourseSchedule);
    if (result.success) {
      console.log(result.data);
      courseSchedules.push(result.data);
    }
    else {
      console.log(result.error);
      console.log(rawCourseSchedule);
      return;
    }
  }
  console.log(`#Rows to add: ${courseSchedules.length}`);
  const creates = [];
  const rowIds = new Set();
  for (const [rowNum, courseSchedule] of courseSchedules.entries()) {
    const rowId = `(${courseSchedule.subject}, ${courseSchedule.catalog}, ${courseSchedule.termCode}, ${courseSchedule.section}, ${courseSchedule.meetingPatternNumber})`;
    console.log(`Inserting row #${rowNum}: ${rowId}`);
    if (rowIds.has(rowId)) {
      console.log(`Found duplicate row ${rowId}`);
      return;
    } else {
      rowIds.add(rowId);
    }
    creates.push(prisma.courseSchedule.create({ data: courseSchedule }));
  }
  prisma.$transaction(creates);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });