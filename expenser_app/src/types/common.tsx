export interface MessageType {
    text: string,
    type: string
}

export interface ExpensesType {
     id: number, // Replacing idGenerator
      amt: number,
      desc: string,
      type: string,
      category: string,
      moment: string
}

export interface TransactionForm {
   amt: string,
   desc: string,
   type: string,
   category: string
}

// functions 
export type ShowAlertFunctionType = {
    (a: MessageType): void
}

export type DeleteExpenseFunctionType = {
    (a: ExpensesType): void
}