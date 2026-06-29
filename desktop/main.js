const { app, BrowserWindow, dialog, ipcMain, shell, clipboard } = require("electron");
const { autoUpdater } = require("electron-updater");
const { spawn, execFile } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const serverUrl = "http://localhost:7860";
const configPath = path.join(app.getPath("userData"), "settings.json");

let mainWindow;
let serverProcess = null;
let serverStartedAt = null;
let currentUrl = serverUrl;
let logLines = [];
let updateState = { busy: false, message: "Ready" };
let generationProcess = null;
let generationStartedAt = null;
let currentJob = null;

function getDefaultRepoRoot() {
  const devRoot = path.resolve(__dirname, "..");
  if (fs.existsSync(path.join(devRoot, "pinokio.js"))) return devRoot;
  const commonRoot = "C:\\Dev\\wan2gp-amd";
  if (fs.existsSync(path.join(commonRoot, "pinokio.js"))) return commonRoot;
  return devRoot;
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    return {};
  }
}

function writeConfig(config) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function getPaths() {
  const config = readConfig();
  const repoRoot = config.repoRoot || getDefaultRepoRoot();
  const wanRoot = path.join(repoRoot, "app");
  return {
    repoRoot,
    wanRoot,
    pythonPath: path.join(wanRoot, "env", "Scripts", "python.exe"),
    wgpPath: path.join(wanRoot, "wgp.py"),
    outputsPath: path.join(wanRoot, "outputs"),
    iconPath: path.join(repoRoot, "icon.png"),
  };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 760,
    backgroundColor: "#f7f9fc",
    title: "Wan2GP AMD",
    icon: getPaths().iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  if (process.env.WAN_DESKTOP_CAPTURE) {
    mainWindow.webContents.once("did-finish-load", async () => {
      mainWindow.show();
      mainWindow.focus();
      setTimeout(async () => {
        const image = await mainWindow.webContents.capturePage();
        fs.writeFileSync(process.env.WAN_DESKTOP_CAPTURE, image.toPNG());
        app.quit();
      }, 2000);
    });
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function send(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function appendLog(text, stream = "info") {
  const clean = String(text || "").replace(/\r/g, "").trimEnd();
  if (!clean) return;
  for (const line of clean.split("\n")) {
    const entry = {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      stream,
      text: line,
    };
    logLines.push(entry);
  }
  logLines = logLines.slice(-500);
  send("logs", logLines);
}

async function isServerReachable() {
  try {
    const response = await fetch(serverUrl, { signal: AbortSignal.timeout(900) });
    return response.ok || response.status < 500;
  } catch {
    return false;
  }
}

async function getStatus() {
  const { repoRoot, wanRoot, pythonPath, wgpPath, outputsPath } = getPaths();
  const envReady = fs.existsSync(pythonPath) && fs.existsSync(wgpPath);
  const externalRunning = !serverProcess && await isServerReachable();
  return {
    envReady,
    running: Boolean(serverProcess) || externalRunning,
    managed: Boolean(serverProcess),
    externalRunning,
    pid: serverProcess ? serverProcess.pid : null,
    startedAt: serverStartedAt,
    url: currentUrl,
    repoRoot,
    wanRoot,
    pythonPath,
    outputsPath,
    logLines,
    updateState,
    generation: {
      running: Boolean(generationProcess),
      pid: generationProcess ? generationProcess.pid : null,
      startedAt: generationStartedAt,
      job: currentJob,
    },
  };
}

async function publishStatus() {
  send("status", await getStatus());
}

async function startServer() {
  const { wanRoot, pythonPath, wgpPath } = getPaths();
  if (serverProcess) {
    await publishStatus();
    return getStatus();
  }
  if (await isServerReachable()) {
    appendLog("Detected an already running Wan2GP server on http://localhost:7860.");
    return getStatus();
  }
  if (!fs.existsSync(pythonPath) || !fs.existsSync(wgpPath)) {
    throw new Error("Wan2GP is not built locally yet. Expected app/env/Scripts/python.exe and app/wgp.py.");
  }

  appendLog("Starting Wan2GP AMD server...");
  serverProcess = spawn(pythonPath, [wgpPath, "--server-port", "7860"], {
    cwd: wanRoot,
    env: { ...process.env, GRADIO_ANALYTICS_ENABLED: "False" },
    windowsHide: true,
  });
  serverStartedAt = new Date().toISOString();

  serverProcess.stdout.on("data", (data) => {
    const text = data.toString();
    const match = text.match(/https?:\/\/\S+/);
    if (match) currentUrl = match[0].replace(/[.,;]$/, "");
    appendLog(text, "stdout");
    publishStatus();
  });

  serverProcess.stderr.on("data", (data) => {
    appendLog(data.toString(), "stderr");
  });

  serverProcess.on("error", (error) => {
    appendLog(error.message, "error");
  });

  serverProcess.on("exit", (code, signal) => {
    appendLog(`Wan2GP server stopped${signal ? ` by ${signal}` : ""}${code !== null ? ` with code ${code}` : ""}.`);
    serverProcess = null;
    serverStartedAt = null;
    publishStatus();
  });

  publishStatus();
  return getStatus();
}

async function stopServer() {
  if (!serverProcess) return getStatus();
  appendLog("Stopping Wan2GP server...");
  serverProcess.kill("SIGINT");
  return getStatus();
}

async function clearSavedQueue() {
  const { wanRoot } = getPaths();
  const queuePath = path.join(wanRoot, "queue.zip");
  if (!fs.existsSync(queuePath)) {
    appendLog("No saved queue.zip found.");
    return { cleared: false, message: "No saved queue found." };
  }
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const backupPath = path.join(wanRoot, `queue.${stamp}.zip.bak`);
  fs.renameSync(queuePath, backupPath);
  appendLog(`Moved saved queue to ${backupPath}.`);
  await publishStatus();
  return { cleared: true, message: `Saved queue moved to ${backupPath}.`, backupPath };
}

function listOutputs() {
  const { outputsPath } = getPaths();
  if (!fs.existsSync(outputsPath)) return [];
  const files = [];
  const stack = [outputsPath];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (/\.(mp4|webm|mov|png|jpg|jpeg|wav|mp3|json)$/i.test(entry.name)) {
        const stat = fs.statSync(fullPath);
        files.push({
          name: entry.name,
          path: fullPath,
          modifiedAt: stat.mtimeMs,
          size: stat.size,
          type: path.extname(entry.name).slice(1).toUpperCase(),
        });
      }
    }
  }
  return files.sort((a, b) => b.modifiedAt - a.modifiedAt).slice(0, 40);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

function createGenerationSettings(input) {
  const prompt = String(input?.prompt || "").trim();
  if (!prompt) throw new Error("Prompt is required.");
  const modelType = String(input?.modelType || "t2v_sf").trim();
  const resolution = String(input?.resolution || "832x480").trim();
  const steps = Math.max(1, Number.parseInt(input?.steps || "4", 10));
  const seedRaw = String(input?.seed ?? "").trim();
  const seed = seedRaw === "" ? -1 : Number.parseInt(seedRaw, 10);
  return {
    model_type: modelType,
    prompt,
    resolution,
    num_inference_steps: steps,
    seed: Number.isFinite(seed) ? seed : -1,
  };
}

function writeJobSettings(input) {
  const { wanRoot, outputsPath } = getPaths();
  const settings = createGenerationSettings(input);
  const outputDir = ensureDir(String(input?.outputDir || outputsPath || path.join(wanRoot, "outputs")));
  const jobsDir = ensureDir(path.join(wanRoot, "desktop_jobs"));
  const jobId = `desktop_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
  const settingsPath = path.join(jobsDir, `${jobId}.json`);
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
  return { settings, outputDir, jobId, settingsPath };
}

async function generateVideo(input) {
  const { wanRoot, pythonPath, wgpPath, outputsPath } = getPaths();
  if (generationProcess) throw new Error("A generation is already running.");
  if (!fs.existsSync(pythonPath) || !fs.existsSync(wgpPath)) {
    throw new Error("Wan2GP is not built locally yet. Expected app/env/Scripts/python.exe and app/wgp.py.");
  }

  const { settings, outputDir, jobId, settingsPath } = writeJobSettings(input);

  currentJob = {
    id: jobId,
    prompt: settings.prompt,
    modelType: settings.model_type,
    resolution: settings.resolution,
    steps: settings.num_inference_steps,
    settingsPath,
    outputDir,
    status: "Starting",
    exitCode: null,
  };
  generationStartedAt = new Date().toISOString();
  logLines = [];
  appendLog(`Starting generation job ${jobId}`);
  appendLog(`Settings: ${settingsPath}`);
  appendLog(`Output: ${outputDir}`);

  generationProcess = spawn(pythonPath, [wgpPath, "--process", settingsPath, "--output-dir", outputDir], {
    cwd: wanRoot,
    env: { ...process.env, GRADIO_ANALYTICS_ENABLED: "False" },
    windowsHide: true,
  });
  currentJob.pid = generationProcess.pid;
  currentJob.status = "Running";

  generationProcess.stdout.on("data", (data) => {
    appendLog(data.toString(), "stdout");
    publishStatus();
  });
  generationProcess.stderr.on("data", (data) => {
    appendLog(data.toString(), "stderr");
    publishStatus();
  });
  generationProcess.on("error", (error) => {
    appendLog(error.message, "error");
    if (currentJob) currentJob.status = "Error";
    publishStatus();
  });
  generationProcess.on("exit", (code, signal) => {
    const stoppedBySignal = signal ? ` by ${signal}` : "";
    appendLog(`Generation stopped${stoppedBySignal}${code !== null ? ` with code ${code}` : ""}.`);
    if (currentJob) {
      currentJob.status = code === 0 ? "Completed" : signal ? "Cancelled" : "Failed";
      currentJob.exitCode = code;
      currentJob.finishedAt = new Date().toISOString();
    }
    generationProcess = null;
    generationStartedAt = null;
    publishStatus();
  });

  await publishStatus();
  return getStatus();
}

async function validateGeneration(input) {
  const { wanRoot, pythonPath, wgpPath } = getPaths();
  if (generationProcess) throw new Error("Wait for the current generation to finish before validating another prompt.");
  if (!fs.existsSync(pythonPath) || !fs.existsSync(wgpPath)) {
    throw new Error("Wan2GP is not built locally yet. Expected app/env/Scripts/python.exe and app/wgp.py.");
  }
  const { settingsPath, outputDir, jobId } = writeJobSettings(input);
  currentJob = {
    id: jobId,
    prompt: String(input?.prompt || "").trim(),
    modelType: String(input?.modelType || "t2v_sf"),
    resolution: String(input?.resolution || "832x480"),
    steps: Number.parseInt(input?.steps || "4", 10),
    settingsPath,
    outputDir,
    status: "Validating",
    exitCode: null,
  };
  generationStartedAt = new Date().toISOString();
  logLines = [];
  appendLog(`Validating generation settings ${jobId}`);
  appendLog(`Settings: ${settingsPath}`);

  generationProcess = spawn(pythonPath, [wgpPath, "--process", settingsPath, "--output-dir", outputDir, "--dry-run"], {
    cwd: wanRoot,
    env: { ...process.env, GRADIO_ANALYTICS_ENABLED: "False" },
    windowsHide: true,
  });
  currentJob.pid = generationProcess.pid;

  generationProcess.stdout.on("data", (data) => {
    appendLog(data.toString(), "stdout");
    publishStatus();
  });
  generationProcess.stderr.on("data", (data) => {
    appendLog(data.toString(), "stderr");
    publishStatus();
  });
  generationProcess.on("exit", (code, signal) => {
    appendLog(`Validation stopped${signal ? ` by ${signal}` : ""}${code !== null ? ` with code ${code}` : ""}.`);
    if (currentJob) {
      currentJob.status = code === 0 ? "Valid" : signal ? "Cancelled" : "Invalid";
      currentJob.exitCode = code;
      currentJob.finishedAt = new Date().toISOString();
    }
    generationProcess = null;
    generationStartedAt = null;
    publishStatus();
  });

  await publishStatus();
  return getStatus();
}

async function cancelGeneration() {
  if (!generationProcess) return getStatus();
  appendLog("Cancelling generation...");
  if (currentJob) currentJob.status = "Cancelling";
  generationProcess.kill("SIGINT");
  await publishStatus();
  return getStatus();
}

function detectGpu() {
  return new Promise((resolve) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-Command", "Get-CimInstance Win32_VideoController | Select-Object -First 1 -ExpandProperty Name"],
      { windowsHide: true },
      (_error, stdout) => resolve(String(stdout || "AMD GPU").trim() || "AMD GPU"),
    );
  });
}

ipcMain.handle("app:get-status", () => getStatus());
ipcMain.handle("app:start-server", () => startServer());
ipcMain.handle("app:stop-server", () => stopServer());
ipcMain.handle("app:clear-saved-queue", () => clearSavedQueue());
ipcMain.handle("app:list-outputs", () => listOutputs());
ipcMain.handle("app:generate-video", (_event, input) => generateVideo(input));
ipcMain.handle("app:validate-generation", (_event, input) => validateGeneration(input));
ipcMain.handle("app:cancel-generation", () => cancelGeneration());
ipcMain.handle("app:detect-gpu", () => detectGpu());
ipcMain.handle("app:open-url", (_event, url = currentUrl) => shell.openExternal(url));
ipcMain.handle("app:open-path", (_event, targetPath) => shell.openPath(targetPath));
ipcMain.handle("app:show-output-folder", () => {
  const { outputsPath } = getPaths();
  if (!fs.existsSync(outputsPath)) fs.mkdirSync(outputsPath, { recursive: true });
  return shell.openPath(outputsPath);
});
ipcMain.handle("app:choose-repo-root", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Choose your wan2gp-amd folder",
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const repoRoot = result.filePaths[0];
  writeConfig({ ...readConfig(), repoRoot });
  await publishStatus();
  return getStatus();
});
ipcMain.handle("app:choose-output-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, { properties: ["openDirectory", "createDirectory"] });
  return result.canceled ? null : result.filePaths[0];
});
ipcMain.handle("app:copy-prompt", (_event, prompt) => {
  clipboard.writeText(String(prompt || ""));
  return true;
});

function runLoggedCommand(command, args, cwd) {
  return new Promise((resolve) => {
    appendLog(`$ ${command} ${args.join(" ")}`);
    const child = spawn(command, args, { cwd, windowsHide: true, shell: false });
    child.stdout.on("data", (data) => appendLog(data.toString(), "stdout"));
    child.stderr.on("data", (data) => appendLog(data.toString(), "stderr"));
    child.on("error", (error) => {
      appendLog(error.message, "error");
      resolve({ ok: false, code: -1 });
    });
    child.on("exit", (code) => resolve({ ok: code === 0, code }));
  });
}

ipcMain.handle("app:update-local", async () => {
  if (updateState.busy) return updateState;
  updateState = { busy: true, message: "Updating local files..." };
  await publishStatus();
  const { repoRoot, wanRoot } = getPaths();
  try {
    if (!fs.existsSync(path.join(repoRoot, ".git"))) {
      throw new Error("The selected Wan2GP AMD folder is not a Git checkout.");
    }
    let result = await runLoggedCommand("git", ["pull"], repoRoot);
    if (!result.ok) throw new Error("Launcher update failed.");
    if (fs.existsSync(path.join(wanRoot, ".git"))) {
      result = await runLoggedCommand("git", ["pull"], wanRoot);
      if (!result.ok) throw new Error("Wan2GP update failed.");
    }
    const desktopRoot = path.join(repoRoot, "desktop");
    if (fs.existsSync(path.join(desktopRoot, "package.json"))) {
      result = await runLoggedCommand("npm.cmd", ["install"], desktopRoot);
      if (!result.ok) throw new Error("Desktop dependency refresh failed.");
    }
    updateState = { busy: false, message: "Local files are up to date." };
  } catch (error) {
    updateState = { busy: false, message: error.message };
    appendLog(error.message, "error");
  }
  await publishStatus();
  return updateState;
});

ipcMain.handle("app:check-app-update", async () => {
  if (!app.isPackaged) {
    updateState = { busy: false, message: "App release updates work after installing the packaged app." };
    await publishStatus();
    return updateState;
  }
  updateState = { busy: true, message: "Checking for app update..." };
  await publishStatus();
  try {
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {
    updateState = { busy: false, message: error.message };
    await publishStatus();
  }
  return updateState;
});

autoUpdater.on("checking-for-update", async () => {
  updateState = { busy: true, message: "Checking for app update..." };
  await publishStatus();
});
autoUpdater.on("update-available", async () => {
  updateState = { busy: true, message: "Downloading app update..." };
  await publishStatus();
});
autoUpdater.on("update-not-available", async () => {
  updateState = { busy: false, message: "Desktop app is up to date." };
  await publishStatus();
});
autoUpdater.on("update-downloaded", async () => {
  updateState = { busy: false, message: "App update downloaded. Restart to install." };
  await publishStatus();
});
autoUpdater.on("error", async (error) => {
  updateState = { busy: false, message: error.message };
  await publishStatus();
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("before-quit", () => {
  if (serverProcess) serverProcess.kill("SIGINT");
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
