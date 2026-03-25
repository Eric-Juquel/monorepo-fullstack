import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./error-handling/ErrorPage";
import { NotFoundPage } from "./error-handling/NotFoundPage";
import { AppLayout } from "./layout/AppLayout";

const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const UsersPage = lazy(() => import("@/features/users/pages/UsersPage"));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <AppLayout>
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          </AppLayout>
        ),
      },
      {
        path: "users",
        element: (
          <AppLayout>
            <Suspense fallback={<PageLoader />}>
              <UsersPage />
            </Suspense>
          </AppLayout>
        ),
      },
      {
        path: "*",
        element: (
          <AppLayout>
            <NotFoundPage />
          </AppLayout>
        ),
      },
    ],
  },
]);
