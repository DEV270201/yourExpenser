import Navbar from "./components/Navbar";
import ExpenseTracker from "./pages/ExpenseTracker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching when tab is clicked
      staleTime: 5 * 60 * 1000,    // Data stays "fresh" for 5 minutes
      retry: 1,                    // Only retry failed requests once
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
        </div>
      </div>
    </>
  );
}

export default App;
