import Analytics from "../pages/Analytics/Analytics";
import BellSchedule from "../pages/BellSchedule/BellSchedule";
import Class from "../pages/Class/Class";
import Family from "../pages/Family/Family";
import Homework from "../pages/Homework/Homework";
import Magazine from "../pages/Magazine/Magazine";
import Profile from "../pages/Profile/Profile";
import Schedule from "../pages/Schedule/Schedule";
import Student from "../pages/Student/Student";
import Teacher from "../pages/Teacher/Teacher";
import TeacherSchedule from "../pages/TeacherSchedule/TeacherSchedule";
import ScheduleIcon from '../assets/icons/schedule.svg'
import BellIcon from '../assets/icons/bell.svg'
import MagazineIcon from '../assets/icons/magazine.svg'
import HomeworkIcon from '../assets/icons/homework.svg'
import TeacherIcon from '../assets/icons/teacher.svg'
import ClassIcon from '../assets/icons/classes.svg'
import StudentIcon from '../assets/icons/student.svg'


export const pages = {
    basic: [
        {
            page: '/',
            name: 'Schedule',
            component: Schedule,
            icon: ScheduleIcon
        },
        {
            page: '/bell',
            name: 'Bell schedule',
            component: BellSchedule,
            icon: BellIcon
        },
        {
            page: '/teacher',
            name: 'Teacher',
            component: Teacher,
            icon: TeacherIcon
        },
        {
            page: '/teacherSchedule/:id_teacher',
            name: 'TeacherSchedule',
            component: TeacherSchedule
        },
        {
            page: '/family/:id_student',
            name: 'Family',
            component: Family
        },
        {
            page: '/profile/:id_teacher',
            name: 'Profile',
            component: Profile
        }
    ],
    admin: [
        {
            page: '/analytics',
            name: 'Analytics',
            component: Analytics,
            icon: ScheduleIcon
        },
        {
            page: '/magazine',
            name: 'Magazine',
            component: Magazine,
            icon: MagazineIcon
        },
        {
            page: '/class',
            name: 'Class',
            component: Class,
            icon: ClassIcon
        },
        {
            page: '/student',
            name: 'Student',
            component: Student,
            icon: StudentIcon
        },
    ],
    teacher: [
        {
            page: '/magazine',
            name: 'Magazine',
            component: Magazine,
            icon: MagazineIcon
        },
        {
            page: '/class',
            name: 'Class',
            component: Class,
            icon: ClassIcon
        },
        {
            page: '/student',
            name: 'Student',
            component: Student,
            icon: StudentIcon
        },
    ],
    student: [
        {
            page: '/homework',
            name: 'Homework',
            component: Homework,
            icon: HomeworkIcon
        },
    ],
    mam: [
        {
            page: '/homework',
            name: 'Homework',
            component: Homework,
            icon: HomeworkIcon
        },
        {
            page: '/magazine',
            name: 'Magazine',
            component: Magazine,
            icon: MagazineIcon
        },
    ],
    dad:[
        {
            page: '/homework',
            name: 'Homework',
            component: Homework,
            icon: HomeworkIcon
        },
        {
            page: '/magazine',
            name: 'Magazine',
            component: Magazine,
            icon: MagazineIcon
        },
    ]
}