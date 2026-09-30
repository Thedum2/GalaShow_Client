import React, {Suspense, lazy} from "react";
import type {RouteObject} from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import ErrorBoundary from "@/pages/error/ErrorBoundary";
import NotFoundPage from "@/pages/error/NotFoundPage";
import {PATHS} from "@/routes/paths";

{/* ====SAMPLE PAGE==== */}
const PolyChatSamplePage = lazy(() => import("@/components/sample/PolyChatSamplePage"));

{/* ====MAIN PAGE==== */}
const WelcomePage = lazy(() => import("@/pages/Welcome"));
const LobbyPage = lazy(() => import("@/pages/Lobby"));
const SelectPage = lazy(() => import("@/pages/Select"));
const LoadingPage = lazy(() => import("@/pages/Loading"));
const TutorialPage = lazy(() => import("@/pages/Tutorial"));
const PlayPage = lazy(() => import("@/pages/Play"));
const ResultPage = lazy(() => import("@/pages/Result"));
const WinnerPage = lazy(() => import("@/pages/Winner"));
const OAuthCallbackPage = lazy(() => import("@/pages/OAuthCallback"));


export const routes: RouteObject[] = [
    // OAuth 팝업은 배경·API 호출 없이 가볍게 띄운다
    {path: PATHS.oauth_callback, element: <Suspense fallback={null}><OAuthCallbackPage/></Suspense>},
    {
        element: <AppLayout/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {index: true, path: PATHS.welcome, element: <Suspense fallback={<div>Loading…</div>}><WelcomePage/></Suspense>},
            {path: PATHS.lobby, element: <Suspense fallback={<div>Loading…</div>}><LobbyPage/></Suspense>},
            {path: PATHS.select, element: <Suspense fallback={<div>Loading…</div>}><SelectPage/></Suspense>},
            {path: PATHS.loading, element: <Suspense fallback={<div>Loading…</div>}><LoadingPage/></Suspense>},
            {path: PATHS.result, element: <Suspense fallback={<div>Loading…</div>}><ResultPage/></Suspense>},
            {path: PATHS.tutorial, element: <Suspense fallback={<div>Loading…</div>}><TutorialPage/></Suspense>},
            {path: PATHS.play, element: <Suspense fallback={<div>Loading…</div>}><PlayPage/></Suspense>},
            {path: PATHS.winner, element: <Suspense fallback={<div>Loading…</div>}><WinnerPage/></Suspense>},
            {path: PATHS.polychat_sample, element: <Suspense fallback={<div>Loading…</div>}><PolyChatSamplePage/></Suspense>},
            {path: "*", element: <NotFoundPage/>},
        ]
    },
];
