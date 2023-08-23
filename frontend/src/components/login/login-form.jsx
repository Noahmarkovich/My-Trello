export function LoginForm({ isSignUp, onSignUp, onLogin, credentials, handleChange, err }) {
  return (
    <form
      className="login-form"
      onSubmit={(ev) => {
        isSignUp ? onSignUp(ev) : onLogin(ev);
      }}>
      {isSignUp && (
        <input
          placeholder="Enter your full name"
          type="text"
          name="fullName"
          value={credentials.fullName}
          onChange={handleChange}
          required
        />
      )}
      <input
        placeholder="Enter your email"
        type="text"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        required
      />

      <input
        placeholder="Enter your password"
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        required
      />

      {err && <div className="err">{err}</div>}
      <button>Continue</button>
    </form>
  );
}
