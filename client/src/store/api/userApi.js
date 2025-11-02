import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registration: builder.mutation({
            query: (userData) => ({
                url: "user/registration",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
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
        getTeachers: builder.query({
            query: () => "/user/teacher",
            providesTags: ["User"],
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
    useGetTeachersQuery,
    useGetFamilyQuery,
} = userApi;
