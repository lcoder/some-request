import * as React from 'react';
import { get } from '@/services';
import { ExcepType } from '@moego/moego-request-plugin-awesome';
import { Row, Col, Button } from 'antd';

function Demo(): React.ReactElement | null {

  return (
    <Row
      gutter={32}
    >
      <Col>
        <Button
          onClick={() => {
            get<number>(
              '/user/login?status=401&message=未登录',
              {
                exception: ExcepType.crash,
              }
            )
              .subscribe({
                next: (val) => console.log('返回MeogoRequest封装过的响应值', val),
                error: (err) => console.log('error', err),
                complete: console.log,
              });
          }}
        >401 页面crash</Button>
      </Col>
      <Col>
        <Button
          onClick={() => {
            get<number>(
              '/user/login?status=403&message=数据库异常',
              {
                exception: ExcepType.silence,
              }
            )
              .subscribe({
                next: (val) => console.log('返回MeogoRequest封装过的响应值', val),
                error: (err) => console.log('error', err),
                complete: console.log,
              });
          }}
        >403 页面静默，不成功，不异常</Button>
      </Col>
      <Col>
        <Button
          onClick={() => {
            get<number>(
              '/user/login?status=503&message=服务暂不可用',
              {
                exception: ExcepType.message,
              }
            )
              .subscribe({
                next: (val) => console.log('返回MeogoRequest封装过的响应值', val),
                error: (err) => console.log('error', err),
                complete: console.log,
              });
          }}
        >503 信息提示</Button>
      </Col>
      <Col>
        <Button
          onClick={() => {
            get<number>(
              '/user/login?status=500&message=数据库异常',
              {
                exception: ExcepType.ignore,
              }
            )
              .subscribe({
                next: (val) => console.log('返回MeogoRequest封装过的响应值', val),
                error: (err) => console.log('业务的错误，想不走统一处理，可以设置exception: ExcepType.ignore', err),
                complete: console.log,
              });
          }}
        >500 忽略错误，特定业务自信处理异常</Button>
      </Col>
    </Row>
  );
}

export default Demo;
