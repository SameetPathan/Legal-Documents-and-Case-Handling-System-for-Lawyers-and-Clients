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
import ViewCases from './components/Lawyers/ViewCases';
import AddDocuments from './components/Clients/AddDocuments';
import ViewDocuments from './components/Clients/ViewDocuments';
import UserProfileForm from './components/UserProfileForm';



 
function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentBalance, setCurrentBalanace] = useState(null);
  const [userDetails, setuserDetails] = useState([]);

  return <>

    <div className="App">
        
       

          {currentAccount?
            <Router>
         
            
            <Navbar userDetails={userDetails} setCurrentAccount={setCurrentAccount} setCurrentBalanace={setCurrentBalanace} currentAccount={currentAccount} currentBalance={currentBalance}></Navbar>
            
            <div>
           
              <Routes> 
               
                 <Route exact path='/' element={ <UserHandler setuserDetails={setuserDetails} userDetails={userDetails}></UserHandler>}></Route>
                 <Route exact path='/profile' element={<UserProfileForm ></UserProfileForm>}></Route>
                 <Route exact path='/client' element={ <ClientHome></ClientHome>}></Route>
                 <Route exact path='/lawyer' element={<LawyerHome></LawyerHome>}></Route>
                 <Route exact path='/admin' element={<ViewDocuments userId={"sameet"} userType={"admin"}></ViewDocuments>}></Route>
                 <Route exact path='/client-add-case' element={<AddCaseForm></AddCaseForm>}></Route>
                 <Route exact path='/lawyer-case-view' element={<ViewCases></ViewCases>}></Route>
                 <Route exact path='/client-add-document' element={<AddDocuments></AddDocuments>}></Route>
                 <Route exact path='/client-view-document' element={<ViewDocuments userId={"sameet"} userType={"normal"}></ViewDocuments>}></Route>
            
             
         
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






