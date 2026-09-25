import {createBrowserRouter} from "react-router";
import Landing from "../pages/Dashboard/Landing.tsx";
import {WithSidebar} from "../layout/WithSidebar/WithSidebar.tsx";
import Users from "../pages/Users/Users.tsx";
import AccessRules from "../pages/AccessRules/AccessRules.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <WithSidebar />,
        children: [
            {
                index: true,
                element: <Landing />
            },
            {
                path: 'users',
                element: <Users />
            },
            {
                path: 'access-rules',
                element: <AccessRules />
            }
        ]
    }
])