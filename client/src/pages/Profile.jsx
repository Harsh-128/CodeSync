import React from "react";

function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="profile-container">
            <h1>Profile</h1>

            <div className="profile-card">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>
        </div>
    );
}

export default Profile;