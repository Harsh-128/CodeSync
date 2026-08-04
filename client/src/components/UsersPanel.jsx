function UsersPanel({ users }) {
    return (
        <div
            style={{
                background: "#252526",
                color: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.35)"
            }}
        >
            <h2
                style={{
                    marginTop: 0,
                    marginBottom: "20px",
                    textAlign: "center"
                }}
            >
                👥 Connected Users
            </h2>

            {users.length === 0 ? (
                <p style={{ textAlign: "center", color: "#aaa" }}>
                    No users connected
                </p>
            ) : (
                users.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "15px",
                            padding: "10px",
                            background: "#323233",
                            borderRadius: "10px"
                        }}
                    >
                        <div
                            style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                background: "#4CAF50",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                color: "white",
                                fontSize: "18px"
                            }}
                        >
                            {user.username.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <div
                                style={{
                                    fontWeight: "bold"
                                }}
                            >
                                {user.username}
                            </div>

                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#8BC34A"
                                }}
                            >
                                ● Online
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default UsersPanel;