export interface MessageType {
  text: string;
  type: string;
}

export interface ExpensesType {
  Category: string;
  Currency: string;
  Date: string;
  Desc: string;
  GSI1_PK: string|null;
  GSI1_SK: string|null;
  PK: string|null;
  SK: string|null;
  Type: string;
  Value: number;
}

export type TransactionType = "Expense" | "Income";

export interface TransactionForm {
  Value: number;
  Desc: string;
  LongDesc: string;
  Type: TransactionType;
  Category: string;
  Currency: string;
}

// functions
export type ShowAlertFunctionType = {
  (a: MessageType): void;
};

export type DeleteExpenseFunctionType = {
  (a: ExpensesType): void;
};
