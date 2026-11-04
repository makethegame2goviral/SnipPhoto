import { supabase } from './supabase.js';

const root = document.getElementById('auth-root');
const aliasFor = (username) => `${username.trim().toLowerCase()}@accounts.snipphoto.invalid`;

function showAuth() {
  if (!root) return;
  root.innerHTML = `
    <section class="auth-screen">
      <div class="auth-card">
        <div class="auth-logo">s</div>
        <p class="auth-kicker">DEINE MOMENTE. DEINE FREUNDE.</p>
        <h1>Willkommen bei SnipPhoto</h1>
        <p class="auth-subtitle">Melde dich an oder erstelle dein Konto.</p>
        <div class="auth-tabs">
          <button type="button" class="auth-tab active" data-auth-mode="login">Anmelden</button>
          <button type="button" class="auth-tab" data-auth-mode="register">Registrieren</button>
        </div>
        <form id="auth-form" class="auth-form">
          <label>Benutzername
            <input name="username" type="text" autocomplete="username" minlength="3" maxlength="20" pattern="[A-Za-z0-9_]{3,20}" placeholder="DeinName" required>
          </label>
          <label>Passwort
            <input name="password" type="password" autocomplete="current-password" minlength="8" maxlength="72" placeholder="Mindestens 8 Zeichen" required>
          </label>
          <p class="auth-error" id="auth-error" role="alert"></p>
          <button class="auth-submit" type="submit" id="auth-submit">Anmelden</button>
        </form>
        <p class="auth-footnote">Du brauchst keine E-Mail-Adresse. Verwende einen Benutzernamen und ein sicheres Passwort.</p>
      </div>
    </section>`;

  let mode = 'login';
  const form = root.querySelector('#auth-form');
  const submit = root.querySelector('#auth-submit');
  const errorBox = root.querySelector('#auth-error');

  root.querySelectorAll('[data-auth-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      mode = button.dataset.authMode;
      root.querySelectorAll('[data-auth-mode]').forEach((item) => item.classList.toggle('active', item === button));
      submit.textContent = mode === 'register' ? 'Konto erstellen' : 'Anmelden';
      form.querySelector('[name="password"]').setAttribute('autocomplete', mode === 'register' ? 'new-password' : 'current-password');
      errorBox.textContent = '';
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.textContent = '';
    const values = new FormData(form);
    const username = String(values.get('username') || '').trim();
    const password = String(values.get('password') || '');
    if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
      errorBox.textContent = 'Benutzername: 3–20 Zeichen, nur Buchstaben, Zahlen und _.';
      return;
    }
    if (password.length < 8) {
      errorBox.textContent = 'Dein Passwort muss mindestens 8 Zeichen haben.';
      return;
    }

    submit.disabled = true;
    submit.textContent = mode === 'register' ? 'Konto wird erstellt…' : 'Anmeldung…';
    try {
      const email = aliasFor(username);
      if (mode === 'register') {
        const { error: registerError } = await supabase.functions.invoke('snipphoto-register', {
          body: { username, password },
        });
        if (registerError) throw registerError;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        if (mode === 'register') throw new Error('Konto erstellt, aber Anmeldung fehlgeschlagen. Bitte melde dich jetzt an.');
        throw new Error('Benutzername oder Passwort ist nicht richtig.');
      }
      root.innerHTML = '';
    } catch (error) {
      errorBox.textContent = error?.message || 'Das hat nicht funktioniert. Bitte erneut versuchen.';
    } finally {
      if (root.querySelector('#auth-submit')) {
        submit.disabled = false;
        submit.textContent = mode === 'register' ? 'Konto erstellen' : 'Anmelden';
      }
    }
  });
}

async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) showAuth();
  supabase.auth.onAuthStateChange((_event, sessionNow) => {
    if (sessionNow) root.innerHTML = '';
    else showAuth();
  });
}

initAuth().catch(() => showAuth());