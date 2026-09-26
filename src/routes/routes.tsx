import {createBrowserRouter} from "react-router";
import Landing from "../pages/Dashboard/Landing.tsx";
import {WithSidebar} from "../layout/WithSidebar/WithSidebar.tsx";
import Users from "../pages/Users/Users.tsx";
import AccessRules from "../pages/AccessRules/AccessRules.tsx";
import Settings from "../pages/Settings/Settings.tsx";
import OidcClients from "../pages/OidcClients/OidcClients.tsx";
import Passkeys from "../pages/Passkeys/Passkeys.tsx";

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
            },
            {
                path: 'oidc-clients',
                element: <OidcClients />
            },
            {
                path: 'passkeys',
                element: <Passkeys />
            },
            {
                path: 'settings',
                element: <Settings />
            }
        ]
    }
])