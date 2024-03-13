import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-4 flex justify-between">
      <h1 className="font-bold">Today's Weather</h1>
      {token ? (
        <button
          onClick={handleLogout}
          className="bg-white px-1 rounded-md hover:bg-blue-800 hover:text-white"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-white px-1 rounded-md hover:bg-blue-800 hover:text-white"
        >
          login
        </button>
      )}
    </div>
  );
}
