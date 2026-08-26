
function AuthPage({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const isLogin = mode === "login"
  return <main className="auth-page">
    <section className="auth-scene" aria-hidden="true">
      <button className="auth-back visual" onClick={onBack}>← Back to home</button>
      <div className="auth-moon" />
      <div className="auth-cork"><div className="auth-string one" /><div className="auth-string two" /><div className="auth-note note-a"><span>✦</span> every question<br />deserves a map</div><div className="auth-note note-b">make room<br />for curiosity</div><div className="auth-pin" /></div>
      <p className="auth-scene-caption">YOUR QUIET CORNER FOR BIG IDEAS</p>
    </section>
    <section className="auth-form-side">
      <div className="auth-top"><button className="auth-back mobile-only" onClick={onBack}>← Home</button><div className="brand-mark"><span>m</span><b>MindBoard</b></div><p>{isLogin ? "New here?" : "Already have a map?"} <button onClick={() => setMode(isLogin ? "signup" : "login")}>{isLogin ? "Create an account" : "Log in"}</button></p></div>
      <div className="auth-paper"><p className="auth-kicker">{isLogin ? "WELCOME BACK" : "BEGIN YOUR FIRST MAP"}</p><h1>{isLogin ? <>Pick up your<br /><em>thread.</em></> : <>Make room for<br /><em>curiosity.</em></>}</h1><p className="auth-intro">{isLogin ? "Your learning room has been waiting for you." : "Your personal learning room is one thoughtful step away."}</p>
        <div className="auth-tabs"><button className={isLogin ? "active" : ""} onClick={() => setMode("login")}>Log in</button><button className={!isLogin ? "active" : ""} onClick={() => setMode("signup")}>Create account</button></div>
        <form onSubmit={(event) => { event.preventDefault(); onContinue() }}>
          {!isLogin && <label>NAME<input required placeholder="Your name" /></label>}
          <label>EMAIL<input required type="email" placeholder="you@example.com" /></label>
          <label>PASSWORD<span className="password-wrap"><input required type={showPassword ? "text" : "password"} placeholder="••••••••" /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button></span></label>
          {isLogin && <div className="auth-options"><label className="remember"><input type="checkbox" /> <span>Remember me</span></label><button type="button">Forgot password?</button></div>}
          <button className="auth-submit" type="submit">{isLogin ? "Enter my learning room" : "Create my learning room"}<span>→</span></button>
        </form>
        <div className="or"><span>or continue with</span></div><button className="google-button" onClick={onContinue}><b>G</b> Google</button><small className="auth-terms">By continuing, you agree to MindBoard’s Terms and Privacy Policy.</small>
      </div>
    </section>
  </main>
}
