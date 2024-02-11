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
import ClientHome from './components/Clients/ClientHome';
import LawyerHome from './components/Lawyers/LawyerHome';
import AddCaseForm from './components/Clients/AddCaseForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



 
function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentBalance, setCurrentBalanace] = useState(null);

  return <>

    <div className="App">
        
       

          {currentAccount?
            <Router>
         
            
            <Navbar setCurrentAccount={setCurrentAccount} setCurrentBalanace={setCurrentBalanace} currentAccount={currentAccount} currentBalance={currentBalance}></Navbar>
            
            <div>
           
              <Routes> 
               
                 <Route exact path='/' element={ <UserHandler></UserHandler>}></Route>
                 <Route exact path='/client' element={ <ClientHome></ClientHome>}></Route>
                 <Route exact path='/lawyer' element={<LawyerHome></LawyerHome>}></Route>
                 <Route exact path='/client-add-case' element={<AddCaseForm></AddCaseForm>}></Route>
            
             
         
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
        <ToastContainer />
        </div>
         
  
  </>;
}

export default App;






