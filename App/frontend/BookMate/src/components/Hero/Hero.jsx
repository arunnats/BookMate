import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../../css/SquigglyLine.module.css";
import heroLogo from "../../assets/images/hero-image.png";
import map from "../../assets/images/map.png";
import { Link } from "react-router-dom";
import Countdown from "../Countdown/Countdown.jsx";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const imgRef = useRef(null);
  const mapRef = useRef(null);
  const [bookmateStatus, setBookmateStatus] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [deadLine, setDeadLine] = useState(null);
  const nodeURL = import.meta.env.VITE_NODE_URL;

  useEffect(() => {
    const startTimeGet = async () => {
      try {
        const response = await axios.get(`${nodeURL}get-starttime`);
        const { starttime } = response.data;
        setStartTime(starttime);
      } catch (error) {
        console.error("Error fetching start time:", error.message);
      }
    };

    const deadLineGet = async () => {
      try {
        const response = await axios.get(`${nodeURL}get-deadline`);
        const { deadline } = response.data;
        setDeadLine(deadline);
      } catch (error) {
        console.error("Error fetching deadline:", error.message);
      }
    };

    startTimeGet();
    deadLineGet();
  }, []);

  useEffect(() => {
    const bookmateStatusGetInit = async () => {
      try {
        const response = await axios.get(`${nodeURL}get-bookmate-status`);
        const { status } = response.data;
        setBookmateStatus(status);
      } catch (error) {
        console.error("Error fetching bookmate status:", error.message);
      }
    };

    bookmateStatusGetInit();
  }, []);

  useEffect(() => {
    const bookmateStatusGet = async () => {
      try {
        const response = await axios.get(`${nodeURL}get-bookmate-status`);
        const { status } = response.data;
        setBookmateStatus(status);
      } catch (error) {
        console.error("Error fetching bookmate status:", error.message);
      }
    };

    const intervalId = setInterval(bookmateStatusGet, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      onRepeat: () => {
        tl.invalidate();
      },
    });

    tl.to(imgRef.current, {
      rotate: ".8",
      duration: 1.2,
      ease: "none",
      y: -6,
      x: 1,
    }).to(imgRef.current, {
      rotate: "-.8",
      duration: 1.2,
      ease: "none",
      y: -4,
      x: -1,
    });

    gsap.fromTo(
      mapRef.current,
      {
        x: -30,
        y: 10,
        rotation: -17,
      },
      {
        x: 0,
        y: 190,
        rotation: 0,
        scrollTrigger: {
          trigger: mapRef.current,
          start: "bottom 90%",
          end: "bottom 25%",
          scrub: true,
          markers: false,
        },
      }
    );
  }, []);

  return (
    <div
      className={`relative md:min-h-[85vh] bg-primary flex items-center justify-center ${styles.box}`}
    >
      <div className="text-center text-neutral-content w-full overflow-hidden">
        {bookmateStatus === 1 && (
          <div className="flex flex-col w-[90%] justify-center align-middle margin-auto overflow-hidden">
            <h1 className="text-secondary font-poppins font-bold text-4xl text-center mt-6">
              The next round of Bookmate starts in:
            </h1>
            {startTime && <Countdown targetDateTime={startTime} />}
          </div>
        )}

        {bookmateStatus === 2 && (
          <div className="flex flex-col justify-center align-middle margin-auto  ">
            <h1 className="text-3xl text-secondary font-poppins font-bold my-3 text-center">
              Get your Bookmates in:
            </h1>
            {deadLine && <Countdown targetDateTime={deadLine} />}
          </div>
        )}

        {bookmateStatus === 3 && (
          <div className="flex flex-col  justify-center align-middle margin-auto overflow-hidden min-h-[100vh]">
            <h1 className="text-secondary font-poppins font-bold text-3xl text-center mt-6">
              Book Mate results are out!
            </h1>
            <div className="mx-auto">
              <Link
                to="/view-bookmate"
                className="btn btn-secondary m-2 font-poppins"
              >
                See your bookmate!
              </Link>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row min-w-[100vw] m-auto p-3">
          <div className=" lg:w-[9%] flex flex-col-reverse"></div>
          <div className=" lg:w-[46%] flex items-center justify-center">
            <img
              ref={imgRef}
              src={heroLogo}
              alt="Hero"
              className="max-w-full h-auto object-contain align-middle justify-center p-8"
            />
          </div>
          <div className=" lg:w-[31%] flex flex-col items-center justify-center">
            <p className="text-xl 2xl:text-2xl text-accent font-montserrat font-medium text-justify p-5 md:p-1 md:mt-14	">
              Book Mate is the perfect way to find your next read and the person
              to read with! Finding individuals with the same taste as yourself
              has never been easier, thanks to our AI-powered match engine. So
              what are you waiting for!?
            </p>
            <div className="flex flex-row justify-center">
              <Link
                className="btn btn-secondary m-2 font-poppins mb-12"
                to="/find-your-match"
              >
                Find Your Book Mate!
              </Link>
            </div>
          </div>
          <div className="hidden lg:w-[14%] md:flex flex-col-reverse items-center ">
            <img
              ref={mapRef}
              src={map}
              alt="MapImg"
              className="max-w-full h-auto object-contain py-20 pr-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
