// @ts-ignore
import content from '!!raw-loader!./demo.tsx';
import { Typography } from 'antd';
import Code from '@/component/code';
import Demo from './demo';

const { Paragraph, Link } = Typography;

function Normal() {
  return (
    <div className="App">
      <Code
        title="常见的错误"
        className="language-plaintext"
        content={`Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
at MountComponent (http://localhost:3000/static/js/main.chunk.js:2657:71)
at div`}
      />

      <Typography>
        <Paragraph>常见处理取消异步的方案：</Paragraph>
        <ul>
          <li>
            <Link href="https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html">isMounted is an Antipattern</Link>
          </li>
          <li>
            <Link href="https://go.moego.pet">source.cancel();</Link>
          </li>
        </ul>
      </Typography>

      <Demo />

      <Code
        title="可以取消订阅"
        content={content}
      />
    </div>
  );
}

export default Normal;
