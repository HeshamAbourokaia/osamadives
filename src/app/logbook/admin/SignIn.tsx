export default function SignIn({ wrong }: { wrong: boolean }) {
  return (
    <main className="lb-signin">
      <form className="lb-signin__box" method="post" action="/api/logbook/login">
        <img src="/brand/stamp-512.png" alt="" width={96} height={96} />
        <h1 className="lb-h2">Reviews</h1>
        <p className="lb-stand">Sign in to read what divers have written and put it on the site.</p>
        <label className="lb-field">
          <span className="lb-mono">Passcode</span>
          <input
            name="key"
            type="password"
            className="lb-admin__input"
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={wrong || undefined}
          />
        </label>
        {wrong ? <p className="lb-signin__no" role="alert">That passcode is not right. Try again.</p> : null}
        <button type="submit" className="lb-btn">Sign in</button>
      </form>
    </main>
  );
}
