import Navbar from "./components/Navbar";
import ExpenseTracker from "./pages/ExpenseTracker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Prevents refetching when tab is clicked
        staleTime: 5 * 60 * 1000, // Data stays "fresh" for 5 minutes
        retry: 1, // Only retry failed requests once
      },
    },
  });

  return (
    <>
      <Navbar />
      <div className="main">
        <div className="app">
          <QueryClientProvider client={queryClient}>
            <ExpenseTracker />
          </QueryClientProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </div>
    </>
  );
}

export default App;
