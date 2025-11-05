import WinterIcon from '../../assets/icons/winter.svg'
import SpringIcon from '../../assets/icons/spring.svg'
import SummerIcon from '../../assets/icons/summer.svg'
import AutumnIcon from '../../assets/icons/autumn.svg'

export const events = [
    {
        color: 'yellow',
        weekday: 'Every day',
        place: 'School canteen',
        action: 'Lunch',
        time: '10:40 - 11:10'
    },
    {
        color: 'green',
        weekday: 'Saturday',
        place: 'School Gym',
        action: 'Gym',
        time: '10:30 - 17:00'
    },
    {
        color: 'blue',
        weekday: 'Every day',
        place: 'School Library',
        action: 'Library',
        time: '10:00 - 18:30'
    },
]


export const holidays = [
    {
        time_of_year: 'Winter',
        date: 'December 24th - January 7th',
        icon: WinterIcon,
        color: 'blue'
    },
    {
        time_of_year: 'Spring',
        date: 'March 24th - March 31th',
        icon: SpringIcon,
        color: 'green'
    },
    {
        time_of_year: 'Summer',
        date: 'June 1st - August 31th',
        icon: SummerIcon,
        color: 'yellow'
    },
    {
        time_of_year: 'Autumn',
        date: 'October 29th - November 7th',
        icon: AutumnIcon,
        color: 'orange'
    }
]