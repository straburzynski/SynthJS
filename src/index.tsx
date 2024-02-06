import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot, Root } from 'react-dom/client';

const container: HTMLElement = document.getElementById('root')!;
const root: Root = createRoot(container);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
