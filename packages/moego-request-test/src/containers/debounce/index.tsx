// @ts-ignore
import content from '!!raw-loader!./demo.tsx';
// @ts-ignore
import contentAdvance from '!!raw-loader!./demo-advance.tsx';
import Code from '@/component/code';
import Demo from './demo';
import DemoAdvance from './demo-advance';


function Debounce() {
  return (
    <div className="App">
      <Demo />
      <Code
        title="去除抖动"
        content={content}
      />
      <DemoAdvance />
      <Code
        title="去除抖动, rxjs-hooks版"
        content={contentAdvance}
      />
    </div>
  );
}

export default Debounce;
