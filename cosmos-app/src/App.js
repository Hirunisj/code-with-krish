import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import OrderManagement from './components/order-management';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Products from './pages/Products';

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <nav>
            <Navigation nav={"Customer Management"} url={"/customer-management"} />
            <Navigation nav={"Product Management"} url={"/product-management"} />
            <Navigation nav={"Order Management"} url={"/order-management"} />
          </nav>
        </div>

        <Routes>
          <Route path="/order-management" element={<Orders/>}></Route>
          <Route path="/customer-management" element={<Customers/>}></Route>
          <Route path="/product-management" element={<Products/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

function Navigation({nav, url}) {
  return (
    <li>
      <Link to={url}>{nav}</Link>
    </li>
  )
}

export default App;