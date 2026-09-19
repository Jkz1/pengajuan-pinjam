import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { ApplicationList } from "./pages/ApplicationList";
import { ApplicationDetail } from "./pages/ApplicationDetail";
import { ApplicationCreate } from "./pages/ApplicationCreate";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex gap-4 items-center">
          <span className="font-bold text-xl tracking-wide">
            Capella Multidana
          </span>
        </div>
      </nav>
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => null,
  beforeLoad: ({ navigate }) => {
    navigate({ to: "/applications", replace: true });
  },
});

const applicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "applications",
});

const applicationsIndexRoute = createRoute({
  getParentRoute: () => applicationsRoute,
  path: "/",
  component: ApplicationList,
});

const applicationsNewRoute = createRoute({
  getParentRoute: () => applicationsRoute,
  path: "new",
  component: ApplicationCreate,
});

const applicationsDetailRoute = createRoute({
  getParentRoute: () => applicationsRoute,
  path: "$id",
  component: ApplicationDetail,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  applicationsRoute.addChildren([
    applicationsIndexRoute,
    applicationsNewRoute,
    applicationsDetailRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
