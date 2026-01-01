const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 d-flex justify-content-between align-items-center">
    <a className="navbar-brand" href="#"><b>Expenser</b></a>
    {/* <h4 className="ml-auto text-light">
      Rs : {totalAmount >= 0 && totalAmount <= 9 ? `0${totalAmount}` : totalAmount}
    </h4> */}
  </nav>
);

export default Navbar;