import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCsrfToken } from "util/formUtil";

type StripeProduct = {
  default_price: string;
  description: string;
  name: string;
};

const Order = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: { [key: string]: string }) => {
    const csrfToken = getCsrfToken();

    if (!csrfToken) return null;
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

  const [products, setProducts] = useState<StripeProduct[] | null>(null);

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
              {products.map((product) => {
                return (
                  <React.Fragment key={product.default_price}>
                    <label htmlFor={product.default_price}>
                      {product.name}
                    </label>
                    <input
                      className="border-2 self-center text-center"
                      type="number"
                      placeholder="0"
                      key={product.default_price}
                      id={product.default_price}
                      {...register(product.default_price)}
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
