fetch("https://www.google.com")
  .then((r) => console.log("Google:", r.status))
  .catch(console.error);