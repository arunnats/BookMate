import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../userContext.js";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import QuizComp from "../components/QuizComp/QuizComp";
import QuizLanding from "../components/QuizLanding/QuizLanding";
import Countdown from "../components/Countdown/Countdown.jsx";
import styles from "../css/SquigglyLine.module.css";

const Quiz = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [startQuiz, setStartQuiz] = useState(false);
  const [bookmateStatus, setBookmateStatus] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [deadLine, setDeadLine] = useState(null);
  const nodeURL = import.meta.env.VITE_NODE_URL;
  const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

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
    const bookmateStatusGet = async () => {
      try {
        const response = await axios.get(`${nodeURL}get-bookmate-status`);
        const { status } = response.data;
        setBookmateStatus(status);
      } catch (error) {
        console.error("Error fetching bookmate status:", error.message);
      }
    };

    bookmateStatusGet();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (bookmateStatus === 0 || bookmateStatus === 3) {
      navigate("/");
    }
  }, [bookmateStatus, navigate]);

  const handleStartQuiz = () => {
    setStartQuiz((prev) => !prev);
  };

  return (
    <div
      className={`bg-primary mx-auto flex flex-col items-center  ${styles.box} mb-8 min-h-[88vh] overflow-hidden`}
    >
      {bookmateStatus === 1 && (
        <div className="flex flex-col mx-auto justify-center align-middle margin-auto overflow-hidden">
          <h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
            The next round of Bookmate starts in:
          </h1>
          {startTime && <Countdown targetDateTime={startTime} />}
          <div className="flex flex-row justify-center">
            <Link
              to="/find-your-match"
              className="btn btn-secondary m-2 font-poppins"
            >
              Let's Go!
            </Link>
          </div>
        </div>
      )}
      {bookmateStatus === 2 && (
        <div className="flex flex-col mx-auto justify-center align-middle margin-auto overflow-hidden">
          <h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
            Get your Bookmates in:
          </h1>
          {deadLine && <Countdown targetDateTime={deadLine} />}
          <div className="flex flex-row justify-center">
            <Link
              to="/find-your-match"
              //red
              className="btn btn-secondary m-2 font-poppins"
            >
              Let's Go!
            </Link>
          </div>
        </div>
      )}

      <QuizLanding onStartQuiz={handleStartQuiz} isQuizActive={startQuiz} />
      {startQuiz && <QuizComp setStartQuiz={setStartQuiz} />}

      <div className="min-h-[8vh]"></div>
    </div>
  );
};

export default Quiz;
