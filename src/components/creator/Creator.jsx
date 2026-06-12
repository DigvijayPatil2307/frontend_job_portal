import React from "react";
import Navbar from "../components_lite/Navbar";
import project_guide from "./project_guide.jpeg";
import barka_digu from "./barka_digu.jpeg";
import digvijay from "./digvijay.jpeg";
import digu_pudhri from "./digu_pudhri.jpeg";
import rohit_Bhai from "./rohit_Bhai.jpeg";

const Creator = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full">
          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src={project_guide}
              alt="Tushar Sir"
              className="h-80 object-cover rounded-lg shadow-md"
            />
          </div>
          {/* Text Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Prof. Tushar Sathe Sir
            </h2>
            <p className="text-gray-600 mb-2">
              Dr. Amresh Kumar completed his{" "}
              <strong>
                B.Tech in Electronics and Communication Engineering (ECE)
              </strong>{" "}
              from{" "}
              <strong>
                Shivnand Singh Institution of Technology and Management, Aligarh
              </strong>
              , in <strong>2002</strong>.
            </p>
            <p className="text-gray-600 mb-2">
              After graduation, he joined{" "}
              <strong>Koderma Mines Institution</strong> as a{" "}
              <strong>part-time lecturer</strong>. He then pursued his{" "}
              <strong>M.Tech in Electrical Engineering</strong> from{" "}
              <strong>BIT Sindri, Dhanbad</strong>.
            </p>
            <p className="text-gray-600 mb-2">
              He was later selected as an <strong>Assistant Professor</strong>{" "}
              in the{" "}
              <strong>
                Electronics and Communication Engineering (ECE) Department
              </strong>{" "}
              at <strong>MIT Muzaffarpur</strong>. During his tenure there, he
              also completed his{" "}
              <strong>Ph.D. in Electrical Engineering</strong> from{" "}
              <strong>Bihar University, Muzaffarpur, in 2016</strong>.
            </p>
            <p className="text-gray-600">
              Following his Ph.D., he was transferred to{" "}
              <strong>
                Rashtrakavi Ramdhari Singh Dinkar College of Engineering
                (RRSDCE)
              </strong>{" "}
              as an{" "}
              <strong>
                Assistant Professor in the Electrical and Electronics
                Engineering (EEE) Department
              </strong>
              , where he continues to serve till date.
            </p>
          </div>
        </div>
      </div>

      <hr className="w-full border-gray-300 my-6" />

      <div className="text-center p-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Developers and Designers
        </h2>

        {/* Changed to grid-cols-2 for mobile and grid-cols-4 for desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
          {/* Developer 1 */}
          <a
            href="https://ankitpathak.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block text-center"
          >
            <div className="overflow-hidden rounded-lg shadow-md aspect-square mb-3">
              <img
                src={barka_digu}
                alt="Digvijay Patil"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Digvijay Patil
            </h3>
            <p className="text-gray-500 text-sm">Full Stack Developer</p>
          </a>

          {/* Developer 2 */}
          <a href="#" className="group block text-center">
            <div className="overflow-hidden rounded-lg shadow-md aspect-square mb-3">
              <img
                src={rohit_Bhai}
                alt="Rohit Bhosale"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Rohit Bhosale
            </h3>
            <p className="text-gray-500 text-sm">Frontend Developer</p>
          </a>

          {/* Developer 3 */}
          <a href="#" className="group block text-center">
            <div className="overflow-hidden rounded-lg shadow-md aspect-square mb-3">
              <img
                src={digu_pudhri}
                alt="Divyashil Patil"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Divyashil Patil
            </h3>
            <p className="text-gray-500 text-sm">Frontend Developer</p>
          </a>

          {/* Developer 4 */}
          <a href="#" className="group block text-center">
            <div className="overflow-hidden rounded-lg shadow-md aspect-square mb-3">
              <img
                src={digvijay}
                alt="Digvijay Patil"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Digvijay Patil
            </h3>
            <p className="text-gray-500 text-sm">Full Stack Developer</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Creator;
