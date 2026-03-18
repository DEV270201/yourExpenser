import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import type {
  ExpensesType,
  TransactionForm,
} from "../types/common";
import SkeletonLoader from "../components/Loaders/Skeleton";
import BalanceDetails from "../components/BalanceDetails";
import { toast } from 'react-toastify';

const ExpenseTracker = () => {
  const currentMonthYear = new Date().toISOString().slice(0, 7);
  const startDate = `${currentMonthYear}-01`;
  const endDate = `${currentMonthYear}-31`;
  const userId = "1234";
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard", userId],
    queryFn: () => apiClient.getDashboardData(userId, startDate, endDate),
    // This ensures that if one fails, the whole component treats it as an error
    retry: 1,
  });

  const addMutation = useMutation({
    mutationFn: (newTrans: TransactionForm) =>
      apiClient.addTransaction(userId, newTrans),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", userId],
      });
      toast.success("🚀 Transaction Added successfully!");
    },
    onError: (error) => {
      toast.error(`❌ Failed to add: ${error.message}`);
    },
  });

  const addExpense = (transaction: TransactionForm) => {
    addMutation.mutate(transaction);
  };

  const deleteMutation = useMutation({
    mutationFn: (item: ExpensesType) =>
      apiClient.deleteTransaction(userId, item.PK?.slice(6)),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
     toast.info("🗑️ Transaction removed.");
    },
    onError: (error: any) => {
      toast.error("⚠️ Could not delete. Please try again.");
    },
  });

  const handleDelete = (item: ExpensesType) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      deleteMutation.mutate(item);
    }
  };

  if (isLoading) return <SkeletonLoader />;

  if (isError) {
    console.log("Error fetching data: ", error);
    return (
      <div className="alert alert-danger m-2">
        Unable to load dashboard. Please try again later :(
      </div>
    );
  }


  let transactions: any = [];
  let summary: any = {
    Income: 0.0,
    Expense: 0.0,
  };
  if (data) {
    transactions = data.transactions?.transactions;
    summary = data.summary?.summary;
  }

  const filteredList = transactions.filter((item: { Desc: string }) =>
    item.Desc.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  let userIncome = Number(summary?.Income);
  let userExpense = Number(summary?.Expense);
  let userBalance = userIncome + userExpense;

  return (
    <div className="expenser_container">

      <div className="search my-3 mx-2">
        <input
          className="input_search"
          type="search"
          placeholder="Search your expense...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <BalanceDetails
        userBalance={userBalance}
        userExpense={userExpense}
        userIncome={userIncome}
      />

      <ExpenseForm
        onAdd={addExpense}
        addMutation={addMutation}
      />

      <hr />

      <ExpenseList
        items={filteredList}
        onDelete={handleDelete}
        isSearching={searchTerm.length > 0}
        deleteMutation={deleteMutation}
      />
    </div>
  );
};

export default ExpenseTracker;
