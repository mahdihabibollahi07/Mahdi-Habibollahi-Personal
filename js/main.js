const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const header = $("#site-header");
const menuToggle = $(".menu-toggle");
const navMenu = $("#primary-menu");
const themeToggle = $(".theme-toggle");
const year = $("#year");

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

menuToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

$$(".nav-link").forEach(link => link.addEventListener("click", () => {
  navMenu?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.documentElement.dataset.theme = "light";
if (themeToggle) themeToggle.textContent = savedTheme === "light" ? "☀" : "☾";

themeToggle?.addEventListener("click", () => {
  const light = document.documentElement.dataset.theme === "light";
  if (light) {
    delete document.documentElement.dataset.theme;
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☾";
  } else {
    document.documentElement.dataset.theme = "light";
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "☀";
  }
});

if (year) year.textContent = new Date().getFullYear();

const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 }) : null;
$$(".reveal").forEach(el => observer ? observer.observe(el) : el.classList.add("visible"));

const filters = $$(".filter-btn");
const projects = $$(".project-card");
filters.forEach(button => button.addEventListener("click", () => {
  filters.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  const filter = button.dataset.filter;
  projects.forEach(project => {
    const categories = (project.dataset.category || "").split(" ");
    project.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
  });
}));

const aiInput = $("#ai-input"), aiAsk = $("#ai-ask"), aiAnswer = $("#ai-answer");
const knowledge = [
 {keys:["پروژه","project","کار"], answer:"پروژه‌های اصلی شامل «هوش حساب AI»، Personal Website، Accounting Dashboard و پروژه‌های WordPress هستند."},
 {keys:["حسابداری","accounting"], answer:"تمرکز اصلی این مسیر، ترکیب حسابداری با فناوری و ساخت ابزارهای کاربردی برای فرایندهای مالی است."},
 {keys:["وب","website","web","سایت"], answer:"این Portfolio با HTML، CSS و Vanilla JavaScript ساخته شده و برای GitHub Pages مناسب است."},
 {keys:["ai","هوش مصنوعی"], answer:"AI Corner فعلاً محلی و Front-End است و در آینده می‌تواند به API یا Backend واقعی متصل شود."},
 {keys:["مهارت","skill"], answer:"حوزه‌های اصلی شامل Accounting، Web، WordPress، Python و AI هستند."},
 {keys:["تماس","contact"], answer:"برای تماس می‌توانی از بخش Contact و ایمیل سایت استفاده کنی."}
];
aiAsk?.addEventListener("click", () => {
 const question = aiInput.value.trim().toLowerCase();
 if (!question) { aiAnswer.textContent = "اول یک سؤال وارد کن."; return; }
 const found = knowledge.find(item => item.keys.some(key => question.includes(key)));
 aiAnswer.textContent = found ? found.answer : "این سؤال هنوز در Knowledge Base محلی تعریف نشده است؛ در نسخه بعدی می‌توان آن را به API هوش مصنوعی متصل کرد.";
});
aiInput?.addEventListener("keydown", e => { if (e.key === "Enter") aiAsk?.click(); });

$("#copy-email")?.addEventListener("click", async e => {
 const email = e.currentTarget.dataset.email;
 try {
   await navigator.clipboard.writeText(email);
   e.currentTarget.textContent = "کپی شد ✓";
   setTimeout(() => e.currentTarget.textContent = "کپی ایمیل", 1800);
 } catch { window.location.href = `mailto:${email}`; }
});

$$('a[href="#"]').forEach(a => a.addEventListener("click", e => e.preventDefault()));

const sections = $$("main section[id]");
const navLinks = $$(".nav-link");
if (sections.length && navLinks.length && "IntersectionObserver" in window) {
 const navObserver = new IntersectionObserver(entries => {
   entries.forEach(entry => {
     if (!entry.isIntersecting) return;
     navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
   });
 }, {rootMargin:"-35% 0px -55% 0px"});
 sections.forEach(section => navObserver.observe(section));
}