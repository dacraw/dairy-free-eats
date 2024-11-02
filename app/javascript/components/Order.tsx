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

  const onSubmit = async (data) => {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    const url = "/api/v1/stripe/create_checkout_session";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ stripe: data }),
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();

    window.location.href = responseData.checkout_url;
  };

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
        <div className="grid place-content-center h-48 md:border-2 md:m-2">
          <div>
            <h5 className="mb-6">
              Enter the number of each item you would like to order and then
              click "Submit"
            </h5>
            <div className="grid grid-cols-[1fr_50px] gap-2">
              {products.data.map((product) => {
                return (
                  <React.Fragment key={product.id}>
                    <label htmlFor={product.id}>{product.name}</label>
                    <input
                      className="border-2 self-center text-center"
                      type="number"
                      placeholder="0"
                      key={product.id}
                      id={product.id}
                      {...register(product.id)}
                    />
                  </React.Fragment>
                );
              })}
              <input type="submit" className="col-span-2 border-2" />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Order;
