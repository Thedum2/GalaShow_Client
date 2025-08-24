import React, {Suspense, lazy} from "react";
import type {RouteObject} from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import ErrorBoundary from "@/pages/error/ErrorBoundary";
import NotFoundPage from "@/pages/error/NotFoundPage";
import {PATHS} from "@/routes/paths";

const SamplePage = lazy(() => import("@/components/sample/SamplePage"));
const WelcomePage = lazy(() => import("@/pages/Welcome"));

export const routes: RouteObject[] = [
    {
        element: <AppLayout/>, errorElement: <ErrorBoundary/>,
        children: [
            {path: PATHS.sample, element: <Suspense fallback={<div>Loading…</div>}><SamplePage/></Suspense>},
            {index:true,path: PATHS.welcome, element: <Suspense fallback={<div>Loading…</div>}><WelcomePage/></Suspense>},
            {path: "*", element: <NotFoundPage/>},
        ]
    }
];
