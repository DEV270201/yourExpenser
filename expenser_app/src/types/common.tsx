export interface MessageType {
    text: string,
    type: string
}

export interface ExpensesType {
     id: number, // Replacing idGenerator
      spent: number,
      desc: string,
      moment: string
}

// functions 
export type showAlertFunctionType = {
    (a: MessageType): void
}

export type deleteExpenseFunctionType = {
    (a: number, b: number): void
}