const { ComposeMethod, composePlugins, withNx } = require('@nx/webpack');

// Exporta la configuración usando el plugin de Nx para NestJS
module.exports = composePlugins(withNx(), (config) => {
  // Aquí puedes personalizar la configuración si fuera necesario
  return config;
});