import type { ExpensesType, DeleteExpenseFunctionType } from "../types/common";
import type { UseMutationResult } from "@tanstack/react-query";
import ExpenseCard from "./ExpenseCard";

type props = {
  items: ExpensesType[];
  onDelete: DeleteExpenseFunctionType;
  isSearching: boolean;
  deleteMutation: UseMutationResult<any, any, ExpensesType, unknown>
};

const ExpenseList = ({ items, onDelete, isSearching, deleteMutation }: props) => {
  const emptyMsg = isSearching
    ? "Sorry, Cannot find such expenses!"
    : "Not able to remember your expenses??..Do add it!";

  return (
    <div className="disp1 mt-4">
      {items.length === 0 ? (
        <h6 className="text-primary">{emptyMsg}</h6>
      ) : (
        items.map((item) => (
          <ExpenseCard item={item} onDelete={onDelete} deleteMutation={deleteMutation} />
        ))
      )}
    </div>
  );
};

export default ExpenseList;
