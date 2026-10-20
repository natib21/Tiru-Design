const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

root.innerHTML = `
  <main style="font-family: sans-serif; padding: 2rem;">
    <h1>Backoffice</h1>
    <p>App shell is running.</p>
  </main>
`;
