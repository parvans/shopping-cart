import "./styles.css";
import apple from "./apple.jpg";
import orange from "./orange.jpg";
import beans from "./beans.jpg";
import cabbage from "./cabbage.jpg";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Card,
  Accordion,
  Button,
  Container,
  Row,
  Col,
  Image,
  Input
} from "react-bootstrap";
import axios from "axios";

function App() {
  const products = [
    { name: "Apples:", country: "Italy", cost: 3, instock: 10 },
    { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
    { name: "Beans:", country: "USA", cost: 2, instock: 5 },
    { name: "Cabbage:", country: "USA", cost: 1, instock: 8 }
  ];
  const [cart, setCart] = useState([]);
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name === name);
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    console.log(cart);

    let newItems = items.map((item, index) => {
      if (item.name === e.target.name) {
        item.instock = item.instock - 1;
      }
      if (item.instock < 0) {
        // This is for the negative stock value
        item.instock = item.instock + 1;
        setCart([...cart]);
        alert("The product is out of stock");
      }
      return item;
    });
  };

  const deleteitem = (i) => {
    cart.map((item, index) => {
      if (i === index) {
        cart.splice(index, 1);
        item.instock++;
      }
      console.log("cart is" + cart);
    });

    setCartList(
      cart.map((item, index) => {
        return (
          <Card key={index}>
            <Card.Header>{item.name}</Card.Header>
            <Card.Body>
              $ {item.cost} from {item.country}{" "}
            </Card.Body>
            <Button
              onClick={() => {
                deleteitem(index);
              }}
            >
              Delete
            </Button>
          </Card>
        );
      })
    );
  };
  var [cartList, setCartList] = useState([]);
  cartList = cart.map((item, index) => {
    return (
      <Card key={index}>
        <Card.Header>{item.name}</Card.Header>
        <Card.Body>
          $ {item.cost} from {item.country}{" "}
        </Card.Body>
        <Button
          className="btn btn-danger"
          onClick={() => {
            deleteitem(index);
          }}
        >
          Delete
        </Button>
      </Card>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };
  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };
  const [items, setItems] = useState(products);
  const photos = [apple, orange, beans, cabbage];
  let list = items.map((item, index) => {
    return (
      <ul key={index}>
        <Image src={photos[index % 4]} width={70} roundedCircle></Image>
        <Button variant="primary" size="large">
          {item.name}:{item.cost}: Stock {item.instock}
        </Button>
        <br />
        <input name={item.name} type="submit" onClick={addToCart}></input>
      </ul>
    );
  });

  const [data, setData] = useState({ data: [] });
  const [url, setUrl] = useState("http://localhost:1337/api/products");

  //  Fetch Data
  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      const result = await axios(url);
      setData(result.data);
    };
    fetchData();
  }, [url]);

  const restockProducts = (data) => {
    let newItems = data.data.map((item) => {
      let { name, country, cost, instock } = item.attributes;
      return { name, country, cost, instock };
    });
    setItems([...items, ...newItems]);
  };
  function removeItem() {
    setCart([]);
    setItems(products);
  }

  return (
    <>
      {
        <Container>
          <h1>Product List</h1>
          <ul>{list}</ul>
          <h1>Cart Contents</h1>
          <Accordion>{cartList}</Accordion>
          <h1>CheckOut </h1>
          <Button type="button" class="btn btn-primary" onClick={checkOut}>
            CheckOut ${" "}
            <span class="badge badge-success">{finalList().total}</span>
          </Button>

          {/* <div> {finalList().total > 0 && finalList().final} </div> */}
          {
            <form
              onSubmit={(event) => {
                restockProducts(data);
                event.preventDefault();
              }}
            >
              <input type="text" value={url} />
              <Button type="submit" onClick={removeItem}>
                ReStock Products
              </Button>
            </form>
          }
        </Container>
      }
    </>
  );
}
export default App;
