// store/api/classApi.js
import { baseApi } from "./baseApi";

export const classApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /class/addStudent
        addStudent: builder.mutation({
            query: (studentData) => ({
                url: "/class/addStudent",
                method: "POST",
                body: studentData,
            }),
            invalidatesTags: ["Student"], // инвалидируем список студентов
        }),

        // POST /class/addClass
        addClass: builder.mutation({
            query: (classData) => ({
                url: "/class/addClass",
                method: "POST",
                body: classData,
            }),
            invalidatesTags: ["Class"], // инвалидируем список классов
        }),

        // POST /class/classUp
        classUp: builder.mutation({
            query: () => ({
                url: "/class/classUp",
                method: "POST",
            }),
            invalidatesTags: ["Class", "Student"], // инвалидируем всё после повышения классов
        }),

        // GET /class/getCombination
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

        // GET /class/getClass/:id
        getClass: builder.query({
            query: (id) => `/class/getClass/${id}`,
            providesTags: (result, error, id) => [{ type: "Class", id }], // тег с ID класса
        }),

        // GET /class/getAllStudent
        getAllStudent: builder.query({
            query: (isClass) => {
                const params = {};
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
    useGetClassQuery,
    useGetAllStudentQuery,
} = classApi;
