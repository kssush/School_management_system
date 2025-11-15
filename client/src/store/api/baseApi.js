import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
    const baseQuery = await fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            
            if (token){
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    });

    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {      
        
        if (window.location.href.includes('/authorization') || args.url === '/user/login') {
            return result;
        }
     
        const refreshResult = await fetchBaseQuery({
            baseUrl: 'http://localhost:5000/api',
            credentials: 'include',
        })({ url: '/user/refresh', method: 'POST' }, api, extraOptions);

        if (refreshResult.data && refreshResult.data.token) {
            
            localStorage.setItem('accessToken', refreshResult.data.token);
            
            result = await baseQuery(args, api, extraOptions);

            return result;
        } else {
            alert('Refresh failed... Login again!')
           
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