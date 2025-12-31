import type { ExpensesType, deleteExpenseFunctionType } from "../types/common";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faTrash } from '@fortawesome/free-solid-svg-icons'

type props = {
    items: ExpensesType[],
    onDelete: deleteExpenseFunctionType,
    isSearching: boolean
}

const ExpenseList = ({ items, onDelete, isSearching }: props) => {
  const emptyMsg = isSearching 
    ? "Sorry, Cannot find such expenses!" 
    : "Not able to remember your expenses??..Do add it!";

  return (
    <div className="disp1 mt-4">
      {items.length === 0 ? (
        <h6 className="text-primary">{emptyMsg}</h6>
      ) : (
        items.map((item) => (
          <ul className="list-group mb-3" key={item.id}>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column" style={{ width: '200px', overflowX: 'auto' }}>
                {item.desc[0].toUpperCase() + item.desc.slice(1)}
                <small className="text-muted">{item.moment}</small>
              </div>
              <span className="px-5">
               <FontAwesomeIcon icon={faIndianRupeeSign}
               style={{ fontWeight: 'lighter'}}
               /> {item.spent}
              </span>
              <button 
                className="btn btn-outline-danger" 
                onClick={() => onDelete(item.id, item.spent)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          </ul>
        ))
      )}
    </div>
  );
};

export default ExpenseList;