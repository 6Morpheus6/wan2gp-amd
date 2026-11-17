module.exports = {
  run: [{
    method: "shell.run",
    params: {
      message: "git pull"
    }
  }, {
    method: "shell.run",
    params: {
      path: "app",
      message: "git pull"
    }
  }, {
    method: "script.start",
    params: {
      uri: "torch.js",
      params: {
        venv_python: "3.11",
        venv: "env",
        path: "app",
      }
    }
  }, {
    method: "shell.run",
    params: {
      venv: "env",
      path: "app",
      message: [
        "uv pip install -r requirements.txt --index-strategy unsafe-best-match",
        "uv pip install hf-xet setuptools numpy==1.26.4"
      ]
    }
  }]
}
