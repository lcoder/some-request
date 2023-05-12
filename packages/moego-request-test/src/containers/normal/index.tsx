// @ts-ignore
import content from '!!raw-loader!./demo.tsx';
import Code from '@/component/code';
import Demo from './demo';

function Normal() {
  return (
    <div className="App">
      <Demo />
      <Code
        title="第一个参数url，第二个参数，配置项（查询参数，body请求参数）等"
        content={content}
      />
    </div>
  );
}

export default Normal;
