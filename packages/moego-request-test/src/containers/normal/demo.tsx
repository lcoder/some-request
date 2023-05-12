import * as React from 'react';
import { get } from '@/services';

function Demo(): React.ReactElement | null {

  React.useEffect(() => {
    get<number>(
      '/user/name?userId=1',
      {
        query: {
          field: 'name'
        },
        headers: {
          'app': 'ops-flow'
        },
      },
    )
      .subscribe({
        next: (val) => console.log('返回MeogoRequest封装过的响应值', val),
        error: console.log,
        complete: console.log,
      });
  },
  []);

  return null;
}

export default Demo;
