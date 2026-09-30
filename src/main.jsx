import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
// 라우터 생성 전에 새로고침 여부를 확인해 첫 화면으로 되돌린다.
import "@/util/resetOnReload";
import { router } from "@/routes/router";
import "./index.css";
import "@/bridge";

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)