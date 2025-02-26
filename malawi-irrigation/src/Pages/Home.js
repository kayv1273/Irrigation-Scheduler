import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [selectedDate, setSelectedDate] = useState('');
    const navigate = useNavigate();

    // Handler for date change
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // Function to get zone water rate data
    const getZoneData = () => {
        const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
        let zoneData = [];

        zones.forEach(zone => {
        const inputElement = document.getElementById(`waterRate_${zone}`);
        if (inputElement) {
            const waterRate = Math.max(0, parseFloat(inputElement.value)) || 0;
            zoneData.push({
                zoneID: zone,
                waterRate: waterRate
            });
        }
        });

        // Get selected date value or current date
        let date = selectedDate || getCurrentDate();
        const [year, month, day] = date.split("-");

        // Store values in localStorage
        localStorage.setItem("month", JSON.stringify(month));
        localStorage.setItem("day", JSON.stringify(day));
        localStorage.setItem("year", JSON.stringify(year));
        localStorage.setItem("zoneData", JSON.stringify(zoneData));

        // Print out data for error checking
        console.log("Selected Day is:", day);
        console.log("Selected Month is:", month);
        console.log("Selected Year is:", year);
        console.log(zoneData);
    };

    // Function to get current date
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // Generate report
    const generateReport = () => {
        getZoneData();
        navigate('/report');
    };

    return (
        <div>
            <br/>
            <br/>
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "38px" }}>Irrigation Schedule Generator</h1>
            </div>
            <div className="container">
                <div className="card rounded-lg" style={{ width: "69rem", margin: "auto", backgroundColor: "white", borderRadius: "10px" }}>
                    <div className="card-body" style={{ paddingLeft: "40px", paddingTop: "20px", paddingRight: "20px", paddingBottom: "20px" }}>
                        <h3 className="card-title" style={{ fontSize: "26px" }}>Water Rate Value Inputs</h3>
                            <p style={{ color: "gray", fontSize: "16px" }} className="card-description" >
                                Input water application rate values in centimeters.
                            </p>
                            <br />
                            <form>
                            {/* Zone Location Image */}
                                <div className="card rounded-lg"
                                    style={{
                                    width: "1000px",
                                    height: "800px",
                                    margin: "auto",
                                    backgroundImage: `url(${process.env.PUBLIC_URL + '/zones.png'})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    position: "relative"
                                    }}>
                                    <div className="card-body p-5">
                                        {/* Top Row: A, B, C, D, E, F */}
                                        <div id="zoneID_A" className="col-sm-7" style={{ position: "absolute", left: "13%", top: "10%" }}>
                                            <input type="number" className="form-control" id="waterRate_A" name="waterRate_A" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_B" className="col-sm-7" style={{ position: "absolute", left: "26%", top: "10%" }}>
                                            <input type="number" className="form-control" id="waterRate_B" name="waterRate_B" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_C" className="col-sm-7" style={{ position: "absolute", left: "36%", top: "10%" }}>
                                            <input type="number" className="form-control" id="waterRate_C" name="waterRate_C" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_D" className="col-sm-7" style={{ position: "absolute", left: "48%", top: "10%" }}>
                                            <input type="number" className="form-control" id="waterRate_D" name="waterRate_D" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_E" className="col-sm-7" style={{ position: "absolute", left: "59%", top: "10%" }}>
                                            <input type="number" className="form-control" id="waterRate_E" name="waterRate_E" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_F" className="col-sm-7" style={{ position: "absolute", left: "70%", top: "10%" }}>
                                            <input type="number" className="form-control" id="waterRate_F" name="waterRate_F" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>

                                        {/* Second Row: G, H, I, J, K, L */}
                                        <div id="zoneID_G" className="col-sm-7" style={{ position: "absolute", left: "13%", top: "30%" }}>
                                            <input type="number" className="form-control" id="waterRate_G" name="waterRate_G" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_H" className="col-sm-7" style={{ position: "absolute", left: "26%", top: "30%" }}>
                                            <input type="number" className="form-control" id="waterRate_H" name="waterRate_H" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_I" className="col-sm-7" style={{ position: "absolute", left: "36%", top: "30%" }}>
                                            <input type="number" className="form-control" id="waterRate_I" name="waterRate_I" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_J" className="col-sm-7" style={{ position: "absolute", left: "48%", top: "30%" }}>
                                            <input type="number" className="form-control" id="waterRate_J" name="waterRate_J" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_K" className="col-sm-7" style={{ position: "absolute", left: "59%", top: "30%" }}>
                                            <input type="number" className="form-control" id="waterRate_K" name="waterRate_K" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_L" className="col-sm-7" style={{ position: "absolute", left: "70%", top: "30%" }}>
                                            <input type="number" className="form-control" id="waterRate_L" name="waterRate_L" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>

                                        {/* Third Row: M, N, O, P, Q */}
                                        <div id="zoneID_M" className="col-sm-7" style={{ position: "absolute", left: "23%", top: "39%" }}>
                                            <input type="number" className="form-control" id="waterRate_M" name="waterRate_M" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_N" className="col-sm-7" style={{ position: "absolute", left: "33%", top: "39%" }}>
                                            <input type="number" className="form-control" id="waterRate_N" name="waterRate_N" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_O" className="col-sm-7" style={{ position: "absolute", left: "48%", top: "39%" }}>
                                            <input type="number" className="form-control" id="waterRate_O" name="waterRate_O" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_P" className="col-sm-7" style={{ position: "absolute", left: "59%", top: "39%" }}>
                                            <input type="number" className="form-control" id="waterRate_P" name="waterRate_P" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_Q" className="col-sm-7" style={{ position: "absolute", left: "70%", top: "39%" }}>
                                            <input type="number" className="form-control" id="waterRate_Q" name="waterRate_Q" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>

                                        {/* Last Row: R, S, T, U, V */}
                                        <div id="zoneID_R" className="col-sm-7" style={{ position: "absolute", left: "23%", top: "59%" }}>
                                            <input type="number" className="form-control" id="waterRate_R" name="waterRate_R" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_S" className="col-sm-7" style={{ position: "absolute", left: "33%", top: "59%" }}>
                                            <input type="number" className="form-control" id="waterRate_S" name="waterRate_S" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_T" className="col-sm-7" style={{ position: "absolute", left: "48%", top: "59%" }}>
                                            <input type="number" className="form-control" id="waterRate_T" name="waterRate_T" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_U" className="col-sm-7" style={{ position: "absolute", left: "59%", top: "59%" }}>
                                            <input type="number" className="form-control" id="waterRate_U" name="waterRate_U" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                        <div id="zoneID_V" className="col-sm-7" style={{ position: "absolute", left: "70%", top: "59%" }}>
                                            <input type="number" className="form-control" id="waterRate_V" name="waterRate_V" required style={{ width: "80px", height: "30px", fontSize: "14px", borderRadius: "5px", border: "1px solid gray" }} />
                                        </div>
                                    </div>
                                </div>
                            <div>
                                <br></br>
                                <br></br>
                                {/* Date Selection */}
                                <div className="form-group row mt-2">
                                    <div className="col-sm-12 text-center">
                                        <label htmlFor="select-date" style={{ marginRight: '10px' }}>Select Date:</label>
                                        <input
                                            type="date"
                                            id="select-date"
                                            className="form-control"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            style={{ display: 'inline-block', width: '115px', height: '28px', fontSize: '18px' }} // Adjust values as needed
                                        />
                                    </div>
                                </div>

                                <br></br>
                                {/* Submit button */}
                                <div className="form-group row mt-3">
                                    <div className="col-sm-12 text-center">
                                        <button
                                            style={{
                                            backgroundColor: '#1d6fab',
                                            color: 'white',
                                            borderColor: '#1d6fab',
                                            borderRadius: '6px',
                                            }}
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={generateReport}
                                        >
                                            Generate Report
                                        </button>
                                        <br></br>
                                        <br></br>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
        </div>
    );
}

export default Home;