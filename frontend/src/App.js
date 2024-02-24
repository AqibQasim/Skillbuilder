import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Home from './components/Home/Home';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Course from './components/Course/Course';

function App() {
  return (
    <div className='bg-customColor min-h-screen'>
    <Router>
	  <Routes>
      <Route path='/' exact element={ <Home/> }/>
      <Route path="/courses" element={ <Course /> }></Route>
		  <Route path="/about" element={ <About /> }></Route>
      <Route path="/contact" element={ <Contact /> }></Route>
      <Route path="/signup" element={ <Signup /> }></Route>
      <Route path="/login" element={ <Login /> }></Route>
    </Routes>
    </Router>
    </div>
  );
}

export default App;
