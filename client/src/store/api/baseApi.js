import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
    const baseQuery = await fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            console.log(token)
            if (token){
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    });

    let result = await baseQuery(args, api, extraOptions);
    console.log(args)
    if (result.error && result.error.status === 401) {      
        console.log('11111', window.location.href.includes('/authorization') || args.url === '/user/login')
        if (window.location.href.includes('/authorization') || args.url === '/user/login') {
            return result;
        }
        console.log('22222222222')
        const refreshResult = await fetchBaseQuery({
            baseUrl: 'http://localhost:5000/api',
            credentials: 'include',
        })({ url: '/user/refresh', method: 'POST' }, api, extraOptions);

        if (refreshResult.data && refreshResult.data.token) {
             console.log('44444444444443333333333111122222222')
            localStorage.setItem('accessToken', refreshResult.data.token);
             console.log(localStorage.getItem('accessToken'))
            result = await baseQuery(args, api, extraOptions);

            return result;
        } else {
            alert('Refresh failed... Login again!')
           console.log('333333333322222222222')
            localStorage.removeItem('accessToken'); // можно логаут

            return result;
        }
    }
    
    if (result.error && result.meta?.response?.status >= 400) {
        const message = result.error.data?.message || 'Something went wrong';
        console.error('API Error:', message);
        alert(message);
    }

    return result;
};


export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['User', 'Class', 'Schedule', 'Magazine', 'Lesson', 'Time', 'Teachers', 'Teacher', 'Shift', 'Subject', 'SubjectClass', 'Combinations', 'ScheduleHomework', 'LessonSchedule'],
    endpoints: () => ({})
});