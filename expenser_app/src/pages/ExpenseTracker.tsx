import { useState } from 'react';
import AlertMessage from '../components/AlertMessage';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import type { MessageType, ExpensesType, TransactionForm } from '../types/common';

const ExpenseTracker = () => {
  const [list, setList] = useState<ExpensesType[]>([]);
  const [balance, setBalance] = useState<Record<string,number>>({
    inc: 0.0,
    exp: 0.0,
    tot: 0.0
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [message, setMessage] = useState<MessageType>({ text: "", type: '0' });

  //for showing messages on the UI
  const showAlert = ({text, type}:MessageType) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: '0' }), 3000);
  };

  //add expense function to either add income/expense transaction
  const addExpense = (transaction: TransactionForm) => {
    const newExpense:ExpensesType = {
      id: Math.random(), // Replacing idGenerator
      amt: Number(transaction.amt),
      desc: transaction.desc.toLowerCase(),
      type: transaction.type,
      category:transaction.category,
      moment: new Date().toLocaleDateString()
    };

    setList([...list, newExpense]);
    setBalance((prev) => {
      return {
        ...prev,
        [transaction.type]: prev[transaction.type] + (newExpense.amt),
        tot: prev.tot + (newExpense.amt)
      }
    })
    showAlert({text: "Expense added successfully!!", type: '1'});
  };

  //delete expense function for deleting income/expense transaction
  const deleteExpense = (item: ExpensesType) => {
    setList(list.filter(ele => item.id !== ele.id));
    setBalance((prevBalance)=> {
      return {
        ...prevBalance,
        [item.type]: prevBalance[item.type] - item.amt,
        tot: prevBalance.tot - item.amt
      }
    })
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
      
      {/* Balance Details  */}
      <div className='balance_details d-flex flex-column align-items-end '>
        <div className='fs-6'>Income: <span className='fw-bold text-primary'>{balance.inc.toFixed(2)}</span></div>
        <div className='fs-6'>Expense: <span className='fw-bold text-danger'>{balance.exp.toFixed(2)}</span></div>
        <div className='fs-6'>Overall: <span className={`fw-bold ${balance.tot >= 0 ? 'text-primary' : 'text-danger' }`}>{balance.tot.toFixed(2)}</span></div>
      </div>

      <ExpenseForm onAdd={addExpense} showAlert={showAlert} />
      <hr />
      <ExpenseList 
        items={filteredList} 
        onDelete={deleteExpense} 
        isSearching={searchTerm.length > 0} 
      />
    </div>
  );
};

export default ExpenseTracker;
