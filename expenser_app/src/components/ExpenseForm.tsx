import { useState } from 'react';
import type { showAlertFunctionType } from '../types/common';

type props = {
    onAdd: any
    showAlert: showAlertFunctionType
}

const ExpenseForm = ({ onAdd, showAlert }: props) => {
  const [spent, setSpent] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    const letters = /\d+/;
    // Validation logic from your script
    if (desc.length === 0 || desc.match(letters) || !spent.match(letters)) {
      showAlert({text: "Sorry, Input was not recognized!!", type: "danger"});
      return;
    }
    onAdd(Number(spent), desc);
    setSpent("");
    setDesc("");
  };

  return (
    <>
      <div className="exp">
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control rounded-1" 
            placeholder="Amount spent/recieved" 
            value={spent}
            onChange={(e) => setSpent(e.target.value.slice(0, 10))} 
          />
          <div className="input-group-append mx-1"><span className="input-group-text">Rs</span></div>
        </div>
        <h6 className="limit"><span>{spent.length}</span>/10</h6>
      </div>

      <div className="exp">
        <div className="input-group mb-3">
          <div className="input-group-prepend mx-1"><span className="input-group-text">On/From</span></div>
          <input 
            type="text" 
            className="form-control rounded-1" 
            placeholder="What?" 
            value={desc}
            onChange={(e) => setDesc(e.target.value.slice(0, 10))} 
          />
        </div>
        <h6 className="limit"><span>{desc.length}</span>/10</h6>
      </div>
      <div className="dropdown" style={{ width: '8rem' }}>
    <button 
        className="btn border-dark d-flex align-items-center gap-2 dropdown-toggle w-100" 
        type="button" 
        id="dropdownMenuLink" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
    >
        {/* <span>{valueToIcon[name]}</span> {name} */}
        Type
    </button>
    
    <ul className="dropdown-menu border" aria-labelledby="dropdownMenuLink">
        <li 
            className={`dropdown-item d-flex gap-2 fw-bold cursor-pointer active`} 
            onClick={()=>{}}
        >
            Oldest
        </li>
        <li 
            className={`dropdown-item d-flex gap-2 fw-bold cursor-pointer`} 
            onClick={()=>{}}
        >
            Latest
        </li>
    </ul>
</div>
      <button className="btn btn-outline-primary" onClick={handleSubmit}>ADD</button>
    </>
  );
};

export default ExpenseForm;