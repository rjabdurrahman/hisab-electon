import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { useEffect } from "react";

function App(): React.JSX.Element {
  useEffect(() => {
    // Default is always light. Dark only if user manually selected it.
    document.documentElement.classList.toggle('dark', localStorage.theme === 'dark');
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

export default App;