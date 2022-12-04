import { z } from "zod";

export type CourseScheduleAPIResponse = {
    [key in keyof CourseSchedule]: string
}

export async function fetchCourseSchedules(): Promise<CourseScheduleAPIResponse[]> {
    // Basic access authentication credentials https://en.wikipedia.org/wiki/Basic_access_authentication
    const opendataCredentials = Buffer.from(`${process.env.OPENDATA_USER}:${process.env.OPENDATA_PSWRD}`).toString('base64');
    const headers = {
        headers: {
            'Authorization': `Basic ${opendataCredentials}`,
        }
    };
    const courseScheduleURL = 'https://opendata.concordia.ca/API/v1/course/schedule/filter/*/*/*';

    return await fetch(courseScheduleURL, headers).then(res => res.json());
}

function validateIsNumberAndReturnValue() {
    return z.string().regex(/^\d*$/, 'Must be a number').transform(Number);
}
export const CourseScheduleSchema = z.object({
    courseID: validateIsNumberAndReturnValue(),
    termCode: validateIsNumberAndReturnValue(),
    session: z.string(),
    subject: z.string(),
    catalog: z.string(),
    section: z.string(),
    componentCode: z.string(),
    componentDescription: z.string(),
    classNumber: validateIsNumberAndReturnValue(),
    classAssociation: validateIsNumberAndReturnValue(),
    courseTitle: z.string(),
    topicID: validateIsNumberAndReturnValue(),
    topicDescription: z.string(),
    classStatus: z.string(),
    locationCode: z.string(),
    instructionModeCode: z.string(),
    instructionModeDescription: z.string(),
    meetingPatternNumber: validateIsNumberAndReturnValue(),
    roomCode: z.string(),
    buildingCode: z.string(),
    room: z.string(),
    classStartTime: z.string(),
    classEndTime: z.string(),
    modays: z.string(),
    tuesdays: z.string(),
    wednesdays: z.string(),
    thursdays: z.string(),
    fridays: z.string(),
    saturdays: z.string(),
    sundays: z.string(),
    classStartDate: z.string(),
    classEndDate: z.string(),
    career: z.string(),
    departmentCode: z.string(),
    departmentDescription: z.string(),
    facultyCode: z.string(),
    facultyDescription: z.string(),
    enrollmentCapacity: validateIsNumberAndReturnValue(),
    currentEnrollment: z.string(),
    waitlistCapacity: validateIsNumberAndReturnValue(),
    currentWaitlistTotal: z.string(),
    hasSeatReserved: z.string()
}).strict();
type CourseSchedule = z.infer<typeof CourseScheduleSchema>