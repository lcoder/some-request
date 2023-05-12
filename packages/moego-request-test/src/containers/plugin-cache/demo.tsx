import * as React from 'react';
import { Button } from 'antd';
import { get } from '@/services';

function Demo(): React.ReactElement | null {

  return (
    <div>
      <Button
        onClick={() => {
          get<number>(
            '/user/name?userId=1',
            {
              // 是否需要缓存
              cache: true,
              // 最大缓存时间， 默认值3s
              cacheMaxAge: 10 * 1000, // 10秒
              // 是否需要clone返回类型，仅限返回值是json类型
              cloneResponse: true,
            }
          )
            .subscribe({
              next: (val) => console.log('返回MeogoRequest封装过的响应值', val),
              error: console.log,
              complete: console.log,
            });
        }}
      >发送get请求</Button>
    </div>
  );
}

export default Demo;
