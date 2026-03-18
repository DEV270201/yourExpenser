
type props = {
    userIncome: number;
    userExpense: number;
    userBalance: number;
}

const BalanceDetails = ({userIncome, userExpense, userBalance}: props) => {
    return (
        <div className="balance-card d-flex flex-column align-items-end p-2 ms-auto">
        <div className="balance-item d-flex align-items-center mb-1">
          <span className="label me-2 text-muted uppercase">Income:</span>
          <span className="value fw-bold text-primary">
            + {userIncome.toFixed(2)}
          </span>
        </div>

        <div className="balance-item d-flex align-items-center mb-1">
          <span className="label me-2 text-muted">Expense:</span>
          <span className="value fw-bold text-danger">
            {userExpense.toFixed(2)}
          </span>
        </div>

        <div className="balance-divider my-2 w-100"></div>

        <div className="balance-total d-flex align-items-center">
          <span className="label me-2 fw-semibold">Overall Balance:</span>
          <span
            className={`fw-bold ${userBalance >= 0 ? "text-primary" : "text-danger"}`}
          >
            {Math.abs(userBalance).toFixed(2)}
          </span>
        </div>
      </div>
    )
}

export default BalanceDetails;