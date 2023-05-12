import * as React from 'react';
import { Button, Row, Col } from 'antd';
import { get } from '@/services';

interface Response {
  response: Object
}

function MountComponent ({ cancelable }: { cancelable?: boolean }) {
  const [res, setRes] = React.useState<undefined|Response>(undefined);

  React.useEffect(() => {
    const subscription = get<Response>('/user/name?delay=1500', {  })
      .subscribe({
        next: (val) => {
          setRes(val);
        },
        error: console.log,
      });
    return cancelable ? () => subscription.unsubscribe() : undefined;
  },
  [cancelable]);
  return (
    <div>
      返回的内容：{res?.response ? JSON.stringify(res.response) : undefined}
    </div>
  )
}

function Demo(): React.ReactElement | null {
  const [visible, toggleVisible] = React.useState(false);
  const [visible2, toggleVisible2] = React.useState(false);

  return (
    <Row
      gutter={16}
    >
      <Col
        style={{ width: 500 }}
      >
        <Button
          onClick={() => toggleVisible((p) => !p)}
        >{`${visible ? '卸载' : '显示'}1,cancelable=false`}</Button>
        {
          visible ? (
            <div>
              加载MountComponent1
              <MountComponent
                cancelable={false}
              />
            </div>
          ) : (
            null
          )
        }
      </Col>

      <Col
        style={{ width: 500 }}
      >
        <Button
          onClick={() => toggleVisible2((p) => !p)}
        >{`${visible2 ? '卸载' : '显示'}2,cancelable=true`}</Button>
        {
          visible2 ? (
            <div>
              加载MountComponent2
              <MountComponent
                cancelable
              />
            </div>
          ) : (
            null
          )
        }
      </Col>
    </Row>
  );
}

export default Demo;
