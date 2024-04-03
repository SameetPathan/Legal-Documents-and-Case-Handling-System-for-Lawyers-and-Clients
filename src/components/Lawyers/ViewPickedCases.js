import { useEffect, useState } from "react";
import { getDatabase, ref as rtdbRef, onValue } from "firebase/database";
import { app } from "../../firebaseConfig";
import DashboardHeading from "../DashboardHeading";
import CaseCard from "../CaseCard";
import { ethers } from "ethers";
import { casesABI, casesAddress } from "../contractAddress";

var arraylist = [];
var whole = [];
var CaseIds = [];

function ViewPickedCases(props) {
  const [cases, setCases] = useState([]);
  async function getAllproducts() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const caseContract = new ethers.Contract(
          casesAddress,
          casesABI,
          signer
        );
        arraylist = await caseContract.getAllCases();
        CaseIds = await caseContract.getAllCaseIds();

        for (var i = 0; i < arraylist.length; i++) {
          whole[i] = arraylist[i];
        }
        setCases(whole);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllproducts();
  }, []);

  return (
    <>
      <DashboardHeading text={"Your Cases"} />
      <div className="container mt-4" style={{ marginBottom: "30%" }}>
      <div className="row">
      {cases
        .filter(caseData => caseData.lawyerDetails.split("_")[1] === props.userDetails[1])
        .map((caseData, index) => (
          <div key={caseData.id} className="col-md-4">
            <CaseCard
              isclient={false}
              showtake={false}
              showclose={true}
              setcurrentCase={props.setcurrentCase}
              caseData={caseData}
              CaseId={CaseIds[index]}
              userDetails={props.userDetails}
            />
          </div>
        ))}
    </div>
    
      </div>
    </>
  );
}

export default ViewPickedCases;
