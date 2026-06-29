const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("wanDesktop", {
  getStatus: () => ipcRenderer.invoke("app:get-status"),
  startServer: () => ipcRenderer.invoke("app:start-server"),
  stopServer: () => ipcRenderer.invoke("app:stop-server"),
  clearSavedQueue: () => ipcRenderer.invoke("app:clear-saved-queue"),
  listOutputs: () => ipcRenderer.invoke("app:list-outputs"),
  generateVideo: (input) => ipcRenderer.invoke("app:generate-video", input),
  validateGeneration: (input) => ipcRenderer.invoke("app:validate-generation", input),
  cancelGeneration: () => ipcRenderer.invoke("app:cancel-generation"),
  detectGpu: () => ipcRenderer.invoke("app:detect-gpu"),
  openUrl: (url) => ipcRenderer.invoke("app:open-url", url),
  openPath: (targetPath) => ipcRenderer.invoke("app:open-path", targetPath),
  showOutputFolder: () => ipcRenderer.invoke("app:show-output-folder"),
  chooseRepoRoot: () => ipcRenderer.invoke("app:choose-repo-root"),
  chooseOutputFolder: () => ipcRenderer.invoke("app:choose-output-folder"),
  copyPrompt: (prompt) => ipcRenderer.invoke("app:copy-prompt", prompt),
  updateLocal: () => ipcRenderer.invoke("app:update-local"),
  checkAppUpdate: () => ipcRenderer.invoke("app:check-app-update"),
  onStatus: (callback) => ipcRenderer.on("status", (_event, payload) => callback(payload)),
  onLogs: (callback) => ipcRenderer.on("logs", (_event, payload) => callback(payload)),
});
