import React, {Suspense, lazy} from "react";
import type {RouteObject} from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import ErrorBoundary from "@/pages/error/ErrorBoundary";
import NotFoundPage from "@/pages/error/NotFoundPage";
import {PATHS} from "@/routes/paths";

const MainPage = lazy(() => import("@/pages/MainPage"));
const SamplePage = lazy(() => import("@/components/sample/SamplePage"));
const WelcomePage = lazy(() => import("@/pages/Welcome"));

export const routes: RouteObject[] = [
    {
        element: <AppLayout/>, errorElement: <ErrorBoundary/>,
        children: [
            {index: true, element: <Suspense fallback={<div className='p-6'>Loading…</div>}><MainPage/></Suspense>},
            {path: PATHS.sample, element: <Suspense fallback={<div>Loading…</div>}><SamplePage/></Suspense>},
            {path: PATHS.welcome, element: <Suspense fallback={<div>Loading…</div>}><WelcomePage/></Suspense>},
            {path: "*", element: <NotFoundPage/>},
        ]
    }
];
