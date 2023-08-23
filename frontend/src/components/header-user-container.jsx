export function HeaderUserContainer({
  user,
  onClickUserOption,
  isOptionOpen,
  optionRef,
  onLogout
}) {
  return (
    <section className="user-container">
      <button
        onClick={onClickUserOption}
        style={{ backgroundColor: user.avatar.color }}
        className="avatar">
        {user.avatar ? user.avatar.initials : 'NM'}
      </button>
      {isOptionOpen && (
        <div className="user-options" ref={optionRef}>
          <h2 className="options-header">ACCOUNT</h2>
          <div className="user-info">
            <div style={{ backgroundColor: user.avatar.color }} className="avatar">
              {user.avatar ? user.avatar.initials : 'NM'}
            </div>
            <div>
              <h3>{user.fullName}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="option">
            <a onClick={onLogout}>Switch accounts</a>
          </div>
          <div className="option">
            <a onClick={onLogout}>Log out</a>
          </div>
        </div>
      )}
    </section>
  );
}
