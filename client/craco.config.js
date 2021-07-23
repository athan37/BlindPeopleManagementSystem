const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              '@primary-color': '#4650DD',
              '@border-radius-base': '0.25rem',
              '@font-family' : '"Public Sans", sans-serif',
              '@font-size-base': '16px',
              '@divider-color': 'rgba(255, 255, 255, 6%)'
             },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};