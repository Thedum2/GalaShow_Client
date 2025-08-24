import { createBrowserRouter } from "react-router-dom";
import { routes } from "@/routes/config";

const RAW = import.meta.env.VITE_BASE_PATH || "/";
const BASENAME = RAW.replace(/\/+$/, "") || "/";

export const router = createBrowserRouter(routes, { basename: BASENAME });
