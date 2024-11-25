import { useState } from "react";
import Spinner from "./Spinner";

const PopUp = ({
  errorDetails,
  onModalCloseClick,
  description,
  header,
  onFilterClicked,
}) => {
  const [choosenHeader, setChoosenHeader] = useState([]);

  function onCheckBoxChange(e, key) {
    if (e.target.checked) {
      setChoosenHeader((prev) => [...prev, key]);
    } else {
      let data = choosenHeader.filter((prev) => {
        return prev != key;
      });
      setChoosenHeader(data);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white flex flex-col rounded-lg p-6 shadow-lg max-w-md w-full overflow-y-auto">
        {description ? (
          <>
            {description}
            <div className="grid grid-cols-2">
              {header.map((key) => (
                <div>
                  <input
                    type="checkbox"
                    onChange={(e) => onCheckBoxChange(e, key)}
                  />
                  <span>{key}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Error Details</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {/* {JSON.stringify(errorDetails, null, 2)} */}
              {errorDetails.errorDetails} at row {errorDetails.lineNo}
            </pre>
          </>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onModalCloseClick()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
          >
            Close
          </button>
          {description && (
            <button
              onClick={() => onFilterClicked(choosenHeader)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-red-300"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
