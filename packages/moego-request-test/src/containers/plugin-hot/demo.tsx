import * as React from 'react';
import { Button, Checkbox } from 'antd';
import { get, bq } from '@/services';
import { AjaxResponse, MoegoPlugin, ReqConfig } from '@moego/moego-request-core';


class PluginAddHelloWorld implements MoegoPlugin {
  pre(config: ReqConfig) {
    Object.assign(config.headers, {
      'app-custom-name': 'hello world',
    });
    return config;
  }
}

function Demo(): React.ReactElement | null {

  const [enable, setEnable] = React.useState(false);

  React.useEffect(() => {
    if (enable) {
      bq.use([PluginAddHelloWorld]);
    } else {
      bq.uninstall(PluginAddHelloWorld);
    }
  },
  [enable]);

  return (
    <>
      <Checkbox
        checked={enable}
        onChange={(val) => {
          setEnable(val.target.checked);
        }}
      >启用请求头插件</Checkbox>
      <Button
        onClick={() => {
          get<AjaxResponse<any>>(
            '/user/name',
          )
            .subscribe({
              next: (val) => console.log('请求头', val.request.headers),
              error: (err) => console.log('error', err),
              complete: console.log,
            });
        }}
      >发送请求，打开控制台，查看headers</Button>
    </>
  );
}

export default Demo;
