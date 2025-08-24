// src/layouts/AppLayout.tsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NAV = [
    { to: PATHS.root, label: "Main" },
    { to: PATHS.sample, label: "Sample" },
    { to: PATHS.welcome, label: "Welcome" },
];

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false);

    const link = ({ isActive }: { isActive: boolean }) =>
        `block rounded-lg ${collapsed ? "px-0 py-2 text-xs text-center" : "px-3 py-2 text-sm"} ${
            isActive ? "bg-zinc-800 text-white" : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
        }`;

    return (
        <div className="h-dvh w-dvw bg-zinc-950 text-zinc-100">
            <div className={`grid h-full ${collapsed ? "grid-cols-[72px_1fr]" : "grid-cols-[280px_1fr]"}`}>
                <aside className="border-r border-zinc-800">
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-zinc-800 p-3">
                            <div className={`font-semibold ${collapsed ? "text-base" : "text-lg"}`}>
                                {collapsed ? "G" : "GalaShow"}
                            </div>
                            <button
                                onClick={() => setCollapsed((v) => !v)}
                                title={collapsed ? "펼치기" : "접기"}
                                className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800/40 bg-gray-500"
                            >
                                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                                {!collapsed && "접기"}
                            </button>
                        </div>

                        <nav className={`flex-1 ${collapsed ? "space-y-1 p-2" : "space-y-1 p-3"}`}>
                            {NAV.map((n) => (
                                <NavLink
                                    key={n.to}
                                    to={n.to}
                                    className={link}
                                    end={n.to === PATHS.root}
                                    title={collapsed ? n.label : undefined}
                                >
                                    {collapsed ? n.label[0] : n.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </aside>
                <main className="min-w-0 overflow-y-auto">
                    <div className="p-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
