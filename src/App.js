import './App.css';
import React from 'react';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import ForceLogin from './components/ForceLogin';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import UserHandler from './components/UserHandler';


 
function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentBalance, setCurrentBalanace] = useState(null);

  return <>

    <div className="App">
        
       

          {currentAccount?
            <Router>
         
            
            <Navbar setCurrentAccount={setCurrentAccount} setCurrentBalanace={setCurrentBalanace} currentAccount={currentAccount} currentBalance={currentBalance}></Navbar>
            
            <div className='container-fluid'>
           
              <Routes> 
               
                 <Route exact path='/' element={ <UserHandler></UserHandler>}></Route>
            
             
         
              </Routes>
            </div>
          
              
            <Footer></Footer>
    
          </Router>
           
          :
          <Router>
              <Navbar setCurrentAccount={setCurrentAccount} setCurrentBalanace={setCurrentBalanace} currentAccount={currentAccount} currentBalance={currentBalance}></Navbar>
              <>
                <Routes> 
                  <Route exact path='/' element={<ForceLogin></ForceLogin>}></Route>
                  <Route exact path='*' element={<ForceLogin></ForceLogin>}></Route>
                </Routes>
              </>
                <Footer></Footer>
              </Router>
            
        }
        </div>
         
  
  </>;
}

export default App;






