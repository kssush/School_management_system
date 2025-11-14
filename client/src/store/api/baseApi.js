import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const baseApi = createApi({
//     reducerPath: 'api',
//     baseQuery: fetchBaseQuery({
//         baseUrl: 'http://localhost:5000/api',
//         prepareHeader: (headers) => {
//             const token = localStorage.getItem('token');
//             if (token) headers.set('authorization', `Bearer ${token}`);
//             return headers;
//         },
//     }),
//     tagTypes: ['User', 'Class', 'Schedule', 'Magazine', 'Lesson', 'Time', 'Teachers', 'Teacher', 'Shift', 'Subject', 'Combinations'],
//     endpoints: () => ({})
// })

// const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
//     const result = await fetchBaseQuery({
//         baseUrl: 'http://localhost:5000/api',
//         prepareHeaders: (headers) => {
//             const token = localStorage.getItem('token');
//             if (token) headers.set('authorization', `Bearer ${token}`);
//             return headers;
//         },
//     })(args, api, extraOptions);

//     
//     if (result.error) {
//         const { status, data } = result.error;
//         console.log(result)
//         let message = 'Something went wrong';
        
//         // Обрабатываем разные форматы данных
//         if (typeof data === 'string') {
//             message = data;
//         } else if (data?.message) {
//             message = data.message;
//         } else if (data?.error) {
//             message = data.error;
//         }
        
//         switch (status) {
//             case 409:
//                 console.error('Conflict error:', message);
//                 break;
//             case 401:
//                 console.error('Unauthorized');
//                 break;
//             case 500:
//                 console.error('Server error');
//                 break;
//             default:
//                 console.error('Unknown error:', message);
//         }

//         setTimeout(() => {

//         }, 100000)

//         alert(message);
//     }

//     return result;
// };

const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    })(args, api, extraOptions);

    // Ошибка = есть result.error И статус >= 400
    const isRealError = result.error && result.meta?.response?.status >= 400;
    
    if (isRealError) {
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