import './App.less';
import { HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routes';

function App() {
  return (
    <HashRouter>
      <div className="App">
        {
          renderRoutes(routes)
        }
      </div>
    </HashRouter>
  );
}

export default App;
