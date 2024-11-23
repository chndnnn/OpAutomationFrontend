import { useEffect, useState } from "react";
import PopUp from "./Popup";

const Table = ({ excelData, errorDetaisl }) => {
  let [header, setHeader] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (excelData && excelData.length > 0) {
      let data = Object.keys(excelData[0]).map((key) => key);
      setHeader(data);
    } else {
      setHeader([]); // Clear the headers if no data
    }
  }, [excelData]);

  useEffect(() => {
    console.log(header);
  }, [header]);

  return (
    <div className="mt-4">
      {excelData.length > 0 ? (
        <div className="overflow-x-auto">
          <button onClick={() => setShowModal(true)}>Check Duplicates</button>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {/* Dynamically render column headers */}
                {header.map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-2 text-left"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Dynamically render rows */}
              {excelData.map((row, index) => (
                <tr key={index} className="even:bg-gray-100">
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border border-gray-300 px-4 py-2 ${
                        errorDetaisl.lineNo == index ? "bg-red-300" : ""
                      }`}
                    >
                      {value !== null && value !== undefined ? value : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">
          No data to display. Please upload an Excel file.
        </p>
      )}
      {showModal && (
        <PopUp
          description={"Please check the columns"}
          onModalCloseClick={() => setShowModal(false)}
          header={header}
        />
      )}
    </div>
  );
};

export default Table;
