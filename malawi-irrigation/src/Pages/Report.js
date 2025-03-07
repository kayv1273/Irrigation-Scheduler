import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeIrrigationSystem } from '../ReportFunctions';
import '../App.css';

function Report() {
    const navigate = useNavigate();

    const printButton = () => {
        window.print();
    };
    const backButton = () => {
        navigate('/');
    };

    const [finalSchedule, setFinalSchedule] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const spreadsheetId = '1h1a0qYki7aZGx8OeDCtUg9nyEaHSwkme4cPaloFoLYs';

            const fetchZoneData = async () => {
                const range = 'ZoneData';
                try {
                    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=AIzaSyBzRryvpYd5QJbzYhNYCdVBao4xn_L0CH8`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const result = await response.json();
                    return result.values;
                } catch (err) {
                    console.log(err);
                    return null;
                }
            };

            const fetchPumpData = async () => {
                const range = 'PumpData';
                try {
                    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=AIzaSyBzRryvpYd5QJbzYhNYCdVBao4xn_L0CH8`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const result = await response.json();
                    return result.values;
                } catch (err) {
                    console.log(err);
                    return null;
                }
            };

            const zoneData = await fetchZoneData();
            const solarData = await fetchPumpData();

            const schedule = initializeIrrigationSystem({ zoneData, solarData });
            setFinalSchedule(schedule);
        };

        fetchData();
    }, []);


    return (
        <div>
            <br/>
            <br/>
            <div style={{ textAlign: 'center', fontSize: "18px" }}>
                <h1>Water Schedule</h1>
            </div>
            <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                <table className="table table-striped custom-table"
                    style={{ backgroundColor: 'white', width: '80%', margin: 'auto', fontSize: '1.1rem'}} >
                    <thead>
                    <tr>
                        <th scope="col" style={{ padding: '15px', textAlign: 'center'}}>
                            Zone ID
                        </th>
                        <th scope="col" style={{ padding: '15px', textAlign: 'center'}}>
                            Start Time
                        </th>
                        <th scope="col" style={{ padding: '15px', textAlign: 'center'}}>
                            Stop Time
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                        {finalSchedule.map((zone, index) => (
                            <tr key={index}>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{zone.zoneID}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{zone.startTime}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{zone.stopTime}</td>
                            </tr>
                        ))}
                </tbody>
                </table>
            </div>
            <br/>
            <br/>
            <div style={{ textAlign: 'center' }}>
                <button
                    style={{
                    backgroundColor: '#1d6fab',
                    color: 'white',
                    borderColor: '#1d6fab',
                    borderRadius: '6px',
                    boxShadow: 'none',
                    }}
                    className="btn btn-secondary"
                    type="button"
                    onClick={printButton}
                >
                    Print
                </button>
                <button
                    style={{
                    backgroundColor: '#1d6fab',
                    color: 'white',
                    borderColor: '#1d6fab',
                    borderRadius: '6px',
                    boxShadow: 'none',
                    }}
                    className="btn btn-secondary"
                    type="button"
                    onClick={backButton}
                >
                    Back
                </button>
            </div>
            <br/>
        </div>
    );
}

export default Report;