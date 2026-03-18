import type { TransactionForm } from "../types/common";
import axios from "axios";
const BASE_URL = 'https://a9cijggo17.execute-api.us-east-2.amazonaws.com/testing';

export const apiClient = {
  getTransactions: (userId:string, type:string = 'all', startDate: string, endDate: string) => 
    fetch(`${BASE_URL}/users/${userId}/transactions?type=${type}&start_date=${startDate}&end_date=${endDate}`).then(r => r.json()),
    
  getSummary: (userId:string, month:string) => 
    fetch(`${BASE_URL}/users/${userId}/transactions?month_year=${month}`).then(r => r.json()),
 
 getDashboardData: async (userId: string, startDate: string, endDate: string) => {
  // Promise.all will reject if ANY of the internal fetches fail
  const [transactions, summary] = await Promise.all([
    apiClient.getTransactions(userId, "EXP", startDate, endDate),
    apiClient.getSummary(userId, startDate.slice(0,7))
  ]);
  return { transactions, summary };
},

addTransaction: async (userId: string, transaction: TransactionForm) => {
  let response = await axios(`${BASE_URL}/users/${userId}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      ...transaction,
      // Ensure date is ISO format for DynamoDB sorting: YYYY-MM-DD
      Date: new Date().toLocaleDateString('en-CA'),
    }),
  }).catch((error)=>{
    console.log("Error add transaction: ", error);
  })

  if(!response?.data?.success)
      throw new Error('Sorry, something went wrong ...');
  
  return response;
},

deleteTransaction: async (userId: string, transId: string|undefined) => {
  console.log("key: ", transId);
  const response = await fetch(`${BASE_URL}/users/${userId}/transactions/${transId}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error('Failed to delete transaction!');
  return response.json();
}
};