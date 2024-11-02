import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type StripeProduct = {
  id: string;
  object: string;
  active: boolean;
  attributes: string[];
  created: number;
  default_price: string;
  description: string;
  images: string[];
  livemode: boolean;
  marketing_features: string[];
  metadata: { [key: string]: string };
  name: string;
  package_dimensions: string;
  shippable: string;
  statement_descriptor: string;
  tax_code: string;
  type: string;
  unit_label: string;
  updated: number;
  url: string;
};

type StripeProductList = {
  object: string;
  data: StripeProduct[];
};

const Order = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  const [products, setProducts] = useState<StripeProductList | null>(null);

  useEffect(() => {
    const url = "/api/v1/stripe/products";

    const fetchProducts = async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setProducts(data);
    };
    fetchProducts();
  }, []);

  if (!products) return null;

  return (
    <>
      <p>Welcome to the order page!</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {products.data.map((product) => {
          return (
            <div key={product.id} className="text-red-700">
              <label htmlFor={product.id}>{product.name}</label>
              <input
                type="number"
                key={product.id}
                id={product.id}
                {...register(product.id)}
              />
            </div>
          );
        })}

        <input type="submit" />
      </form>
    </>
  );
};

export default Order;
