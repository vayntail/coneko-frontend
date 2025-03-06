import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="main-content" style={{ paddingLeft: "60px" }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
