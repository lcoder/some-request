import * as React from 'react';
import { Row, Col } from 'antd';
import SiderBar from './side-bar';
import { renderRoutes, RouteConfig } from 'react-router-config';
import styles from './index.module.less';

interface IProps {
  route?: RouteConfig;
}

function Root(props: IProps): React.ReactElement {
  const {
    route,
  } = props;
  return (
    <Row
      className={styles.row}
    >
      <Col
        className={styles.col}
      >
        <SiderBar
          style={{ width: 150 }}
        />
      </Col>
      <Col
        className={styles.col + ' ' + styles.main}
      >
        {renderRoutes(route?.routes)}
      </Col>
    </Row>
  );
}

export default Root;
