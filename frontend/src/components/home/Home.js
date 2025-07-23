import React, { useState, useRef, useCallback } from 'react';
import "./home.css";
// import { Link } from 'react-router-dom';
import axios from "axios";
import Webcam from "react-webcam";

export default function Home() {

    const [isActive, setActive] = useState(false);
    const [NAME, setNAME] = useState("");
    const [loadingSignin, setLoadingSignin] = useState(false);
    const [loadingSignup, setLoadingSignup] = useState(false);
    const [resultSignin, setResultSignin] = useState("");
    const [resultSignup, setResultSignup] = useState("");

    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 200,
        height: 200,
        facingMode: "user",
    };

    const ToggleClass = () => {
        setActive(!isActive);
        setResultSignin('');
        setResultSignup('');
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(`Captured image`);

        setLoadingSignin(true);
        setResultSignin("");

        axios.post("http://127.0.0.1:5000/api", { data: imageSrc })
            .then((res) => {
                console.log(`Server response:`, res.data);
                setLoadingSignin(false);

                if (res.data !== 'Nobody') {
                    setResultSignin(`Welcome, ${res.data}!`);
                } else {
                    setResultSignin("No user found. Try again.");
                }
            })
            .catch((error) => {
                console.error("Error during Sign In:", error);
                setLoadingSignin(false);
                setResultSignin("Error connecting to server. Please try again.");
            });
    }, [webcamRef]);

    const capture2 = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(`Captured image for storing`);

        setLoadingSignup(true);
        setResultSignup("");

        axios.post("http://127.0.0.1:5000/store", { data: imageSrc, namex: NAME })
            .then((res) => {
                console.log(`Stored successfully`);
                setLoadingSignup(false);
                setResultSignup(`Registered successfully as ${NAME}!`);
                setNAME('');
            })
            .catch((error) => {
                console.error("Error during Sign Up:", error);
                setLoadingSignup(false);
                setResultSignup("Error saving user. Please try again.");
            });
    }, [webcamRef, NAME]);

    function mainSignin() {
        capture();
    }

    function mainSignup() {
        if (NAME.trim() === "") {
            setResultSignup("❌ Please enter your name before signing up.");
            return;
        }
        capture2();
    }

    return (
        <div>
            <p className="tip">Welcome to Face Recognition</p>

            <div className={isActive ? "cont s--signup" : "cont"}>

                {/* Sign In Section */}
                <div className="form sign-in">
                    <h2>Welcome back,</h2>

                    <label>
                        <div className="webcam">
                            <Webcam
                                audio={false}
                                height={300}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={350}
                                videoConstraints={videoConstraints}
                            />
                        </div>
                    </label>

                    {/* Sign In button or Loader */}
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        {loadingSignin ? (
                            <div className="loader"></div>
                        ) : (
                            <button type='button' onClick={mainSignin} className='submit' id='ach'>
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Result */}
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        {resultSignin && <h2 style={{ fontWeight: "bold", color: "#333" }}>{resultSignin}</h2>}
                    </div>
                </div>

                {/* Sign Up Section */}
                <div className="sub-cont">

                    <div className="img">
                        <div className="img__text m--up">
                            <h2>New here?</h2>
                            <p>Sign up and discover great opportunities!</p>
                        </div>
                        <div className="img__text m--in">
                            <h2>One of us?</h2>
                            <p>If you already have an account, just sign in. We've missed you!</p>
                        </div>
                        <div className="img__btn" onClick={ToggleClass}>
                            <span className="m--up">Sign Up</span>
                            <span className="m--in">Sign In</span>
                        </div>
                    </div>

                    <div className="form sign-up">
                        <h2>Time to feel like home,</h2>

                        <form>

                            <label>
                                <span>Name</span>
                                <input
                                    type="text"
                                    value={NAME}
                                    onChange={(e) => setNAME(e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                <div className="webcam">
                                    <Webcam
                                        audio={false}
                                        height={300}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        width={350}
                                        videoConstraints={videoConstraints}
                                    />
                                </div>
                            </label>

                            {/* Sign Up button or Loader */}
                            <div style={{ marginTop: "20px", textAlign: "center" }}>
                                {loadingSignup ? (
                                    <div className="loader"></div>
                                ) : (
                                    <button type="button" onClick={mainSignup} className="submit">
                                        Sign Up
                                    </button>
                                )}
                            </div>

                            {/* Result */}
                            <div style={{ marginTop: "20px", textAlign: "center" }}>
                                {resultSignup && <h4 style={{ fontWeight: "bold", color: resultSignup.includes('❌') ? "red" : "#333" }}>
                                    {resultSignup}
                                </h4>}
                            </div>

                        </form>
                    </div>

                </div>

            </div>
        </div>
    )
}
