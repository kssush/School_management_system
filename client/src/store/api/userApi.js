import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registration: builder.mutation({
            query: (userData) => ({
                url: "user/registration",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User", "Teachers"],
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "user/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
        }),
        logout: builder.mutation({
            query: () => ({
                url: "user/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...userData }) => ({
                url: `user/${id}`,
                method: "PATCH",
                body: userData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "User", id }], //???
        }),
        updateParent: builder.mutation({
            query: ({ id, ...parentData }) => ({
                url: `/user/parent/${id}`,
                method: "PATCH",
                body: parentData,
            }),
            invalidatesTags: ["User"],
        }),
        updateTeacher: builder.mutation({
            query: ({id, teacherData}) => ({
                url: `/user/updateTeacher/${id}`,
                method: "PATCH",
                body: teacherData,
            }),
            invalidatesTags: ["Teacher"],
        }),
        getTeachers: builder.query({
            query: () => "/user/teacher",
            providesTags: ["Teachers"],
        }),
        getTeacher: builder.query({
            query: (id_teacher) => `/user/teacher/${id_teacher}`,
            providesTags: ["Teacher"],
        }),
        getFamily: builder.query({
            query: (id) => `/user/family/${id}`,
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),
    }),
});

export const {
    useRegistrationMutation,
    useLoginMutation,
    useLogoutMutation,
    useUpdateUserMutation,
    useUpdateParentMutation,
    useUpdateTeacherMutation,
    useGetTeachersQuery,
    useGetTeacherQuery,
    useGetFamilyQuery,
} = userApi;
