import React, {Suspense, lazy} from "react";
import type {RouteObject} from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import ErrorBoundary from "@/pages/error/ErrorBoundary";
import NotFoundPage from "@/pages/error/NotFoundPage";
import {PATHS} from "@/routes/paths";

const SimulationSamplePage = lazy(() => import("@/components/sample/SimulationSamplePage"));
const WelcomePage = lazy(() => import("@/pages/Welcome"));


export const routes: RouteObject[] = [
    {
        element: <AppLayout/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {index: true, path: PATHS.welcome, element: <Suspense fallback={<div>Loading…</div>}><WelcomePage/></Suspense>},
            {path: PATHS.simulation_sample,    element: <Suspense fallback={<div>Loading…</div>}><SimulationSamplePage/></Suspense>},
            {path: "*", element: <NotFoundPage/>},
        ]
    },
];
