import { baseApi } from "./baseApi";

export const magazineApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Дни журнала
        addDay: builder.mutation({
            query: (dayData) => ({
                url: "/magazine/addDay",
                method: "POST",
                body: dayData,
            }),
            invalidatesTags: ["Magazine", "Lesson"],
        }),
        updateDay: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `/magazine/updateDay/${id}`,
                method: "PATCH",
                body: updateData,
            }),
            invalidatesTags: ["Magazine", "Lesson"],
        }),

        // Оценки/посещаемость
        addPerformance: builder.mutation({
            query: (performanceData) => ({
                url: "/magazine/addPerformance",
                method: "POST",
                body: performanceData,
            }),
            invalidatesTags: ["Magazine", "Lesson"],
        }),
        updatePerformance: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `/magazine/updatePerformance/${id}`,
                method: "PATCH",
                body: updateData,
            }),
            invalidatesTags: ["Magazine", "Lesson"],
        }),

        // Получение данных
        getMagazine: builder.query({
            query: (params) => ({
                url: "/magazine/getMagazine",
                params: {
                    id_class: params.id_class,
                    id_project: params.id_project,
                    date: params.date,
                },
            }),
            providesTags: ["Magazine"],
        }),
        getPerformance: builder.query({
            query: (params) => ({
                url: "/magazine/getPerformance",
                params: {
                    id_class: params.id_class,
                    id_project: params.id_project,
                    date: params.date,
                    id_student: params.id_student,
                },
            }),
            providesTags: ["Magazine"],
        }),
        getScheduleHomework: builder.query({
            query: (id) => ({
                url: `/magazine/getScheduleHomework/${id}`
            }),
            providesTags: ["ScheduleHomework"],
        }),
        getLessonHomework: builder.query({
            query: ({id, date}) => ({
                url: `/magazine/getLessonHomework/${id}?date=${date}`
            }),
            providesTags: ["LessonSchedule"],
        }),

        // Рецензии
        addReview: builder.mutation({
            query: (id_student) => ({
                url: `/magazine/addReview/${id_student}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Magazine"],
        }),
        removeReview: builder.mutation({
            query: (id_class) => ({
                url: `/magazine/removeReview/${id_class}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Magazine"],
        }),
    }),
});

export const {
    useAddDayMutation,
    useUpdateDayMutation,
    useAddPerformanceMutation,
    useUpdatePerformanceMutation,
    useGetMagazineQuery,
    useGetPerformanceQuery,
    useGetScheduleHomeworkQuery,
    useGetLessonHomeworkQuery,
    useAddReviewMutation,
    useRemoveReviewMutation,
} = magazineApi;