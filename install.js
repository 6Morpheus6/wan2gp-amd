module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/deepbeepmeep/Wan2GP app"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "powershell -Command \"(Get-Content models/wan/any2video.py) -replace 'from .distributed.fsdp import shard_model', '# from .distributed.fsdp import shard_model' | Set-Content models/wan/any2video.py\""
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv_python: "3.11",
          venv: "env",
          path: "app",
        }
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install -r requirements.txt",
          "uv pip install hf-xet setuptools numpy==1.26.4"
        ]
      }
    }
  ]
}
