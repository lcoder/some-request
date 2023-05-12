import * as React from 'react';
import { Card } from 'antd';
import styles from './index.module.less';

interface IProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
}

function Code(props: IProps): React.ReactElement {
  const {
    title,
    content,
    className = 'language-typescript',
  } = props;
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (
      ref.current
    ) {
      // @ts-ignore
      window.hljs.highlightElement(ref.current);
    }
  },
  [content]);

  return (
    <Card
      className={styles.code}
      title={title}
    >
      <pre>
        <code
          ref={ref}
          className={className}
        >
          {content}
        </code>
      </pre>
    </Card>
  );
}

export default Code;
