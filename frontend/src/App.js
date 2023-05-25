import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import AboutPage from "./pages/AbooutPage";
import BlogPage from "./pages/BlogPage";
import LoginPage, { action as LoginAction } from "./pages/AuthPages/LoginPage";
import SignupPage, {
  action as SignupAction,
} from "./pages/AuthPages/SignupPage";
import CreatorPage from "./pages/CreatorsPage/CreatorPage";
import WriteBlog from "./pages/CreatorsPage/WriteBlog";

import { loader as categoryLoader } from "./containers/Category/Category";
import SingleBlog, { SingleBlogLoader } from "./pages/Blogs/SingleBlog";
import { action as LogoutAction } from "./pages/Logout";
import { checkAuthLoader, tokenLoader } from "./utils/auth";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: categoryLoader,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/:blogId",
        loader: SingleBlogLoader,
        element: <SingleBlog />,
      },
      {
        path: "blog/new/",
        loader: checkAuthLoader,
        element: <WriteBlog />,
      },
      {
        path: "creators",
        element: <CreatorPage />,
      },
      {
        path: "auth/login",
        action: LoginAction,
        element: <LoginPage />,
      },
      {
        path: "auth/signup",
        element: <SignupPage />,
        action: SignupAction,
      },
      {
        path: "/logout",
        action: LogoutAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// For Logout add a Form inside a Navlink and /logout
