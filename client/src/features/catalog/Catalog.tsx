import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

export default function Catalog() {
    // const [products, setProducts] = useState([
  //   {name: 'product1', price: 100.00},
  //   {name: 'product2', price: 400.00},
  // ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  //useEffect hook is to use a side effect to our component when it loads

  // useEffect(() => { //curly brackets because we're not returning anything from this//when we return then use ()
  //   fetch('http://localhost:5000/api/products')
  //     .then(response => response.json())//response in json of what we get from fetch
  //     .then(data => setProducts(data))//then we get the data back from this response
  // }, [])//dependency []-only going to be called once, otherwise this useEffect will run everytime the component renders or rerenders
  
  useEffect(() => { 
    agent.Catalog.list()
      .then(products => setProducts(products))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, [])

  if(loading) return <LoadingComponent message="Loading Products..."/>

    return (
        <>
          <ProductList products={products} />
        </>
    )
}