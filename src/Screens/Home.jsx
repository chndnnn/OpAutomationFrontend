import * as XLSX from "xlsx";
import axios from "axios";
import { parseExcelDate } from "./../Helper/helper";
import { useEffect, useState } from "react";
import Table from "../Components/Table";
import PopUp from "../Components/Popup";
import Spinner from "../Components/Spinner";
import { globalState } from "../Context/GlobalContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loggedIn } = globalState();
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWhileSubmitin, setloadingWhileSubmitin] = useState(false);
  const [errorDetails, setErrorDetails] = useState({
    errorDetails: undefined,
    lineNo: undefined,
  }); // State to store error details
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteConfirmationPopup, setDeleteConfirmationPopup] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    let data = localStorage.getItem("token");
    if (!data) {
      nav("/");
    }
  }, []);

  const handleFileUpload = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Convert serial dates to proper dates
      const parsedData = jsonData.map((row) => ({
        ...row,
        invoice_received_date: parseExcelDate(row["invoice_received_date"]),
        invoice_posted_date: parseExcelDate(row["invoice_posted_date"]),
      }));

      setExcelData(parsedData); // Save the parsed data
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    setLoading(false);
  }, [excelData]);

  async function handleSubmit() {
    let data = {
      excelData,
      customer: localStorage.getItem("client"),
    };
    setloadingWhileSubmitin(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/opData/v1/insertInvoiceDetails",
        data
      );
      alert("Data successfully inserted into the database!");
      setloadingWhileSubmitin(false);
    } catch (error) {
      setloadingWhileSubmitin(false);
      console.log("Raw Error:", error); // Log the raw error first
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorDetails({
          errorDetails: error.response.data.message.detail,
          lineNo: error.response.data.lineno,
        }); // Access nested properties only if available
      } else {
        setErrorDetails("An unknown error occurred."); // Handle unexpected error structures
      }
      setShowErrorModal(true);
    }
  }

  function ondeleteClick() {
    setDeleteConfirmationPopup(true);
  }

  function onLogoutClick() {
    localStorage.removeItem("token");
    localStorage.removeItem("client");
    nav("/");
  }

  function ondeleteDataClick() {
    deleteAllDatainDb();
  }

  async function deleteAllDatainDb() {
    let data = {
      customer: localStorage.getItem("client"),
    };
    try {
      let response = axios.post(
        "http://127.0.0.1:3001/opData/v1/DeleteInvoiceDetails",
        data
      );
      setDeleteConfirmationPopup(false);
    } catch (err) {
      console.log(err.message);
      setDeleteConfirmationPopup(false);
    }
  }

  return (
    <div className="p-6 ">
      <div className="flex">
        <div>
          <span
            onClick={onLogoutClick}
            className="absolute right-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 hover:text-black cursor-pointer py-1 rounded"
          >
            Logout
          </span>
          <h2 className="text-xl font-bold text-white mb-4">
            <span className="font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent text-2xl">
              U
            </span>
            pload Excel File
          </h2>
          {loading && <div>Loading..</div>}
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="mb-4 block text-sm w-[19rem] text-gray-300 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
          />

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-green-900 via-green-600 to-green-700 text-white rounded-lg hover:text-black focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loadingWhileSubmitin ? "Uplaoding...." : "Uplaod Data to DB"}
          </button>
          <button
            onClick={ondeleteClick}
            className="px-4 py-2 ml-1 bg-gradient-to-b from-red-900 to-red-700 text-white rounded-lg hover:text-black focus:outline-none focus:ring focus:ring-blue-300"
          >
            {"Delete all data"}
          </button>
        </div>
        <div className="flex bg-gradient-to-b from-yellow-500 via-yellow-900 to-yellow-200 bg-clip-text text-transparent  justify-center items-center text-6xl font-bold w-full">
          {localStorage.getItem("client").toUpperCase()}
        </div>
      </div>
      <h3 className="text-lg text-white font-semibold mt-6 items-center flex gap-2">
        Preview Data
        {loading && (
          <span>
            <Spinner />
          </span>
        )}
      </h3>
      <pre className="mt-4 p-4 bg-gray-800 rounded-lg overflow-x-auto text-sm">
        <Table
          excelData={excelData}
          errorDetaisl={errorDetails}
          setExcelData={setExcelData}
        />
      </pre>

      {showErrorModal && (
        <PopUp
          errorDetails={errorDetails}
          onModalCloseClick={() => setShowErrorModal(false)}
        />
      )}
      {deleteConfirmationPopup && (
        <PopUp
          description={
            "Do you really want to delete all the data from DB permenantly"
          }
          onModalCloseClick={() => setDeleteConfirmationPopup(false)}
          ondeleteDataClick={ondeleteDataClick}
        />
      )}
    </div>
  );
};

export default Home;
