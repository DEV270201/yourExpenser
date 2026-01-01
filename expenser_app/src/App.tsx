import Navbar from "./components/Navbar"
import ExpenseTracker from "./pages/ExpenseTracker"

function App() {

  return (
    <>
    <Navbar />
    <div className="main">
      <div className="app">
        <ExpenseTracker />
      </div>
    </div>
    </>
  )
}

export default App
