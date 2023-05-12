// @ts-ignore
import content from '!!raw-loader!./demo.tsx';
import Demo from './demo';
import Code from '@/component/code';

function Normal() {
  return (
    <div className="App">
      <Code
        title="插件可以热插拔"
        className="language-plaintext"
        content="运行时，可以添加插件，或者适当时机，卸载插件"
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
