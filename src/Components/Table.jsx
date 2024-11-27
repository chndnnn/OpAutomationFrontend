import { useEffect, useState } from "react";
import { utils, writeFile } from "xlsx";
import PopUp from "./Popup";
import { BiReset } from "react-icons/bi";
import { MdDownloadForOffline } from "react-icons/md";
import { FaCaretLeft } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa";

const Table = ({ excelData, errorDetaisl, setExcelData }) => {
  let [header, setHeader] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [duplicateRows, setDuplicateRows] = useState([]);
  const [selectedHeaders, setSelectedHeader] = useState([]);
  const [selectedValue, setSelectedValue] = useState(10);
  const [pagination, setPagination] = useState({
    start: 0,
    end: selectedValue,
    page: 1,
  });

  useEffect(() => {
    if (excelData && excelData.length > 0) {
      let data = Object.keys(excelData[0]).map((key) => key);
      setHeader(data);
    } else {
      setHeader([]); // Clear the headers if no data
    }
  }, [excelData]);

  function onFilterClicked(e) {
    findDuplicates(e);
    setSelectedHeader(e);
    setShowModal(false);
  }

  function findDuplicates(selectedHeaders) {
    if (!selectedHeaders.length) return;

    // Create a map to track occurrences of header combinations
    const uniqueKeyMap = new Map();
    const duplicates = [];

    excelData.forEach((row, index) => {
      // Create a unique key for the selected headers
      const key = selectedHeaders.map((header) => row[header]).join("|");

      // Track occurrences
      if (uniqueKeyMap.has(key)) {
        duplicates.push(index); // Store duplicate row index
      } else {
        uniqueKeyMap.set(key, index);
      }
    });

    setDuplicateRows(duplicates); // Store duplicate rows
  }

  function removeDuplicatesAndUpdateExcel(selectedHeaders) {
    if (!selectedHeaders.length) return;

    // Create a map to track unique rows based on selected headers
    const uniqueKeyMap = new Map();

    const filtered = excelData.filter((row) => {
      // Create a unique key for the selected headers
      const key = selectedHeaders.map((header) => row[header]).join("|");

      // Keep the row only if the key is not already in the map
      if (uniqueKeyMap.has(key)) {
        return false; // Duplicate row
      } else {
        uniqueKeyMap.set(key, true);
        return true; // Unique row
      }
    });

    setExcelData(filtered); // Update the parent state with filtered data
    exportToExcel(filtered); // Export the updated data to Excel
    setDuplicateRows([]); // Reset duplicate rows
  }

  function exportToExcel(data) {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    writeFile(workbook, "FilteredData.xlsx"); // Download file
  }

  function onRightPaginateClick() {
    let data = pagination.end - pagination.start;
    setPagination((prev) => {
      return {
        start: prev.end,
        end: prev.end + data,
        page: prev.page + 1,
      };
    });
  }

  function onLeftPaginateClick() {
    let data = pagination.end - pagination.start;
    if (pagination.start > 0) {
      setPagination((prev) => {
        return {
          start: prev.start - data,
          end: prev.end - data,
          page: prev.page - 1,
        };
      });
    }
  }

  function onSelectChange(e) {
    let data = +e.target.value; // Convert the selected value to a number
    setSelectedValue(data);
    setPagination((prev) => {
      return {
        ...prev,
        end: prev.start + data, // Adjust `end` based on `start` and the new value
      };
    });
  }

  return (
    <div className="mt-1">
      {excelData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className=" flex justify-between items-center">
            <div className="flex">
              <span className="p-2 rounded">{excelData.length} ROWS </span>
              <button
                className="bg-black hover:text-yellow-600 text-white p-2 rounded mb-1"
                onClick={() => setShowModal(true)}
              >
                Check Duplicates{" "}
                <span className="text-red-500">
                  {duplicateRows.length !== 0 && duplicateRows.length}
                </span>
              </button>
              {duplicateRows.length !== 0 && (
                <>
                  <button
                    onClick={() =>
                      removeDuplicatesAndUpdateExcel(selectedHeaders)
                    }
                    className="bg-black flex items-center gap-1 text-white hover:text-yellow-600 p-2 rounded mb-1 ml-1"
                  >
                    Remove Duplicates and Download
                    <span className="text-lg">
                      <MdDownloadForOffline />
                    </span>
                  </button>
                  <button
                    onClick={() => setDuplicateRows([])}
                    className="bg-black text-xl text-white hover:text-yellow-600 px-3 rounded mb-1 ml-1"
                  >
                    <BiReset />
                  </button>
                </>
              )}
            </div>
            <div className="flex mr-2  gap-2 justify-center items-center">
              <div>
                <select
                  className="bg-black text-white rounded p-1 cursor-pointer"
                  name=""
                  id=""
                  value={selectedValue}
                  onChange={onSelectChange}
                >
                  <option value="10">10</option>
                  <option value="100">100</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                </select>
              </div>
              <div className=" gap-2 flex">
                <FaCaretLeft
                  onClick={onLeftPaginateClick}
                  className="text-lg cursor-pointer hover:scale-150 rounded-full hover:text-neutral-500"
                />
                <span>{pagination.page}</span>
                <FaCaretRight
                  onClick={onRightPaginateClick}
                  className="text-xl cursor-pointer rounded-full hover:scale-150 hover:text-neutral-500"
                />
              </div>
            </div>
          </div>
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
              {excelData
                .slice(pagination.start, pagination.end)
                .map((row, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    {Object.values(row).map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className={`border border-gray-300 px-4 py-2 ${
                          errorDetaisl?.lineNo == index ||
                          duplicateRows.includes(index)
                            ? "bg-red-300"
                            : ""
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
          onFilterClicked={onFilterClicked}
        />
      )}
    </div>
  );
};

export default Table;
