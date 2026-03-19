declare module 'virtual:techradar/config' {
  const config: import('./config').ResolvedConfig;
  export default config;
}

declare module 'virtual:techradar/theme' {
  const css: string;
  export default css;
}