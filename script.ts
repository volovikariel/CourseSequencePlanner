import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const COMP352courseSchedule = await prisma.courseSchedule.findFirst({
    where: {
        subject: 'COMP',
        catalog: '352'
    }
});
console.log(COMP352courseSchedule);