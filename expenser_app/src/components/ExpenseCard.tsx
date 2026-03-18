import type { ExpensesType, DeleteExpenseFunctionType } from "../types/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign , faTrash } from "@fortawesome/free-solid-svg-icons";
import SpinnerLoader from "./Loaders/Spinner";
import type { UseMutationResult } from "@tanstack/react-query";

type props = {
  item: ExpensesType;
  onDelete: DeleteExpenseFunctionType;
  deleteMutation: UseMutationResult<any, any, ExpensesType, unknown>
};

const ExpenseCard = ({ item, onDelete, deleteMutation }: props) => {
  return (
    <ul className="list-group mb-3" key={item.PK}>
      <li
        className="list-group-item d-flex align-items-stretch p-0 overflow-hidden"
        style={{ height: "70px" }}
      >
        {/* transaction type */}
        <div
          className={`${item.Type == "Income" ? "bg-primary" : "bg-danger"}`}
          style={{ width: "10px", flexShrink: 0 }}
        ></div>

        {/* details */}
        <div className="d-flex justify-content-between align-items-center flex-grow-1 px-3">
          <div
            className="d-flex flex-column"
            style={{ width: "200px", overflowX: "auto" }}
          >
            <span className="font-weight-bold">
              {item.Desc[0].toUpperCase() + item.Desc.slice(1)}
            </span>
            <span className="text-xs">{item.Category}</span>
            <small className="text-muted text-xs">{item.Date}</small>
          </div>

          <div className="d-flex align-items-center">
            <span className="px-5 font-weight-bold">
              <FontAwesomeIcon
                icon={faDollarSign}
                style={{ fontWeight: "lighter", fontSize: "0.9em" }}
              />
              {item.Value.toFixed(2)}
            </span>

            <button
              className="btn btn-outline-danger"
              onClick={() => onDelete(item)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && deleteMutation.variables?.PK === item.PK ? (
                <SpinnerLoader color="#dc3545" />
              ) : (
                <FontAwesomeIcon icon={faTrash} />
              )}
            </button>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default ExpenseCard;