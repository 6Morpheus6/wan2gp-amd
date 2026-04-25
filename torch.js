module.exports = {
  run: [
    // windows amd gfx 103X (RDNA 2)
    {
      "when": "{{platform === 'win32' && gpu === 'amd' && kernel.gpu_model && /6\\d{3}/i.test(kernel.gpu_model)}}",
      "method": "shell.run",
      "params": {
        "bluefairy": "off",
        "env": { "UV_SKIP_WHEEL_FILENAME_CHECK": "1" },
        "venv_python": "{{args && args.venv_python ? args.venv_python : null}}",
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install --pre torch torchvision torchaudio --index-url https://rocm.nightlies.amd.com/v2-staging/gfx103X-dgpu"
      },
      "next": null
    },
    // windows amd gfx 110X (RDNA 3)
    {
      "when": "{{platform === 'win32' && gpu === 'amd' && kernel.gpu_model && /[78]\\d{3}|7\\d0M|8\\d0M/i.test(kernel.gpu_model)}}",
      "method": "shell.run",
      "params": {
        "bluefairy": "off",
        "env": { "UV_SKIP_WHEEL_FILENAME_CHECK": "1" },
        "venv_python": "{{args && args.venv_python ? args.venv_python : null}}",
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install --pre torch torchvision torchaudio --index-url https://rocm.nightlies.amd.com/v2-staging/gfx110X-all"
      },
      "next": null
    },
    // windows amd gfx 1150 (Strix Halo)
    {
      "when": "{{platform === 'win32' && gpu === 'amd' && kernel.gpu_model && /gfx1150|Ryzen AI Max/i.test(kernel.gpu_model)}}",
      "method": "shell.run",
      "params": {
        "bluefairy": "off",
        "env": { "UV_SKIP_WHEEL_FILENAME_CHECK": "1" },
        "venv_python": "{{args && args.venv_python ? args.venv_python : null}}",
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install --pre torch torchvision torchaudio --index-url https://rocm.nightlies.amd.com/v2-staging/gfx1150"
      },
      "next": null
    },
    // windows amd gfx 1151 (Strix Point)
    {
      "when": "{{platform === 'win32' && gpu === 'amd' && kernel.gpu_model && /gfx1151|8[89]0M/i.test(kernel.gpu_model)}}",
      "method": "shell.run",
      "params": {
        "bluefairy": "off",
        "env": { "UV_SKIP_WHEEL_FILENAME_CHECK": "1" },
        "venv_python": "{{args && args.venv_python ? args.venv_python : null}}",
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install --pre torch torchvision torchaudio --index-url https://rocm.nightlies.amd.com/v2-staging/gfx1151"
      },
      "next": null
    },
    // windows amd gfx 120X (RDNA 4)
    {
      "when": "{{platform === 'win32' && gpu === 'amd' && kernel.gpu_model && /9\\d{3}/i.test(kernel.gpu_model)}}",
      "method": "shell.run",
      "params": {
        "bluefairy": "off",
        "env": { "UV_SKIP_WHEEL_FILENAME_CHECK": "1" },
        "venv_python": "{{args && args.venv_python ? args.venv_python : null}}",
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install --pre torch torchvision torchaudio --index-url https://rocm.nightlies.amd.com/v2-staging/gfx120X-all"
      },
      "next": null
    },
    // linux rocm (amd)
    {
      "when": "{{platform === 'linux' && gpu === 'amd'}}",
      "method": "shell.run",
      "params": {
        "bluefairy": "off",
        "venv_python": "{{args && args.venv_python ? args.venv_python : null}}",
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/rocm6.3"
      }
    }
  ]
}
