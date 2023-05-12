import { MeogoRequest } from '@moego/moego-request-core';
import { Empty, Button, message } from 'antd';
import ReactDOM from 'react-dom';
import { MeogoRequestPluginSc } from '@moego/moego-request-plugin-sc';
import { MeogoRequestPluginCache, CacheReqConfig } from '@moego/moego-request-plugin-cache';
import { MeogoRequestPluginAwesome, AwesomeReqConfig } from '@moego/moego-request-plugin-awesome';

export const bq = new MeogoRequest<CacheReqConfig & AwesomeReqConfig>({
  plugins: [
    [MeogoRequestPluginSc, 'abc-sc12'],
    [MeogoRequestPluginCache, { cloneResponse: false }],
    [MeogoRequestPluginAwesome, {
      onMessage: (resErr: any) => {
        message.error(resErr.message);
      },
      onCrash: (resErr: any) => {
        const { code, message } = resErr;
        const msg = `错误码: ${code}；错误信息：${message}`;
        ReactDOM.render(
          <Empty
            image="https://img01.yzcdn.cn/upload_files/2021/11/03/Fk2UrQ7b4skDifyHswLF9vVLXXk3.png"
            imageStyle={{
              textAlign: 'center',
              height: 294,
            }}
            description={
              <span>
                {msg}
              </span>
            }
          >
            <Button type="primary">点击登录</Button>
          </Empty>,
          document.getElementById('root')
        );
      }
    }]
  ]
});

export const { get, post } = bq;
