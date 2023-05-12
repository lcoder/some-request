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
        title="针对幂等的请求，相等请求，直接使用缓存。相等，意味着，http方法，url地址，查询参数,body相同"
        content={content}
      />
    </div>
  );
}

export default Normal;
