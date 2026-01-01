import { useState } from 'react';
import AlertMessage from '../components/AlertMessage';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import type { MessageType, ExpensesType } from '../types/common';

const ExpenseTracker = () => {
  const [list, setList] = useState<ExpensesType[]>([]);
  const [balance, setBalance] = useState<Record<string,number>>({
    inc: 0.0,
    exp: 0.0,
    tot: 0.0
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [message, setMessage] = useState<MessageType>({ text: "", type: '0' });

  const showAlert = ({text, type}:MessageType) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: '0' }), 3000);
  };

  const addExpense = (amount: number, description: string) => {
    const newExpense:ExpensesType = {
      id: Math.random(), // Replacing idGenerator
      spent: amount,
      desc: description.toLowerCase(),
      moment: new Date().toLocaleDateString()
    };

    setList([...list, newExpense]);
    setBalance((prev) => {
      return {
        ...prev,
        exp: prev.exp + (-newExpense.spent),
        tot: prev.tot + (-newExpense.spent)
      }
    })
    
    showAlert({text: "Expense added successfully!!", type: '1'});
  };

  const deleteExpense = (id:number, spent:number) => {
    setList(list.filter(item => item.id !== id));
    // setTotalAmount(prev => prev - spent);
  };

  const filteredList = list.filter(item => 
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="expenser_container">
      {message.text && (
        <AlertMessage message={message} />
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

      {/* Balance Details  */}
      <div className='balance_details d-flex flex-column align-items-end '>
        <div className='fs-6'>Income: <span className='fw-bold text-success'>{balance.inc.toFixed(2)}</span></div>
        <div className='fs-6'>Expense: <span className='fw-bold text-danger'>{balance.exp.toFixed(2)}</span></div>
        <div className='fs-6'>Overall: <span className={`fw-bold ${balance.tot >= 0 ? 'text-success' : 'text-danger' }`}>{balance.tot.toFixed(2)}</span></div>
      </div>

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