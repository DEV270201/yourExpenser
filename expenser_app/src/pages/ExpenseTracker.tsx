import { useEffect, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Navbar from '../components/Navbar';
import type { MessageType, ExpensesType } from '../types/common';

const ExpenseTracker = () => {
  const [list, setList] = useState<ExpensesType[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [message, setMessage] = useState<MessageType>({ text: "", type: "" });

  const showAlert = ({text, type}:MessageType) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  useEffect(()=>{
    console.log("exp: ", totalAmount);
  },[totalAmount]);

  const addExpense = (amount: number, description: string) => {
    const newExpense:ExpensesType = {
      id: Math.random(), // Replacing idGenerator
      spent: amount,
      desc: description.toLowerCase(),
      moment: new Date().toLocaleDateString()
    };

    setList([...list, newExpense]);
    setTotalAmount(prev => prev + newExpense.spent);
    showAlert({text: "Expense added successfully!!", type: "success"});
  };

  const deleteExpense = (id:number, spent:number) => {
    setList(list.filter(item => item.id !== id));
    setTotalAmount(prev => prev - spent);
  };

  const filteredList = list.filter(item => 
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="expenser_container">
      <Navbar totalAmount={totalAmount} />
      
      {message.text && (
        <div className={`alert alert-${message.type} mt-3`} role="alert">
          <b>{message.text}</b>
        </div>
      )}

      <div className="search my-3 mx-2">
        <input 
          className="input_search" 
          type="search" 
          placeholder="Search your expense...." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <hr />

      <ExpenseForm onAdd={addExpense} showAlert={showAlert} />
      
      <ExpenseList 
        items={filteredList} 
        onDelete={deleteExpense} 
        isSearching={searchTerm.length > 0} 
      />
    </div>
  );
};

export default ExpenseTracker;