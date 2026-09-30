const { contextBridge, ipcRenderer } = require("electron");

const subscribe = (channel) => (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on(channel, handler);
    return () => ipcRenderer.off(channel, handler);
};

contextBridge.exposeInMainWorld("simulator", {
    send: (message) => ipcRenderer.invoke("sim:send", message),
    getStatus: () => ipcRenderer.invoke("sim:getStatus"),
    onStatus: subscribe("sim:status"),
    onState: subscribe("sim:state"),
});
