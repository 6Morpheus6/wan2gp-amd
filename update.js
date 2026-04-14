module.exports = {
  run: [{
    method: "shell.run",
    params: {
      message: "git pull"
    }
  }, {
    method: "fs.rm",
    params: {
      path: "app/models/wan/any2video.py",
    }
  }, {
    method: "shell.run",
    params: {
      path: "app",
      message: "git pull"
    }
  }, {
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "powershell -Command \"(Get-Content models/wan/any2video.py) -replace 'from .distributed.fsdp import shard_model', '# from .distributed.fsdp import shard_model' | Set-Content models/wan/any2video.py\""
        ]
      }
    }]
}
