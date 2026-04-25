module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        chain: true,
        message: [
          "echo '--- PINOKIO GPU DEBUG ---'",
          "echo 'Platform: {{platform}}'",
          "echo 'Detected GPU Type: {{gpu}}'",
          "echo 'GPU Model String: {{kernel.gpu_model}}'",
          "echo '-------------------------------------------'",
          "echo 'Please show this message in Pinokio-support'",
          "echo '-------------------------------------------'"
        ]
      }
    },
    {
      method: "notify",
      params: {
        html: "<b>GPU Model:</b> {{kernel.gpu_model}}<br><b>GPU Type:</b> {{gpu}}"
      }
    }
  ]
}