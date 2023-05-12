import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import routes from '../../routes';

interface IProps {
  style?: React.CSSProperties;
}

function SiderBar(props: IProps): React.ReactElement {
  const { style } = props;
  const history = useHistory();
  const { pathname } = useLocation();
  const [selected, setSelected] = React.useState(pathname);
  return (
    <Menu
      style={style}
      selectedKeys={selected ? [selected] : []}
      onSelect={({key}) => {
        history.push(key);
        setSelected(key);
      }}
    >
      {
        (
          routes[0]?.routes ?? []
        )
        .filter((i) => !!i.label)
        .map((item) => {
          return (
            <Menu.Item
              key={item.path as string}
            >
              {item.label}
            </Menu.Item>
          )
        })
      }
    </Menu>
  );
}

export default SiderBar;
