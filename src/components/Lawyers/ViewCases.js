import { useEffect, useState } from 'react';
import { getDatabase, ref as rtdbRef, onValue } from 'firebase/database';
import { app } from '../../firebaseConfig';
import DashboardHeading from '../DashboardHeading';
import CaseCard from '../CaseCard';


function ViewCases() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const dbRealtime = getDatabase(app);
    const casesRef = rtdbRef(dbRealtime, 'Client-Cases');
    const unsubscribe = onValue(casesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {

        const casesArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setCases(casesArray);
      } else {
        setCases([]);
      }
    });
    return () => unsubscribe();
  }, []); 

  return (
    <>
      <DashboardHeading text={"View Cases"} />
      <div className="container mt-4" style={{marginBottom:"30%"}}>
        <div className="row">
          {cases.map((caseData) => (
            <div key={caseData.id} className="col-md-4">
              <CaseCard caseData={caseData} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ViewCases;
