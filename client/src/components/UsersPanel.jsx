function UsersPanel({ users }) {

    return (

        <div
            style={{
                width: "220px",
                background: "#252526",
                color: "white",
                padding: "15px",
                borderRadius: "8px",
                marginRight: "20px"
            }}
        >

            <h3>👥 Connected Users</h3>

            {
                users.length === 0 ? (
                    <p>No users connected</p>
                ) : (
                    users.map((user, index) => (
                        <p key={index}>
                            🟢 {user.username}
                        </p>
                    ))
                )
            }

        </div>

    );

}

export default UsersPanel;