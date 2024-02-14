// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CaseManagement {

    struct CaseInput {
        string fullName;
        string phoneNumber;
        string email;
        uint256 birthDate;
        string Address;
        string gender;
        uint256 age;
        string caseDescription;
        string caseTitle;
        string personsInvolved;
        string caseHistory;
        string status;
        string paymentStatus;
    }

    struct Case {
        uint256 id;
        CaseInput caseInput;
        uint256 timestamp;
    }

    mapping(address => Case) public cases;
    mapping(uint256 => address) public caseOwners;
    uint256 public caseCount;

    event CaseAdded(address indexed user, uint256 indexed caseId, string caseTitle, uint256 timestamp);
    event CaseUpdated(address indexed user, uint256 indexed caseId, string caseTitle, uint256 timestamp);
    event CaseStatusUpdated(address indexed user, uint256 indexed caseId, string newStatus, uint256 timestamp);
    event CaseDeleted(address indexed user, uint256 indexed caseId, string caseTitle, uint256 timestamp);

    modifier onlyCaseOwner(uint256 _caseId) {
        require(caseOwners[_caseId] == msg.sender, "You are not the owner of this case");
        _;
    }

    function addCase(CaseInput memory _caseInput) external {
        require(bytes(_caseInput.caseTitle).length > 0, "Case title cannot be empty");
        caseCount++;

        Case memory newCase = Case({
            id: caseCount,
            caseInput: _caseInput,
            timestamp: block.timestamp
        });
        cases[msg.sender] = newCase;
        caseOwners[caseCount] = msg.sender;
        emit CaseAdded(msg.sender, caseCount, _caseInput.caseTitle, block.timestamp);
    }

    function updateCaseStatus(uint256 _caseId, string memory _newStatus) external onlyCaseOwner(_caseId) {
        cases[msg.sender].caseInput.status = _newStatus;
        emit CaseStatusUpdated(msg.sender, _caseId, _newStatus, block.timestamp);
    }

    function viewCaseByUser() external view returns (Case memory) {
        return cases[msg.sender];
    }

    function viewAllCases() external view returns (Case[] memory) {
        Case[] memory allCases = new Case[](caseCount);
        for (uint256 i = 1; i <= caseCount; i++) {
            allCases[i - 1] = cases[caseOwners[i]];
        }
        return allCases;
    }

    function deleteCase(uint256 _caseId) external onlyCaseOwner(_caseId) {
        delete cases[msg.sender];
        delete caseOwners[_caseId];
        emit CaseDeleted(msg.sender, _caseId, cases[msg.sender].caseInput.caseTitle, block.timestamp);
    }
}
