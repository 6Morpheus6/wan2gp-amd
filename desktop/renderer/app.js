const api = window.wanDesktop;

const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 10 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06A2 2 0 1 1 7.22 3.4l.06.06A1.7 1.7 0 0 0 9 4.6c.4-.09.74-.29 1-.6.27-.31.4-.7.4-1.1V3a2 2 0 1 1 4 0v.09c0 .4.13.79.4 1.1.26.31.6.51 1 .6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.09.4.29.74.6 1 .31.27.7.4 1.1.4H21a2 2 0 1 1 0 4h-.09c-.4 0-.79.13-1.1.4-.31.26-.51.6-.6 1Z"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="7" rx="1"/><rect x="3" y="13" width="18" height="7" rx="1"/><path d="M7 8h.01M7 17h.01"/></svg>',
  gpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="6" width="13" height="10" rx="2"/><path d="M17 10h3v2h-3M8 20v-4M14 20v-4M8 4V2M14 4V2"/><circle cx="10.5" cy="11" r="2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2c2.5 2.7 4 6.1 4 10s-1.5 7.3-4 10c-2.5-2.7-4-6.1-4-10s1.5-7.3 4-10Z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12A9 9 0 0 1 18.5 5.8"/><path d="M18 2v4h4M6 22v-4H2"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 2-9 13h8l-1 7 9-13h-8l1-7Z"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
};

const webUiUrl = "http://localhost:7860";

for (const node of document.querySelectorAll("[data-icon]")) {
  node.innerHTML = icons[node.dataset.icon] || "";
}

const els = {
  sideStatus: document.getElementById("sideStatus"),
  serverUrl: document.getElementById("serverUrl"),
  gpuName: document.getElementById("gpuName"),
  envStatus: document.getElementById("envStatus"),
  portStatus: document.getElementById("portStatus"),
  runBadge: document.getElementById("runBadge"),
  uptime: document.getElementById("uptime"),
  pid: document.getElementById("pid"),
  startStopBtn: document.getElementById("startStopBtn"),
  openUiBtn: document.getElementById("openUiBtn"),
  terminal: document.getElementById("terminal"),
  prompt: document.getElementById("prompt"),
  promptCount: document.getElementById("promptCount"),
  outputFolder: document.getElementById("outputFolder"),
  seed: document.getElementById("seed"),
  model: document.getElementById("model"),
  resolution: document.getElementById("resolution"),
  steps: document.getElementById("steps"),
  folderBtn: document.getElementById("folderBtn"),
  copyOpenBtn: document.getElementById("copyOpenBtn"),
  validateBtn: document.getElementById("validateBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  refreshOutputsBtn: document.getElementById("refreshOutputsBtn"),
  outputsBody: document.getElementById("outputsBody"),
  webview: document.getElementById("webview"),
  webEmpty: document.getElementById("webEmpty"),
  webUiStatus: document.getElementById("webUiStatus"),
  startServerBtn: document.getElementById("startServerBtn"),
  stopServerBtn: document.getElementById("stopServerBtn"),
  reloadWebBtn: document.getElementById("reloadWebBtn"),
  clearQueueBtn: document.getElementById("clearQueueBtn"),
  openBrowserBtn: document.getElementById("openBrowserBtn"),
  repoRoot: document.getElementById("repoRoot"),
  chooseRepoBtn: document.getElementById("chooseRepoBtn"),
  updateLocalBtn: document.getElementById("updateLocalBtn"),
  checkAppUpdateBtn: document.getElementById("checkAppUpdateBtn"),
  openRepoBtn: document.getElementById("openRepoBtn"),
  updateMessage: document.getElementById("updateMessage"),
};

let state = null;
let webviewLoaded = false;

function formatDuration(startedAt) {
  if (!startedAt) return "--:--:--";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let index = 0;
  while (size > 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function renderStatus(next) {
  state = next;
  els.serverUrl.textContent = next.wanRoot || "";
  els.envStatus.textContent = next.envReady ? "Ready" : "Missing local build";
  els.portStatus.textContent = next.generation?.running ? "Job active" : "Ready";
  els.sideStatus.textContent = next.envReady ? "Environment Ready" : "Setup Needed";
  els.outputFolder.value = next.outputsPath || "";
  els.repoRoot.value = next.repoRoot || "";
  els.updateMessage.textContent = next.updateState?.message || "Ready";
  const busy = Boolean(next.updateState?.busy);
  els.updateLocalBtn.disabled = busy;
  els.checkAppUpdateBtn.disabled = busy;
  const generation = next.generation || {};
  const jobStatus = generation.job?.status || (generation.running ? "Running" : "Idle");
  els.runBadge.textContent = jobStatus;
  els.runBadge.className = `badge ${generation.running ? "" : "stopped"}`;
  els.pid.textContent = generation.pid || "Not running";
  els.uptime.textContent = formatDuration(generation.startedAt);
  els.startStopBtn.disabled = !generation.running;
  els.copyOpenBtn.disabled = generation.running || !next.envReady;
  els.validateBtn.disabled = generation.running || !next.envReady;
  els.startStopBtn.innerHTML = `${icons.stop}<span>Cancel Job</span>`;
  const serverRunning = Boolean(next.running);
  els.startServerBtn.disabled = serverRunning || !next.envReady;
  els.stopServerBtn.disabled = !next.managed;
  els.reloadWebBtn.disabled = !serverRunning;
  els.openBrowserBtn.disabled = !serverRunning;
  els.webUiStatus.textContent = serverRunning
    ? next.externalRunning
      ? "Using the existing WanGP server on localhost:7860."
      : "WanGP server is running inside the desktop app."
    : "Start the local server to use every model, preset, plugin, and configuration.";
  if (serverRunning) loadWebUi();
  else showWebPlaceholder();
  renderLogs(next.logLines || []);
}

function loadWebUi() {
  if (!els.webview || webviewLoaded) return;
  els.webview.src = webUiUrl;
  webviewLoaded = true;
  els.webview.classList.add("loaded");
  els.webEmpty.classList.add("section-hidden");
}

function showWebPlaceholder() {
  webviewLoaded = false;
  if (els.webview) {
    els.webview.src = "about:blank";
    els.webview.classList.remove("loaded");
  }
  els.webEmpty.classList.remove("section-hidden");
}

function reloadWebUi() {
  if (!els.webview) return;
  if (!webviewLoaded) {
    loadWebUi();
    return;
  }
  els.webview.reload();
}

function renderLogs(lines) {
  if (!lines.length) {
    els.terminal.innerHTML = "<p><span>ready</span> Waiting for generator output...</p>";
    return;
  }
  els.terminal.innerHTML = lines
    .slice(-80)
    .map((line) => `<p><span>${line.time}</span>${escapeHtml(line.text)}</p>`)
    .join("");
  els.terminal.scrollTop = els.terminal.scrollHeight;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function refreshOutputs() {
  const outputs = await api.listOutputs();
  if (!outputs.length) {
    els.outputsBody.innerHTML = '<tr><td colspan="6" class="empty">No outputs found yet.</td></tr>';
    return;
  }
  els.outputsBody.innerHTML = outputs
    .map((file) => {
      const modified = new Date(file.modifiedAt).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return `<tr>
        <td>${escapeHtml(file.name)}</td>
        <td>${escapeHtml(file.type)}</td>
        <td>${modified}</td>
        <td>${formatSize(file.size)}</td>
        <td class="path-cell" title="${escapeHtml(file.path)}">${escapeHtml(file.path)}</td>
        <td><button class="file-button" data-open-path="${escapeHtml(file.path)}">Open</button></td>
      </tr>`;
    })
    .join("");
}

async function refreshStatus() {
  renderStatus(await api.getStatus());
  await refreshOutputs();
}

els.startStopBtn.addEventListener("click", async () => {
  try {
    renderStatus(await api.cancelGeneration());
  } catch (error) {
    alert(error.message);
  }
});

els.startServerBtn.addEventListener("click", async () => {
  try {
    renderStatus(await api.startServer());
    loadWebUi();
  } catch (error) {
    alert(error.message);
  }
});

els.stopServerBtn.addEventListener("click", async () => {
  try {
    renderStatus(await api.stopServer());
  } catch (error) {
    alert(error.message);
  }
});

els.reloadWebBtn.addEventListener("click", reloadWebUi);
els.openBrowserBtn.addEventListener("click", () => api.openUrl(webUiUrl));
els.clearQueueBtn.addEventListener("click", async () => {
  try {
    const result = await api.clearSavedQueue();
    els.webUiStatus.textContent = result.message;
    await refreshStatus();
  } catch (error) {
    alert(error.message);
  }
});

els.openUiBtn.addEventListener("click", async () => {
  await api.showOutputFolder();
});

els.refreshBtn.addEventListener("click", refreshStatus);
els.refreshOutputsBtn.addEventListener("click", refreshOutputs);
els.folderBtn.addEventListener("click", () => api.showOutputFolder());

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
  });
});

function setView(view) {
  const viewTargets = {
    web: "webSection",
    control: "controlSection",
    models: "modelsSection",
    jobs: "outputsSection",
    settings: "settingsSection",
  };
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });
  for (const targetId of Object.values(viewTargets)) {
    document.getElementById(targetId)?.classList.add("section-hidden");
  }
  document.getElementById(viewTargets[view] || "controlSection")?.classList.remove("section-hidden");
  document.querySelector(".workspace")?.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".model-card").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".model-card").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    els.model.value = button.dataset.model;
    els.steps.value = button.dataset.steps;
    els.resolution.value = button.dataset.resolution;
    setView("control");
  });
});

els.chooseRepoBtn.addEventListener("click", async () => {
  const updated = await api.chooseRepoRoot();
  if (updated) renderStatus(updated);
  await refreshOutputs();
});
els.updateLocalBtn.addEventListener("click", async () => {
  await api.updateLocal();
  await refreshStatus();
});
els.checkAppUpdateBtn.addEventListener("click", async () => {
  await api.checkAppUpdate();
  await refreshStatus();
});
els.openRepoBtn.addEventListener("click", () => {
  if (state?.repoRoot) api.openPath(state.repoRoot);
});

els.prompt.addEventListener("input", () => {
  els.promptCount.textContent = `${els.prompt.value.length} / 2000`;
});

els.copyOpenBtn.addEventListener("click", async () => {
  try {
    renderStatus(await api.generateVideo({
      prompt: els.prompt.value,
      modelType: els.model.value,
      resolution: els.resolution.value,
      steps: els.steps.value,
      seed: els.seed.value,
      outputDir: els.outputFolder.value,
    }));
  } catch (error) {
    alert(error.message);
  }
});

els.validateBtn.addEventListener("click", async () => {
  try {
    renderStatus(await api.validateGeneration({
      prompt: els.prompt.value,
      modelType: els.model.value,
      resolution: els.resolution.value,
      steps: els.steps.value,
      seed: els.seed.value,
      outputDir: els.outputFolder.value,
    }));
  } catch (error) {
    alert(error.message);
  }
});

els.outputsBody.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-open-path]");
  if (button) {
    await api.openPath(button.dataset.openPath);
  }
});

api.onStatus(renderStatus);
api.onLogs(renderLogs);

setInterval(() => {
  if (state) {
    els.uptime.textContent = formatDuration(state.startedAt);
  }
}, 1000);

api.detectGpu().then((name) => {
  els.gpuName.textContent = name;
});

setView("web");
refreshStatus();
