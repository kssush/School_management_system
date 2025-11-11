// store/api/classApi.js
import { baseApi } from "./baseApi";

export const classApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addStudent: builder.mutation({
            query: (studentData) => ({
                url: "/class/addStudent",
                method: "POST",
                body: studentData,
            }),
            invalidatesTags: ["Class", "Student", "User"], // инвалидируем список студентов
        }),
        addClass: builder.mutation({
            query: (classData) => ({
                url: "/class/addClass",
                method: "POST",
                body: classData,
            }),
            invalidatesTags: ["Class"], // инвалидируем список классов
        }),
        classUp: builder.mutation({
            query: () => ({
                url: "/class/classUp",
                method: "POST",
            }),
            invalidatesTags: ["Class", "Student", "Teachers"]
        }),
        getCombination: builder.query({
            query: () => "/class/getCombination",
            transformResponse: (response) => {
                const data = response.map(item => ({
                    ...item,
                    name: `${item.number} "${item.letter}"`
                }))

                return data;
            },
            providesTags: ["Class"], // помечаем как данные классов
        }),
        getAllCombinations: builder.query({
            query: () => "/class/getAllCombinations",
            transformResponse: (response) => {
                const data = response.map(item => ({
                    ...item,
                    name: `${item.number} "${item.letter}"`
                }))

                return data;
            },
            providesTags: ["Combinations"]
        }),
        getClass: builder.query({
            query: (id) => `/class/getClass/${id}`,
            providesTags: ['Class']
        }),
        getAllStudent: builder.query({
            query: (isClass) => {
                const params = {};
                console.log(isClass)
                if (isClass !== undefined) {
                    params.isClass = isClass;
                }
                return {
                    url: "/class/getAllStudent",
                    params,
                };
            },
            providesTags: ["Student"], // помечаем как данные студентов
        }),
    }),
});

export const {
    useAddStudentMutation,
    useAddClassMutation,
    useClassUpMutation,
    useGetCombinationQuery,
    useGetAllCombinationsQuery,
    useGetClassQuery,
    useGetAllStudentQuery,
} = classApi;
