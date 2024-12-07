import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const ImageLoader: React.FC<{
  src: string;
  alt: string;
  additionalClassName?: string;
}> = ({ src, additionalClassName, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative ${additionalClassName ? additionalClassName : ""}`}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`opacity-0 transition-opacity duration-1000 ${
          loaded ? "opacity-100" : ""
        } `}
      />

      <FontAwesomeIcon
        icon={faSpinner}
        data-testid="loading-spinner"
        spin
        className={`absolute inset-0 m-auto w-1/2 h-1/2 ${
          loaded ? "hidden" : "block"
        }`}
      />
    </div>
  );
};

export default ImageLoader;
