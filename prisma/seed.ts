import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { CourseScheduleAPIResponse, CourseScheduleSchema, fetchCourseSchedules } from '../src/courseSchedule.js';
const prisma = new PrismaClient();

async function seedCourseSchedules() {
  const rawCourseScheduleData = await fetchCourseSchedules();
  const rawCourseScheduleDataFrom2022 = rawCourseScheduleData.filter((course: CourseScheduleAPIResponse) => course.classStartDate.endsWith('2022'));
  const courseSchedulesFrom2022 = z.array(CourseScheduleSchema).parse(rawCourseScheduleDataFrom2022);
  const upserts = courseSchedulesFrom2022.map(courseSchedule => prisma.courseSchedule.upsert({
    where: {
      courseScheduleId: {
        subject: courseSchedule.subject,
        catalog: courseSchedule.catalog,
        termCode: courseSchedule.termCode,
        section: courseSchedule.section,
        meetingPatternNumber: courseSchedule.meetingPatternNumber
      }
    },
    update: {},
    create: courseSchedule,
  }));
  prisma.$transaction(upserts);
}

async function main() {
  await seedCourseSchedules();
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