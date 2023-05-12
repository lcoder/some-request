import * as React from 'react';
import { Button, Space } from 'antd';
import { get } from '@/services';
import { debounceTime, Subject, switchMap } from 'rxjs';

interface Response {
  response: Object
}

function Demo(): React.ReactElement | null {

  const ref = React.useRef(new Subject());
  
  React.useEffect(() => {
    ref.current.pipe(
      debounceTime(500),
      switchMap(() => get<Response>('/user/name?delay=1500'))
    ).subscribe({
      next: (val) => {
        console.log('返回值', val);
      },
      error: console.log,
    })
  },
  [])

  return (
    <Space>
      <Button
        onClick={() => {
          get<Response>('/user/name?delay=1500')
            .subscribe({
              next: (val) => {
                console.log('返回值', val);
              },
              error: console.log,
              complete: console.log,
            })
        }}
      >点击获取数据</Button>
      <Button
        onClick={(e) => ref.current.next(e)}
      >debounce点击获取数据</Button>
    </Space>
  );
}

export default Demo;
