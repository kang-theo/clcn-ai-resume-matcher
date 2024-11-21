import axios from "axios";
// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";
// const { NEXTAUTH_SECRET = "", NEXTAUTH_SALT = "authjs.session-token" } =
//   process.env;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "", // Set your API base URL
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    // const token = await getToken({
    //   req,
    //   secret: NEXTAUTH_SECRET,
    //   salt: NEXTAUTH_SALT,
    // });
    // const token = localStorage.getItem('jwtToken'); // Retrieve token from local storage or cookies
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // } else {
    //   // Redirect to sign-in page if no token is found
    //   Router.push('/auth/signin');
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized error, optionally redirect to sign-in
      window.location.href = "/auth/signin";
      // Return a promise that never resolves to stop further execution
      return new Promise(() => {});
    } else {
      return Promise.reject(error);
    }
  }
);

export default apiClient;
