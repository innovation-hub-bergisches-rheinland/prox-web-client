module.exports = {
  bumpFiles: [
    {
      filename: './deploy/charts/prox-web-client/Chart.yaml',
      updater:
        './node_modules/@map-colonies/standard-version-update-helm-version/src/index.js'
    },
    {
      filename: 'package.json',
      type: 'json'
    }
  ]
};
