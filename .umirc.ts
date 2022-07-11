import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      component: '@/layouts/index',
      routes: [
        { path: '/', redirect: '/graphin', exact: true },
        { path: '/graphin', component: '@/pages/graphin/index' },
        { path: '/list', component: '@/pages/list/index' },
      ],
    },
  ],
  fastRefresh: {},
  locale: {
    // default
    default: 'en-US',
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
});
