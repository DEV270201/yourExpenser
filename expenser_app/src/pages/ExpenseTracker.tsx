import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/api";
import AlertMessage from "../components/AlertMessage";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import type {
  MessageType,
  ExpensesType,
  TransactionForm,
} from "../types/common";


const ExpenseTracker = () => {
  const currentMonthYear = new Date().toISOString().slice(0,7);
  const startDate = `${currentMonthYear}-01`;
  const endDate = `${currentMonthYear}-31`;
  const userId = "1234";
  const queryClient = useQueryClient();
  const [balance, setBalance] = useState<Record<string, number>>({
    inc: 0.0,
    exp: 0.0,
    tot: 0.0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [message, setMessage] = useState<MessageType>({ text: "", type: "0" });

  const { data, isLoading,  isError, error } = useQuery({
    queryKey: ["dashboard", userId],
    queryFn: () => apiClient.getDashboardData(userId, startDate, endDate),
    // This ensures that if one fails, the whole component treats it as an error
    retry: 1,
  });

  //for showing messages on the UI
  const showAlert = ({ text, type }: MessageType) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "0" }), 3000);
  };

  //add expense function to either add income/expense transaction
  // The Mutation Logic
  const addMutation = useMutation({
    mutationFn: (newTrans: TransactionForm) =>
      apiClient.addTransaction(userId, newTrans),
    onSuccess: () => {
      // Invalidate the 'dashboard' query to trigger a refresh of List & Summary
      queryClient.invalidateQueries({
        queryKey: ["dashboard", userId],
      });
      showAlert({ text: "Transaction added successfully!", type: "1" });
    },
    onError: (error) => {
      showAlert({ text: `${error.message}`, type: "0" });
    },
  });

  // The updated addExpense function
  const addExpense = (transaction: TransactionForm) => {
    addMutation.mutate(transaction);
  };

  //delete expense function for deleting income/expense transaction
 const deleteMutation = useMutation({
  mutationFn: (item: ExpensesType) => apiClient.deleteTransactionApi(userId, item.PK?.slice(6)),
  onSuccess: () => {
    // Invalidate the dashboard so the balance and list refresh
    queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
    showAlert({ text: "Transaction removed!", type: '1' });
  },
  onError: (error: any) => {
    showAlert({ text: `${error.message}`, type: '0' });
  }
});

const handleDelete = (item: ExpensesType) => {
  // Optional: Add a confirmation dialog
  if (window.confirm("Are you sure you want to delete this?")) {
    deleteMutation.mutate(item);
  }
};

   // Handle the "All or Nothing" UI state
  if (isLoading)
    return (
      <h5 className="text-center text-lg m-2">Synchronizing your data...</h5>
    );

  // If either request failed, data will be undefined and isError will be true
  if (isError) {
    console.log("Error fetching data: ", error);
    return (
      <div className="alert alert-danger m-2">
        Unable to load dashboard. Please try again later :(
      </div>
    );
  }

  // Destructure your combined data
  let transactions: any = [];
  let summary: any = {
    Income: 0.0,
    Expense: 0.0
  };
  if (data) {
    transactions = data.transactions?.transactions;
    summary = data.summary?.summary;
  }

  const filteredList = transactions.filter((item: { Desc: string }) =>
    item.Desc.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const userIncome = summary?.Income.toFixed(2);
  const userExpense = summary?.Expense.toFixed(2);
  const userBalance = Number(summary?.Income.toFixed(2)) + Number(summary?.Expense.toFixed(2));

  return (
    <div className="expenser_container">
      {message.text && <AlertMessage message={message} />}

      <div className="search my-3 mx-2">
        <input
          className="input_search"
          type="search"
          placeholder="Search your expense...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Balance Details  */}
      <div className="balance_details d-flex flex-column align-items-end ">
        <div className="fs-6">
          Income:{" "}
          <span className="fw-bold text-primary">{userIncome}</span>
        </div>
        <div className="fs-6">
          Expense:{" "}
          <span className="fw-bold text-danger">{userExpense}</span>
        </div>
        <div className="fs-6">
          Overall:{" "}
          <span
            className={`fw-bold ${userBalance >= 0 ? "text-primary" : "text-danger"}`}
          >
            {userBalance}
          </span>
        </div>
      </div>

      <ExpenseForm onAdd={addExpense} showAlert={showAlert} addMutation={addMutation} />
      <hr />
      <ExpenseList
        items={filteredList}
        onDelete={handleDelete}
        isSearching={searchTerm.length > 0}
      />
    </div>
  );
};

export default ExpenseTracker;
