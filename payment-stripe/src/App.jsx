import CheckOutFrom from "./components/CheckOutFrom";

const App = () => {
  const pk = import.meta.env.PASS;
  console.log(pk);
  return (
    <div className="max-w-7xl w-full mx-auto h-screen flex items-center justify-center">
      <CheckOutFrom />
    </div>
  );
};

export default App;
