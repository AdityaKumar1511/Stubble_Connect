const text = {
  en: {
    hero: "Sell Stubble. Don’t Burn It.",
    login: "Login",
    farmer: "Farmer Login",
  },
  hi: {
    hero: "पराली जलाएं नहीं, बेचें",
    login: "लॉगिन",
    farmer: "किसान लॉगिन",
  }
};

let lang = "en";

function toggleLang() {
  lang = lang === "en" ? "hi" : "en";
  document.querySelector("[data-hero]").innerText = text[lang].hero;
}
