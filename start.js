module.exports = async (kernel) => {
  let port = await kernel.port()
  // Windows exposes the Ryzen integrated Radeon (e.g. gfx1036) next to the
  // dedicated Radeon. The ROCm wheel is built for the dedicated GPU's gfx
  // target only, and while both devices are visible the dedicated GPU's own
  // kernels fail to load (hipErrorInvalidImage / hipErrorInvalidKernelFile).
  // Restrict HIP to the device whose gfx target the installed torch was
  // built for, so the iGPU stays available for display.
  const isWin = kernel.platform === "win32"
  const env = {
    SERVER_NAME: "127.0.0.1",
    SERVER_PORT: port,
    MIOPEN_FIND_MODE: "2"
  }
  if (isWin) {
    env.HIP_VISIBLE_DEVICES = "{{local.hip_visible_devices}}"
  }
  return {
    requires: {
      bundle: "ai",
    },
    daemon: true,
    run: [
      ...(isWin ? [{
        method: "shell.run",
        params: {
          venv: "env",
          path: "app",
          message: [
            "python -c \"import torch;al=torch.cuda.get_arch_list();d=[i for i in range(torch.cuda.device_count()) if torch.cuda.get_device_properties(i).gcnArchName in al];print('PINOKIO_GPU_INDEX='+str(d[0] if d else 0))\""
          ],
          on: [{
            "event": "/PINOKIO_GPU_INDEX=(\\d+)/",
            "done": true
          }]
        }
      }, {
        method: "local.set",
        params: {
          hip_visible_devices: "{{input.event[1]}}"
        }
      }] : []),
      {
        method: "shell.run",
        params: {
          venv: "env",
          env: env,
          path: "app",
          message: [
            "python wgp.py --multiple-images --advanced"
          ],
          on: [{
            "event": "/http:\/\/[0-9.:]+/",   
            "done": true
          }]
        }
      },
      {
        method: "local.set",
        params: {
          url: "{{input.event[0]}}"
        }
      }
    ]
  }
}
