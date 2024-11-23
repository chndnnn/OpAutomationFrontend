import * as XLSX from "xlsx";
import axios from "axios";
import { parseExcelDate } from "./../Helper/helper";
import { useEffect, useState } from "react";
import Table from "../Components/Table";
import PopUp from "../Components/Popup";

const Home = () => {
  const [excelData, setExcelData] = useState([]);
  const [errorDetails, setErrorDetails] = useState({
    errorDetails: undefined,
    lineNo: undefined,
  }); // State to store error details
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleFileUpload = (event) => {
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

  async function handleSubmit() {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/opData/v1/insertInvoiceDetails",
        excelData
      );
      alert("Data successfully inserted into the database!");
    } catch (error) {
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

  useEffect(() => {
    console.log(errorDetails);
  }, [errorDetails]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload Excel File</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 block text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Submit Data
      </button>

      <h3 className="text-lg font-semibold mt-6">Preview Data</h3>
      <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-x-auto text-sm">
        <Table excelData={excelData} errorDetaisl={errorDetails} />
      </pre>

      {showErrorModal && (
        <PopUp
          errorDetails={errorDetails}
          onModalCloseClick={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default Home;
