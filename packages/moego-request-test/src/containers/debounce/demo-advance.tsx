import * as React from 'react';
import { Button, Row, Col } from 'antd';
import { useEventCallback } from 'rxjs-hooks';
import { get } from '@/services';
import { switchMap, map, debounceTime } from 'rxjs';

interface Response {
  response: Object
}

function Demo(): React.ReactElement | null {

  const [click, result] = useEventCallback((event$) => {
    return event$.pipe(
      debounceTime(500),
      switchMap(() => get<Response>('/user/name?delay=1500')),
      map((res) => res.response),
    )
  }, null);
  
  console.log('去除抖动, rxjs-hooks版', result);

  return (
    <Row
      gutter={16}
    >
      <Col
        style={{ width: 500 }}
      >
        <Button
          onClick={click}
        >debounce点击获取数据</Button>
      </Col>
    </Row>
  );
}

export default Demo;
