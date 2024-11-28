import { useEffect, useState } from "react";
import { utils, writeFile } from "xlsx";
import PopUp from "./Popup";
import { BiReset } from "react-icons/bi";
import { MdDownloadForOffline } from "react-icons/md";
import { FaCaretLeft } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa";

const Table = ({ excelData, errorDetails, setExcelData }) => {
  const [header, setHeader] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [duplicateRows, setDuplicateRows] = useState([]);
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    start: 0,
    end: 10,
    page: 1,
  });

  // Extract headers from Excel data
  useEffect(() => {
    if (excelData && excelData.length > 0) {
      setHeader(Object.keys(excelData[0]));
    } else {
      setHeader([]); // Clear headers if no data
    }
  }, [excelData]);

  // Handle duplicate detection
  const findDuplicates = (selectedHeaders) => {
    if (!selectedHeaders.length) return;

    const uniqueKeyMap = new Map();
    const duplicates = [];

    excelData.forEach((row, index) => {
      const key = selectedHeaders.map((header) => row[header]).join("|");

      if (uniqueKeyMap.has(key)) {
        duplicates.push(index);
      } else {
        uniqueKeyMap.set(key, index);
      }
    });

    setDuplicateRows(duplicates);
  };

  const removeDuplicatesAndDownload = () => {
    if (!selectedHeaders.length) return;

    const uniqueKeyMap = new Map();
    const filteredData = excelData.filter((row) => {
      const key = selectedHeaders.map((header) => row[header]).join("|");

      if (uniqueKeyMap.has(key)) {
        return false;
      } else {
        uniqueKeyMap.set(key, true);
        return true;
      }
    });

    setExcelData(filteredData);
    exportToExcel(filteredData);
    setDuplicateRows([]);
  };

  // Export filtered data to Excel
  const exportToExcel = (data) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    writeFile(workbook, "FilteredData.xlsx");
  };

  // Pagination handling
  const handleNextPage = () => {
    if (pagination.end >= excelData.length) return;

    const rowsCount = pagination.end - pagination.start;
    setPagination((prev) => ({
      start: prev.end,
      end: prev.end + rowsCount,
      page: prev.page + 1,
    }));
  };

  const handlePreviousPage = () => {
    if (pagination.start <= 0) return;

    const rowsCount = pagination.end - pagination.start;
    setPagination((prev) => ({
      start: prev.start - rowsCount,
      end: prev.end - rowsCount,
      page: prev.page - 1,
    }));
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPagination((prev) => ({
      start: 0,
      end: newRowsPerPage,
      page: 1,
    }));
  };

  return (
    <div className="mt-1">
      {excelData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2 items-center">
              <span className="p-2 rounded">{excelData.length} Rows</span>
              <button
                className="bg-black hover:text-yellow-600 text-white p-2 rounded"
                onClick={() => setShowModal(true)}
              >
                Check Duplicates{" "}
                <span className="text-red-500">
                  {duplicateRows.length > 0 && duplicateRows.length}
                </span>
              </button>
              {duplicateRows.length > 0 && (
                <>
                  <button
                    onClick={removeDuplicatesAndDownload}
                    className="bg-black flex items-center gap-1 text-white hover:text-yellow-600 p-2 rounded"
                  >
                    Remove Duplicates and Download
                    <MdDownloadForOffline />
                  </button>
                  <button
                  
                    onClick={() => setDuplicateRows([])}
                    className="bg-black text-xl p-2 text-white hover:text-yellow-600 px-3 rounded"
                  >
                    <BiReset />
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                className="bg-black text-white rounded p-1 cursor-pointer"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
              </select>
              <div className="flex items-center gap-2">
                <FaCaretLeft
                  onClick={handlePreviousPage}
                  className="cursor-pointer hover:scale-110 text-gray-600"
                />
                <span>Page {pagination.page}</span>
                <FaCaretRight
                  onClick={handleNextPage}
                  className="cursor-pointer hover:scale-110 text-gray-600"
                />
              </div>
            </div>
          </div>
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
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
              {excelData
                .slice(pagination.start, pagination.end)
                .map((row, index) => {
                  const actualIndex = pagination.start + index;
                  const isDuplicate = duplicateRows.includes(actualIndex);
                  return (
                    <tr
                      key={actualIndex}
                      className={`${
                        isDuplicate ? "bg-red-300" : "even:bg-gray-100"
                      }`}
                    >
                      {header.map((col) => (
                        <td
                          key={col}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {row[col] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
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
          description="Select columns to check for duplicates"
          onModalCloseClick={() => setShowModal(false)}
          header={header}
          onFilterClicked={(e) => {
            findDuplicates(e);
            setSelectedHeaders(e);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Table;
