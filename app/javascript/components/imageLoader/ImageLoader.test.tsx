import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import ImageLoader from "components/imageLoader/ImageLoader";

describe("<ImageLoader />", () => {
  it("hides the image until loaded", async () => {
    const alt = "cool item";
    const spinnerTestId = "loading-spinner";

    render(<ImageLoader alt={alt} src="someImage.jpg" />);

    expect(await screen.findByAltText(alt)).toBeInTheDocument();

    // The image should initially have no opacity
    expect(screen.getByAltText(alt)).toHaveClass("opacity-0");
    expect(screen.getByTestId(spinnerTestId)).toHaveClass("block");

    fireEvent.load(screen.getByAltText(alt));

    expect(await screen.findByAltText(alt)).toHaveClass("opacity-100");
    expect(screen.getByTestId(spinnerTestId)).toHaveClass("hidden");
  });

  it("adds the imageAdditionalClassName prop to the image", () => {
    const alt = "a picture";
    const imageAdditionalClassName = "some-class";

    render(
      <ImageLoader
        alt={alt}
        src="someImage.jpg"
        imageAdditionalClassName={imageAdditionalClassName}
      />
    );

    const image = screen.getByAltText(alt);

    expect(image).toHaveClass(imageAdditionalClassName);
  });
});
