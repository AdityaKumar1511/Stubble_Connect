/* --- Config --- */
const translations = {
    en: {
        heroTitle: "Turn Stubble into <br><span class='gradient-text'>Gold</span>",
        heroSub: "The first AI-powered marketplace connecting farmers with biomass industries. Stop burning, start earning.",
        loginBtn: "Login / Join",
        joinFarmer: "I am a Farmer",
        joinBuyer: "I am a Buyer",
        solTitle: "How It Works",
        step1Title: "1. Scan", step1Desc: "Take a photo of your field. Our AI calculates the stubble amount.",
        step2Title: "2. Connect", step2Desc: "Get matched with nearby paper mills or bio-energy plants.",
        step3Title: "3. Pickup", step3Desc: "Logistics partners collect the waste from your doorstep.",
        step4Title: "4. Earn", step4Desc: "Get paid instantly + Earn Green Carbon Credits."
    },
    hi: {
        heroTitle: "पराली को बदलें <br><span class='gradient-text'>सोने में</span>",
        heroSub: "किसानों को बायोमास उद्योगों से जोड़ने वाला पहला AI बाज़ार। जलाना बंद करें, कमाना शुरू करें।",
        loginBtn: "लॉगिन / जुड़ें",
        joinFarmer: "मैं किसान हूँ",
        joinBuyer: "मैं खरीदार हूँ",
        solTitle: "यह कैसे काम करता है",
        step1Title: "1. स्कैन करें", step1Desc: "अपने खेत की फोटो लें। हमारा AI पराली की मात्रा बताएगा।",
        step2Title: "2. कनेक्ट करें", step2Desc: "नजदीकी पेपर मिलों या ऊर्जा संयंत्रों से जुड़ें।",
        step3Title: "3. पिकअप", step3Desc: "लॉजिस्टिक्स पार्टनर आपके दरवाजे से कचरा उठाएंगे।",
        step4Title: "4. कमाएं", step4Desc: "तुरंत भुगतान पाएं + ग्रीन कार्बन क्रेडिट अर्जित करें।"
    }
};

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // 2. Language Toggle
    const langBtn = document.getElementById('lang-toggle');
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        langBtn.querySelector('span').innerText = currentLang === 'en' ? 'हिंदी' : 'English';
        updateLanguage();
    });

    // 3. Scroll Animation (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('show-el');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden-el');
    hiddenElements.forEach((el) => observer.observe(el));

    // 4. Counter Animation
    startCounters();
});

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key]; // innerHTML allows HTML tags in strings
        }
    });
}

function startCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = '0';
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / 100;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}