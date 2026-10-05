function UsersPanel({ users }) {
    return (
        <div className="left-panel">
            <div className="panel-title">👥 Collaborators ({users.length})</div>

            {users.length === 0 ? (
                <p className="no-users">No one else here yet</p>
            ) : (
                users.map((user) => (
                    <div key={user.id} className="user-item">
                        <div className="user-avatar">
                            {(user.username || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user.username}</div>
                            <div className="user-status">Online</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default UsersPanel;
