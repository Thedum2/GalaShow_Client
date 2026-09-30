const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("node:path");
const { createSimulatorServer, DEFAULT_PORT } = require("./server.cjs");

const port = Number(process.env.GALASHOW_SIM_PORT) || DEFAULT_PORT;
let win = null;
let server = null;

function createWindow() {
    win = new BrowserWindow({
        width: 440,
        height: 900,
        minWidth: 400,
        minHeight: 600,
        title: "GalaShow Simulator",
        backgroundColor: "#0a0a0a",
        autoHideMenuBar: true,
        icon: path.join(__dirname, "..", "build", "icon.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    // 외부 링크는 기본 브라우저로 연다.
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (/^https?:\/\//.test(url)) shell.openExternal(url);
        return { action: "deny" };
    });

    if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL);
    else win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
}

app.whenReady().then(() => {
    server = createSimulatorServer({
        port,
        onStatus: (status) => win?.webContents.send("sim:status", status),
        onState: (state) => win?.webContents.send("sim:state", state),
    });

    ipcMain.handle("sim:send", (_event, message) => server.send(message));
    ipcMain.handle("sim:getStatus", () => server.status());

    createWindow();
});

app.on("window-all-closed", async () => {
    await server?.close();
    app.quit();
});
