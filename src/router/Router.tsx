import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import NotFound from '../component/NotFound';
import Photo from '../pages/Photo/Photo';
import Main from '../pages/Main';
import Video from '../pages/Video/Video';
import Gallery from '../pages/Gallery/Gallery';
import Realtime from '../pages/Realtime/Realtime';
import Signup from '../pages/Signup/Signup';
import Signin from '../pages/Signin/Signin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Main />,
      },
      {
        path: 'photo',
        element: <Photo />,
      },
      {
        path: 'video',
        element: <Video />,
      },
      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'realtime',
        element: <Realtime />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'signin',
        element: <Signin />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
