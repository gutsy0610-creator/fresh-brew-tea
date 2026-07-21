// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Start Countdown Timer
    startCountdown();

    // Start Social Proof Toast system
    startSocialProofToasts();

    // Initialize Active Card Styles on Form Load
    updateSelectCardBorders();
    updateSubscriptionPrice();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            const isOpen = !mobileMenu.classList.contains("hidden");
            mobileMenuBtn.innerHTML = isOpen 
                ? `<i data-lucide="x" class="w-6 h-6"></i>` 
                : `<i data-lucide="menu" class="w-6 h-6"></i>`;
            lucide.createIcons();
        });
    }

    // Close mobile menu on clicking any navigation link
    document.querySelectorAll(".mobile-nav-link").forEach(link => {
        link.addEventListener("click", () => {
            if (mobileMenu) {
                mobileMenu.classList.add("hidden");
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = `<i data-lucide="menu" class="w-6 h-6"></i>`;
                    lucide.createIcons();
                }
            }
        });
    });
});

// ==========================================
// 1. COUNTDOWN TIMER LOGIC
// ==========================================
function startCountdown() {
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const centisecondsEl = document.getElementById("centiseconds");
    const progressBar = document.getElementById("progress-bar");
    const progressPercent = document.getElementById("progress-percent");

    function update() {
        const now = new Date();
        
        // Target is today at 14:00 (2:00 PM) KST
        let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0, 0);
        
        // If current time is past 14:00 today, the next cutoff target is tomorrow at 14:00
        if (now.getTime() >= target.getTime()) {
            target.setDate(target.getDate() + 1);
        }

        const diff = target.getTime() - now.getTime();
        
        // Math calculations for HH:MM:SS:CC
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const centiseconds = Math.floor((diff % 1000) / 10); // 10ms intervals

        // Format digits with leading zeros
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        if (centisecondsEl) centisecondsEl.textContent = String(centiseconds).padStart(2, '0');

        // Dynamic Progress bar logic (simulated daily progress between 06:00 AM and 14:00 PM cutoff)
        const cycleStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0);
        if (now.getTime() >= cycleStart.getTime() && now.getTime() < target.getTime()) {
            const totalDuration = target.getTime() - cycleStart.getTime();
            const elapsed = now.getTime() - cycleStart.getTime();
            const percentage = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
            if (progressBar) progressBar.style.width = percentage + "%";
            if (progressPercent) progressPercent.textContent = percentage + "%";
        } else {
            // Off-hours - high production readiness
            if (progressBar) progressBar.style.width = "95%";
            if (progressPercent) progressPercent.textContent = "95%";
        }

        requestAnimationFrame(update);
    }
    
    update();
}

// ==========================================
// 2. PRICING & QUANTITY ENGINE
// ==========================================
const BASE_PRICES = {
    morning: { original: 19000, sub: 14900, name: "Morning Grain (아침)" },
    work: { original: 19000, sub: 14900, name: "Citrus Brew (낮)" },
    night: { original: 19000, sub: 14900, name: "Calm Brew (저녁)" },
    tripack: { original: 57000, sub: 39800, name: "하루의 호흡 세트 (Tri-Pack)" }
};

let globalQuantity = 1;
let hasQuizDiscount = false; // Becomes true when quiz completed successfully
let recommendedProduct = ""; // Store quiz result product code

function changeQuantity(amount) {
    const qtyInput = document.getElementById("form-quantity");
    if (qtyInput) {
        let currentVal = parseInt(qtyInput.value) || 1;
        currentVal += amount;
        if (currentVal < 1) currentVal = 1;
        qtyInput.value = currentVal;
        globalQuantity = currentVal;
        updateSubscriptionPrice();
    }
}

function updateSelectCardBorders() {
    const selectedPlan = document.querySelector('input[name="subscription_plan"]:checked');
    if (!selectedPlan) return;
    
    const planVal = selectedPlan.value;
    
    // Toggle styling on parent label wrappers
    document.querySelectorAll(".select-card").forEach(card => {
        const type = card.getAttribute("data-product-type");
        if (type === planVal) {
            card.classList.remove("border-gray-100");
            card.classList.add("border-forest-600", "bg-forest-50/30");
        } else {
            card.classList.remove("border-forest-600", "bg-forest-50/30");
            card.classList.add("border-gray-100");
        }
    });
}

function updateSubscriptionPrice() {
    updateSelectCardBorders();

    const selectedPlanInput = document.querySelector('input[name="subscription_plan"]:checked');
    if (!selectedPlanInput) return;
    const plan = selectedPlanInput.value;

    const selectedCycleInput = document.querySelector('input[name="delivery_cycle"]:checked');
    if (!selectedCycleInput) return;
    const cycle = selectedCycleInput.value;

    const data = BASE_PRICES[plan];
    if (!data) return;

    // Calculate total original and standard subscription prices
    const totalOriginal = data.original * globalQuantity;
    let totalSub = data.sub * globalQuantity;

    // Apply additional 10% lifetime discount if quiz completed
    if (hasQuizDiscount) {
        totalSub = Math.round(totalSub * 0.9);
        const quizDiscountStatus = document.getElementById("quiz-discount-status");
        if (quizDiscountStatus) quizDiscountStatus.classList.remove("hidden");
    } else {
        const quizDiscountStatus = document.getElementById("quiz-discount-status");
        if (quizDiscountStatus) quizDiscountStatus.classList.add("hidden");
    }

    // Update Text Outputs
    const originalPriceEl = document.getElementById("calc-original-price");
    const finalPriceEl = document.getElementById("calc-final-price");
    const pricePlanNameEl = document.getElementById("price-plan-name");
    const pricePlanCycleEl = document.getElementById("price-plan-cycle");

    if (originalPriceEl) originalPriceEl.textContent = formatKRW(totalOriginal);
    if (finalPriceEl) finalPriceEl.textContent = formatKRW(totalSub);
    if (pricePlanNameEl) pricePlanNameEl.textContent = `${data.name} × ${globalQuantity}개`;
    if (pricePlanCycleEl) {
        pricePlanCycleEl.textContent = cycle === "2weeks" ? "2주 배송 플랜" : "4주 배송 플랜";
    }
}

function selectProductForSubscription(productId) {
    const radioButton = document.querySelector(`input[name="subscription_plan"][value="${productId}"]`);
    if (radioButton) {
        radioButton.checked = true;
        updateSubscriptionPrice();
        
        // Smooth scroll to the subscription panel
        const targetSection = document.getElementById("subscription");
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
        }
    }
}

function formatKRW(number) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })
        .format(number)
        .replace("₩", "") + "원";
}

// ==========================================
// 3. LIFESTYLE QUIZ SYSTEM
// ==========================================
const QUIZ_QUESTIONS = [
    {
        title: "언제 가장 호흡기가 칼칼하거나 답답함을 느끼시나요?",
        options: [
            { text: "아침에 눈을 뜨고 기상했을 때 (재채기, 마른 코)", value: "morning" },
            { text: "낮 업무 시간 또는 대중교통 안에서 (답답함, 기침)", value: "work" },
            { text: "저녁 식사 이후 및 잠들기 전 누웠을 때 (가래, 마른기침)", value: "night" }
        ]
    },
    {
        title: "평소 선호하시는 티 블렌딩의 맛과 향은 어떤 스타일인가요?",
        options: [
            { text: "누구나 즐기기 좋고 물처럼 편안한 구수한 맛", value: "morning" },
            { text: "코와 목이 뻥 뚫리고 상쾌함을 전하는 알싸한 허브향", value: "work" },
            { text: "스트레스가 스르륵 풀리는 은은하고 포근한 맛", value: "night" }
        ]
    },
    {
        title: "호흡기 케어와 함께 가장 개선하고 싶은 라이프 가치는 무엇인가요?",
        options: [
            { text: "아침 붓기 완화 및 몸의 생기 넘치는 시동", value: "morning" },
            { text: "업무 생산성 향상, 머리를 맑게 리프레시", value: "work" },
            { text: "하루의 피로 해소와 깊고 아늑한 숙면", value: "night" }
        ]
    }
];

let quizCurrentStep = 0;
let quizAnswers = [];

function startQuiz() {
    document.getElementById("quiz-intro").classList.add("hidden");
    document.getElementById("quiz-question-wrapper").classList.remove("hidden");
    quizCurrentStep = 0;
    quizAnswers = [];
    showQuizQuestion();
}

function showQuizQuestion() {
    const question = QUIZ_QUESTIONS[quizCurrentStep];
    
    // Update labels and progress bar
    document.getElementById("quiz-progress-label").textContent = `질문 ${quizCurrentStep + 1} of ${QUIZ_QUESTIONS.length}`;
    const percent = ((quizCurrentStep + 1) / QUIZ_QUESTIONS.length) * 100;
    document.getElementById("quiz-progress-bar").style.width = percent + "%";
    
    // Set Question title
    document.getElementById("quiz-question-title").textContent = question.title;
    
    // Render options
    const optionsContainer = document.getElementById("quiz-options-container");
    optionsContainer.innerHTML = "";
    
    question.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "w-full border border-gray-200 hover:border-forest-600 hover:bg-forest-50/20 text-left p-4 rounded-2xl text-xs md:text-sm font-medium text-gray-700 transition-all flex justify-between items-center group focus:outline-none";
        btn.innerHTML = `
            <span>${opt.text}</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-forest-800 transition-colors"></i>
        `;
        btn.onclick = () => selectQuizOption(opt.value);
        optionsContainer.appendChild(btn);
    });
    
    // Control Prev Button visibility
    const prevBtn = document.getElementById("quiz-prev-btn");
    if (quizCurrentStep === 0) {
        prevBtn.classList.add("invisible");
    } else {
        prevBtn.classList.remove("invisible");
    }
    
    lucide.createIcons();
}

function selectQuizOption(value) {
    quizAnswers[quizCurrentStep] = value;
    if (quizCurrentStep < QUIZ_QUESTIONS.length - 1) {
        quizCurrentStep++;
        showQuizQuestion();
    } else {
        calculateQuizResult();
    }
}

function prevQuizStep() {
    if (quizCurrentStep > 0) {
        quizCurrentStep--;
        showQuizQuestion();
    }
}

function calculateQuizResult() {
    document.getElementById("quiz-question-wrapper").classList.add("hidden");
    document.getElementById("quiz-result-wrapper").classList.remove("hidden");
    
    // Determine the product code occurring most frequently in answers
    const counts = {};
    let maxVal = "morning";
    let maxCount = 0;
    
    quizAnswers.forEach(ans => {
        counts[ans] = (counts[ans] || 0) + 1;
        if (counts[ans] > maxCount) {
            maxCount = counts[ans];
            maxVal = ans;
        }
    });

    recommendedProduct = maxVal;
    hasQuizDiscount = true; // Activate flat 10% discount coupon

    // Setup result view dynamically
    const resultTitle = document.getElementById("quiz-result-title");
    const resultDesc = document.getElementById("quiz-result-description");
    const resultImg = document.getElementById("quiz-result-img");
    const resultProductName = document.getElementById("quiz-result-product-name");
    
    if (maxVal === "morning") {
        if (resultTitle) resultTitle.textContent = "Morning Grain 플랜";
        if (resultDesc) resultDesc.textContent = "아침에 기상 시 재채기와 환절기 비염 증상이 가장 강하신 타입이군요. 보리와 루이보스로 구수한 베이스를 잡고, 맥문동과 작두콩 뿌리 엑기스로 아침 목을 건조함 없이 활짝 깨우는 Morning Grain을 추천합니다.";
        if (resultImg) resultImg.src = "assets/morning_grain_glass.png";
        if (resultProductName) resultProductName.textContent = "1. Morning Grain 정기구독";
    } else if (maxVal === "work") {
        if (resultTitle) resultTitle.textContent = "Citrus Brew 플랜";
        if (resultDesc) resultDesc.textContent = "일과 중 밀폐된 사무실 공기나 건조한 히터 바람으로 코막힘과 목 답답함을 자주 겪는 타입이시군요. 페퍼민트의 시원한 멘톨 성분과 생강의 따스한 기운으로 즉각적인 리프레시와 코 뻥 뚫림을 전하는 Citrus Brew를 권장합니다.";
        if (resultImg) resultImg.src = "assets/citrus_brew_glass.png";
        if (resultProductName) resultProductName.textContent = "2. Citrus Brew 정기구독";
    } else {
        if (resultTitle) resultTitle.textContent = "Calm Brew 플랜";
        if (resultDesc) resultDesc.textContent = "하루 내내 자극받은 호흡기 점막 때문에 잠들기 전에 마른기침을 하거나 답답해하는 밤 민감형 타입이시군요. 맥문동과 대추의 촉촉한 점액질 보습 코팅, 그리고 편안한 수면을 유도하는 캐모마일 블렌딩의 Calm Brew가 최상의 선택입니다.";
        if (resultImg) resultImg.src = "assets/calm_brew_glass.png";
        if (resultProductName) resultProductName.textContent = "3. Calm Brew 정기구독";
    }
    
    lucide.createIcons();
    updateSubscriptionPrice(); // Recalculate billing values with active quiz discount
}

function applyQuizRecommendation() {
    selectProductForSubscription(recommendedProduct);
}

function resetQuiz() {
    document.getElementById("quiz-result-wrapper").classList.add("hidden");
    document.getElementById("quiz-intro").classList.remove("hidden");
}

// ==========================================
// 4. FORM SUBMISSION & SUCCESS OVERLAY
// ==========================================
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form inputs
    const name = document.getElementById("cust-name").value.trim();
    const tel = document.getElementById("cust-tel").value.trim();
    const address = document.getElementById("cust-address").value.trim();
    
    const selectedPlanVal = document.querySelector('input[name="subscription_plan"]:checked').value;
    const selectedCycleVal = document.querySelector('input[name="delivery_cycle"]:checked').value;
    
    const productInfo = BASE_PRICES[selectedPlanVal];
    let calculatedPrice = productInfo.sub * globalQuantity;
    if (hasQuizDiscount) {
        calculatedPrice = Math.round(calculatedPrice * 0.9);
    }
    
    // Inject custom data into the Success Popup overlay
    document.getElementById("cust-success-name").textContent = name;
    document.getElementById("cust-success-product").textContent = `${productInfo.name} × ${globalQuantity}개`;
    document.getElementById("cust-success-addr").textContent = address;
    document.getElementById("cust-success-cycle").textContent = selectedCycleVal === "2weeks" ? "2주마다 정기 배송" : "4주마다 정기 배송";
    document.getElementById("cust-success-price").textContent = formatKRW(calculatedPrice);
    
    // Show the success overlay dashboard
    const overlay = document.getElementById("success-overlay");
    if (overlay) {
        overlay.classList.remove("hidden");
    }
}

function closeSuccessOverlay() {
    const overlay = document.getElementById("success-overlay");
    if (overlay) {
        overlay.classList.add("hidden");
    }
    
    // Reset form inputs
    document.getElementById("subscription-form").reset();
    globalQuantity = 1;
    document.getElementById("form-quantity").value = 1;
    hasQuizDiscount = false;
    updateSubscriptionPrice();
    
    // Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// 5. SOCIAL PROOF LIVE ORDER TOAST NOTIFICATIONS
// ==========================================
const TOAST_REGIONS = ["서울 마포구", "서울 성동구", "경기 성남시", "부산 해운대구", "인천 송도동", "경기 수원시", "대구 수성구", "대전 유성구", "광주 광산구", "제주 서귀포시", "세종 조치원읍"];
const TOAST_NAMES = ["김*현", "이*준", "박*민", "최*아", "정*서", "강*우", "조*은", "윤*원", "장*제", "임*하", "한*민"];
const TOAST_PRODUCTS = [
    { code: "morning", label: "Morning Grain" },
    { code: "work", label: "Citrus Brew" },
    { code: "night", label: "Calm Brew" },
    { code: "tripack", label: "하루의 호흡 세트" }
];

function startSocialProofToasts() {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    // Show a fresh order toast every 12 to 18 seconds
    function triggerNextToast() {
        const region = TOAST_REGIONS[Math.floor(Math.random() * TOAST_REGIONS.length)];
        const name = TOAST_NAMES[Math.floor(Math.random() * TOAST_NAMES.length)];
        const prod = TOAST_PRODUCTS[Math.floor(Math.random() * TOAST_PRODUCTS.length)];
        const delaySec = Math.floor(Math.random() * 59) + 1; // 1 to 59s ago

        const toast = document.createElement("div");
        toast.className = "bg-white/95 border border-forest-100 shadow-2xl rounded-2xl p-4 flex items-center gap-3 w-full max-w-sm mb-3 pointer-events-auto transition-all duration-500 transform translate-y-4 opacity-0";
        toast.innerHTML = `
            <div class="bg-forest-50 p-2.5 rounded-xl shrink-0 text-forest-800">
                <i data-lucide="bell" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-[10px] text-gray-400 font-semibold flex justify-between items-center">
                    <span>정기구독 실시간 접수</span>
                    <span>${delaySec}초 전</span>
                </p>
                <p class="text-xs text-gray-700 font-medium truncate mt-1">
                    ${region} <span class="font-bold text-gray-900">${name}</span>님이 
                    <span class="text-forest-800 font-bold">'${prod.label}'</span>를 정기구독 하셨습니다.
                </p>
            </div>
            <button onclick="this.parentElement.remove()" class="text-gray-300 hover:text-gray-500 shrink-0 self-start p-0.5">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
        `;

        toastContainer.appendChild(toast);
        lucide.createIcons();

        // Animate in
        setTimeout(() => {
            toast.classList.remove("translate-y-4", "opacity-0");
        }, 100);

        // Animate out after 6 seconds
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.classList.add("translate-y-[-10px]", "opacity-0");
                setTimeout(() => {
                    toast.remove();
                }, 500);
            }
        }, 6000);

        // Schedule next toast
        const nextTime = (Math.random() * 8000) + 10000; // 10 to 18 seconds
        setTimeout(triggerNextToast, nextTime);
    }

    // Start initial toast loop after 4 seconds
    setTimeout(triggerNextToast, 4000);
}
