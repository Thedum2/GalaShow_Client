import React, {Suspense, lazy} from "react";
import type {RouteObject} from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import ErrorBoundary from "@/pages/error/ErrorBoundary";
import NotFoundPage from "@/pages/error/NotFoundPage";
import {PATHS} from "@/routes/paths";

const SimulationSamplePage = lazy(() => import("@/components/sample/SimulationSamplePage"));
const WelcomePage = lazy(() => import("@/pages/Welcome"));
const LobbyPage = lazy(() => import("@/pages/Lobby"));
const SelectPage = lazy(() => import("@/pages/Select"));
const LoadingPage = lazy(() => import("@/pages/Loading"));
const ResultPage = lazy(() => import("@/pages/Result"));
const WinnerPage = lazy(() => import("@/pages/Winner"));


export const routes: RouteObject[] = [
    {
        element: <AppLayout/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {index: true, path: PATHS.welcome, element: <Suspense fallback={<div>Loading…</div>}><WelcomePage/></Suspense>},
            {path: PATHS.lobby, element: <Suspense fallback={<div>Loading…</div>}><LobbyPage/></Suspense>},
            {path: PATHS.select, element: <Suspense fallback={<div>Loading…</div>}><SelectPage/></Suspense>},
            {path: PATHS.loading, element: <Suspense fallback={<div>Loading…</div>}><LoadingPage/></Suspense>},
            {path: PATHS.result, element: <Suspense fallback={<div>Loading…</div>}><ResultPage/></Suspense>},
            {path: PATHS.winner, element: <Suspense fallback={<div>Loading…</div>}><WinnerPage/></Suspense>},
            {path: PATHS.simulation_sample,    element: <Suspense fallback={<div>Loading…</div>}><SimulationSamplePage/></Suspense>},
            {path: "*", element: <NotFoundPage/>},
        ]
    },
];
