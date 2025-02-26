import React from 'react';
import { useNavigate } from 'react-router-dom';

function Report() {
    const navigate = useNavigate();

    const printButton = () => {
        window.print();
    };

    const backButton = () => {
        navigate('/');
    };

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
                        {/* Put data here */}
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
