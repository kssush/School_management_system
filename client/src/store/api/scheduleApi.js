import { baseApi } from "./baseApi";

export const scheduleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addLesson: builder.mutation({
            query: (lessonData) => ({
                url: "schedule/addLesson",
                method: "POST",
                body: lessonData,
            }),
            invalidatesTags: ["Lesson"]
        }),
        deleteLesson: builder.mutation({
            query: (id) => ({
                url: `schedule/deleteLesson/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Lesson"] //invalidatesTags: (result, error, id) => [{ type: "Lesson", id }]
        }),
        updateLesson: builder.mutation({
            query: ({id, ...lessonData}) => ({
                url: `schedule/updateLesson/${id}`,
                method: "PATCH",
                body: lessonData,
            }),
            invalidatesTags: ["Lesson"]
        }),
        updateTime: builder.mutation({
            query: ({id, ...lessonData}) => ({
                url: `schedule/updateTime/${id}`,
                method: "PATCH",
                body: lessonData,
            }),
            invalidatesTags: (result, error, id) => [{ type: "Time", id }]
        }),
        getLesson: builder.query({
            query: (id) => `/schedule/getLesson/${id}`,
            providesTags: (result, error, id) => [
                { type: "Lesson", id } // ← тег с ID урока
            ],
        }),
        getLessonTeacher: builder.query({
            query: (id) => `/schedule/getLessonTeacher/${id}`,
            providesTags: (result, error, id) => [
                { type: "Lesson", id },
                "Teacher" // ← если возвращает данные учителя
            ],
        }),
        getSchedule: builder.query({
            query: (shift) => `/schedule/getSchedule?shift=${shift}`,
            providesTags: (result, error, id) => [
                { type: "Schedule", id }, // ← тег с ID расписания
                "Lesson" // ← т.к. расписание содержит уроки
            ],
        }),
        getShift: builder.query({
            query: (id) => `/schedule/getShift/${id}`,
            providesTags: (result, error, id) => [
                ["Shift"]
            ],
        }),
        getSubject: builder.query({
            query: () => '/schedule/getSubject',
            providesTags: ["Subject"]
        })
    })
})

export const {
    useAddLessonMutation,
    useDeleteLessonMutation,
    useUpdateLessonMutation,
    useGetLessonQuery,
    useGetLessonTeacherQuery,
    useGetScheduleQuery,
    useGetShiftQuery,
    useGetSubjectQuery
} = scheduleApi;
