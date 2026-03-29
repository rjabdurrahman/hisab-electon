import { contextBridge, ipcRenderer } from "electron";

const api = {
  invoke: (action: string, payload?: unknown) =>
    ipcRenderer.invoke("api-invoke", action, payload),
};

if (process.contextIsolated) {
  try {
    // Do NOT expose electronAPI globally to prevent direct ipcRenderer access
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore
  window.api = api;
}
