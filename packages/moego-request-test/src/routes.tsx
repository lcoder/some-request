import { Redirect } from 'react-router-dom';
import { RouteConfig } from 'react-router-config';
import Root from './containers/root';
import Normal from '@/containers/normal';
import Debounce from '@/containers/debounce';
import Cancelable from '@/containers/cancelable'
import PluginSc from '@/containers/plugin-sc';
import PluginCache from '@/containers/plugin-cache';
import PluginAmesome from '@/containers/plugin-awesome';
import PluginHot from '@/containers/plugin-hot';


const routes: RouteConfig[] = [
  {
    component: Root,
    routes: [
      {
        path: "/normal",
        exact: true,
        label: '基本用法',
        component: Normal
      },
      {
        path: "/cancel",
        exact: true,
        label: '可以取消',
        component: Cancelable
      },
      {
        path: "/debounce",
        exact: true,
        label: 'debounce节流',
        component: Debounce
      },
      {
        path: "/plugin-sc",
        exact: true,
        label: 'plugin-sc',
        component: PluginSc,
      },
      {
        path: "/plugin-cache",
        exact: true,
        label: 'plugin-cache',
        component: PluginCache,
      },
      {
        path: "/plugin-awesome",
        exact: true,
        label: 'plugin-awesome',
        component: PluginAmesome,
      },
      {
        path: "/plugin-hot",
        exact: true,
        label: 'plugin-hot',
        component: PluginHot,
      },
      {
        path: '*',
        render: () => <Redirect to="/normal" />,
      },
    ]
  }
];

export default routes;
