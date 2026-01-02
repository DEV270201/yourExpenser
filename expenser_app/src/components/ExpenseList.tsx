import type { ExpensesType, DeleteExpenseFunctionType } from "../types/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign, faTrash } from "@fortawesome/free-solid-svg-icons";

type props = {
  items: ExpensesType[];
  onDelete: DeleteExpenseFunctionType;
  isSearching: boolean;
};

const ExpenseList = ({ items, onDelete, isSearching }: props) => {
  const emptyMsg = isSearching
    ? "Sorry, Cannot find such expenses!"
    : "Not able to remember your expenses??..Do add it!";

  return (
    <div className="disp1 mt-4">
      {items.length === 0 ? (
        <h6 className="text-primary">{emptyMsg}</h6>
      ) : (
        items.map((item) => (
          <ul className="list-group mb-3" key={item.id}>
            <li
              className="list-group-item d-flex align-items-stretch p-0 overflow-hidden"
              style={{ height: "70px" }}
            >
              {/* transaction type */}
              <div
                className={`${item.type == "inc" ? "bg-primary" : "bg-danger"}`}
                style={{ width: "10px", flexShrink: 0 }}
              ></div>

              {/* details */}
              <div className="d-flex justify-content-between align-items-center flex-grow-1 px-3">
                <div
                  className="d-flex flex-column"
                  style={{ width: "200px", overflowX: "auto" }}
                >
                  <span className="font-weight-bold">
                    {item.desc[0].toUpperCase() + item.desc.slice(1)}
                  </span>
                  <small className="text-muted">{item.moment}</small>
                </div>

                <div className="d-flex align-items-center">
                  <span className="px-5 font-weight-bold">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      style={{ fontWeight: "lighter", fontSize: "0.9em" }}
                    />{" "}
                    {item.amt}
                  </span>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => onDelete(item)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </li>
          </ul>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
