// @ts-ignore
import content from '!!raw-loader!./demo.tsx';
// @ts-ignore
import contentRegister from '!!raw-loader!@/services/index';
import Code from '@/component/code';
import Demo from './demo';

function Normal() {
  return (
    <div className="App">
      <Code
        title="插件注册"
        content={contentRegister}
      />
      <Demo />
      <Code
        title="查看请求header"
        content={content}
      />
    </div>
  );
}

export default Normal;
