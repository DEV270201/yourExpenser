import { useState, type ChangeEvent } from "react";
import type { TransactionForm } from "../types/common";
import Dropdown from "./Dropdown";
import type { UseMutationResult } from "@tanstack/react-query";
import SpinnerLoader from "./Loaders/Spinner";
import { toast } from 'react-toastify';

type props = {
  onAdd: any;
  addMutation: UseMutationResult<any, Error, TransactionForm, unknown>;
};

function getDefaultObj(): TransactionForm {
  return {
    Value: 0.0,
    Desc: "",
    LongDesc: "",
    Type: "Income",
    Category: "Income",
    Currency: "USD",
  };
}

const ExpenseForm = ({ onAdd, addMutation }: props) => {
  const [transaction, setTransaction] =
    useState<TransactionForm>(getDefaultObj());

  const [isOpen, setIsOpen] = useState(false);

  const updateTransactionForm = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } },
  ): void => {
    const { name, value } = e.target;
    setTransaction((prevState) => ({
      ...prevState,
      [name]: name == "Desc" ? value.slice(0, 10) : value,
    }));
  };

  const handleSubmit = () => {
    // Validation (logic from your script
    transaction.Desc = transaction.Desc.slice(0, 10);
    if (transaction.Desc.trim().length === 0) {
     toast.error("❌ Please mention source/payee ...");
      return;
    }
    if (Number(transaction.Value) >= 50001) {
     toast.error(
        "❌ Amount should be between -50,000 - 50,000 ..."
      );
      return;
    }

    if (transaction.Type === "Expense") 
      transaction["Value"] = transaction.Value > 0 ? -transaction.Value : 0;

    onAdd(transaction);
    setTransaction(getDefaultObj());
  };

  const categories = [
    "Entertainment",
    "Grocery",
    "Shopping",
    "Bank",
    "Refund",
    "Miscellaneous",
  ];

  return (
    <>
      <div className="transaction-card-wrapper p-2">
        {/* Modern Toggle Button */}
        <button
          className="btn w-100 d-flex align-items-center justify-content-between p-3 border-0 shadow-sm"
          style={{
            backgroundColor: "#fff",
            borderRadius: "14px",
            transition: "0.3s",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="d-flex align-items-center">
            <div
              className={`rounded-circle p-2 mr-3 ${isOpen ? "bg-danger-light text-danger" : "bg-primary-light text-primary"}`}
              style={{
                backgroundColor: isOpen ? "#fee2e2" : "#dbeafe",
                width: "40px",
              }}
            >
              {isOpen ? "✕" : "＋"}
            </div>
            <span className="font-weight-bold text-dark mx-2">
              {isOpen ? "Cancel Transaction" : "New Transaction"}
            </span>
          </div>
        </button>

        {/* Animated Form */}
        <div className={`collapsible-form ${isOpen ? "show" : ""}`}>
          <div
            className="p-4 bg-white shadow-sm"
            style={{ borderRadius: "20px" }}
          >
            <div className="row g-3">
              {/* Amount Field */}
              <div className="col-12 col-md-4">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="Value"
                    name="Value"
                    placeholder="0.00"
                    min="0"
                    value={transaction.Value}
                    onChange={updateTransactionForm}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      // List of keys to block
                      const forbiddenKeys = ["+", "-", "e", "E"];

                      if (forbiddenKeys.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}  
                  />
                  <label htmlFor="Value">Amount ($)</label>
                </div>
              </div>

              {/* Short Title */}
              <div className="col-12 col-md-8">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="desc"
                    name="Desc"
                    placeholder="Title"
                    maxLength={10}
                    value={transaction.Desc}
                    onChange={updateTransactionForm}
                  />
                  <label htmlFor="desc">Source / Payee</label>
                  <div className="position-absolute bottom-0 end-0 p-2">
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {transaction.Desc.length}/10
                    </small>
                  </div>
                </div>
              </div>

              {/* Long Description */}
              <div className="col-12">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    placeholder="Notes"
                    id="LongDesc"
                    name="LongDesc"
                    style={{ height: "80px" }}
                    // value={transaction.longDesc}
                    // onChange={updateTransactionForm}
                  ></textarea>
                  <label htmlFor="longDesc">Detailed Notes</label>
                </div>
              </div>

              {/* Type Dropdown */}
              <div className="row g-2">
                <div className="col-6">
                  <Dropdown
                    label="Type"
                    name="Type"
                    options={["Expense", "Income"]}
                    value={transaction.Type}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateTransactionForm({
                        target: { name: "Type", value: val },
                      });
                    }}
                  />
                </div>
                <div className="col-6">
                  <Dropdown
                    label="Category"
                    name="Category"
                    options={categories}
                    value={transaction.Category}
                    onChange={updateTransactionForm}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-12 mt-4">
                <button
                  className="btn btn-add-submit w-100 py-3 shadow-sm"
                  onClick={handleSubmit}
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending ? (
                    <SpinnerLoader color="#0d6efd" />
                  ) : (
                    "Confirm Transaction"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseForm;
