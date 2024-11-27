import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Footer = () => {
  return (
    <footer className="grid place-content-center mt-4 py-4 text-center bg-gradient-to-b from-gray-950 to-blue-950">
      <div className="mb-4">
        <p className="font-bold text-lg">Doug Crawford</p>
        <p>
          <a href="mailto: doug.a.crawford@gmail.com">
            doug.a.crawford@gmail.com
          </a>
        </p>
        <p>760-219-0584</p>
      </div>
      <div>
        <a
          href="https://dacraw.github.io"
          className="font-bold mb-4 block hover:underline"
          target="_blank"
        >
          &rArr; View My Portfolio &lArr;
        </a>
        <div className="flex gap-4 justify-center">
          <a
            target="_blank"
            href="https://www.linkedin.com/in/doug-a-crawford/"
          >
            <FontAwesomeIcon
              size="lg"
              className="hover:opacity-80 transition-opacity duration-300"
              bounce
              icon={faLinkedin}
            />
          </a>
          <a target="_blank" href="https://github.com/dacraw">
            <FontAwesomeIcon
              size="lg"
              className="hover:opacity-80 transition-opacity duration-300"
              bounce
              icon={faGithub}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
