import { useState, useEffect, type ChangeEvent } from "react";
import type { ShowAlertFunctionType, TransactionForm } from "../types/common";

type props = {
  onAdd: any;
  showAlert: ShowAlertFunctionType;
};

const ExpenseForm = ({ onAdd, showAlert }: props) => {
  const [transaction, setTransaction] = useState<TransactionForm>({
    amt: "",
    desc: "",
    type: "inc",
    category: "Income",
  });

  const updateTransactionForm = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Validation logic from your script
    transaction.desc = transaction.desc.slice(0, 20);
    if (transaction.desc.trim().length === 0 || transaction.amt.trim().length === 0) {
      showAlert({ text: "Sorry, invalid input :(", type: "0" });
      return;
    }
    transaction.amt = transaction.amt.replace(/-/g, "");
    if (Number(transaction.amt) >= 1e5) {
      showAlert({ text: "Amount should be less than 1,00,000 :(", type: "0" });
      return;
    }

    if (transaction.type === "exp") {
      console.log("hello")
      transaction["amt"] = "-" + transaction.amt;
    }

    onAdd(transaction);
    setTransaction({
      amt: "",
      desc: "",
      type: "inc",
      category: "Income",
    });
  };

  return (
    <>
      <div className="p-1">
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control rounded-1"
            name="amt"
            placeholder="Amount spent/recieved"
            value={transaction.amt}
            onChange={updateTransactionForm}
          />
          <div className="input-group-append ml-1">
            <span className="input-group-text">Rs</span>
          </div>
        </div>

      <div className="exp">
        <div className="input-group mb-3">
          <div className="input-group-prepend mr-1">
            <span className="input-group-text">On/From</span>
          </div>
          <input
            type="text"
            className="form-control rounded-1"
            placeholder="What?"
            name={"desc"}
            value={transaction.desc}
            onChange={updateTransactionForm}
          />
        </div>
        <h6 className="limit">
          <span>{transaction.desc.length}</span>/20
        </h6>
      </div>

      {/* Transaction Type Dropdown */}
      <div className="input-group mb-3" style={{ width: "fit-content" }}>
        <div className="input-group-prepend">
          <label
            className="input-group-text"
            htmlFor="transaction_type"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            Type
          </label>
        </div>
        <select
          className="dropdown_select rounded-1 mx-1"
          id="transaction_type"
          name={'type'}
          value={transaction.type}
          onChange={updateTransactionForm}
          style={{
            borderColor: "#ced4da",
          }}
        >
          <option value="exp">Expense</option>
          <option value="inc">Income</option>
        </select>
      </div>

      {/* category Type Dropdown */}
      <div className="input-group mb-3" style={{ width: "fit-content" }}>
        <div className="input-group-prepend">
          <label
            className="input-group-text"
            htmlFor="category_type"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            Category
          </label>
        </div>
        <select
          className="dropdown_select rounded-1 mx-1"
          id="category_type"
          name={'category'}
          value={transaction.category}
          onChange={updateTransactionForm}
          style={{
            borderColor: "#ced4da",
          }}
        >
          <option value="Entertainment">Entertainment</option>
          <option value="Grocery">Grocery</option>
          <option value="Miscellaneous">Miscellaneous</option>
          <option value="Bank">Bank</option>
          <option value="Shopping">Shopping</option>
          <option value="Income">Income</option>
          <option value="Refund">Refund</option>
          <option value="Payable">Payable</option>
        </select>
      </div>

      <button className="btn btn-outline-primary" onClick={handleSubmit}>
        ADD
      </button>
      </div>
    </>
  );
};

export default ExpenseForm;
