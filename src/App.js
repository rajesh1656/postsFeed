import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import './css/bootstrap.min.css';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import ListPost from './components/ListPost';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Posts</Link>
            </li>
            <li>
              <Link to="post/create">New Post</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route index element={<ListPost />} />
          <Route path="post/create" element={<CreatePost />} />
          <Route path="post/:id/edit" element={<EditPost />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
