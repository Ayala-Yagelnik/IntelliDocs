import React from 'react';

const TermsOfService: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Terms of Service</h1>
            <p>
                Welcome to our application. By using our services, you agree to the following terms and conditions:
            </p>
            <ul>
                <li>You must not use the service for any illegal or unauthorized purpose.</li>
                <li>We reserve the right to modify or terminate the service for any reason, without notice at any time.</li>
                <li>Your use of the service is at your sole risk.</li>
                <li>We are not responsible for any damages or losses resulting from your use of the service.</li>
            </ul>
            <p>
                Please read these terms carefully. If you do not agree to these terms, do not use our services.
            </p>
        </div>
    );
};

export default TermsOfService;