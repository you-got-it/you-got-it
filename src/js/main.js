/* show intro */
const showIntroClassName = 'intro-playing';
setTimeout(() => {
    document.body.classList.add(showIntroClassName);
}, 300);
setTimeout(() => {
    document.body.classList.remove(showIntroClassName);
    document.body.classList.remove('content-hidden');
}, 30);

/* navigation */
let openedArticle = 0;
const articlesElement = document.querySelector('.articles');
const articleElements = document.querySelectorAll('.article');

function setOpenedArticle(e) {
    const target = e.currentTarget;
    openedArticle = Number(target.dataset.article);

    openArticle();
}

function openArticle() {
    document.body.classList.add('article-opening');
    articleElements.forEach(el => el.classList.remove('opened'));

    const target = document.querySelector(`.article[data-article="${openedArticle}"]`);

    const root = document.documentElement;
    const targetPosition = Math.round(target.getBoundingClientRect().y);
    target.classList.add('opened');

    setTimeout(() => {
        window.scrollTo(0, 0);
        
        root.style.setProperty('--articleTranslateY', `${targetPosition - 200}px`);

        document.body.classList.remove('article-opening');
        document.body.classList.add('article-opened');

        setTimeout(() => {
            root.style.setProperty('--articleTranslateDuration', '.5s');
            root.style.setProperty('--articleTranslateY', '0');
        }, 20);
    }, 350);

    

    saveOpenedArticle();
}

articleElements.forEach(el => el.addEventListener('click', setOpenedArticle));

function nextArticle(e) {
    e.stopPropagation();
    openedArticle++;
    openArticle();
}

const nextPageElements = document.querySelectorAll('.js-next-page');
nextPageElements.forEach(el => el.addEventListener('click', nextArticle));

const closeArticleElement = document.querySelector('.js-close-article');
closeArticleElement.addEventListener('click', function closeArticle(e) {
    e.preventDefault();
    articleElements.forEach(el => el.classList.remove('opened'));

    openedArticle = 0;
    document.body.classList.remove('article-opened');
});


/* popup */
function togglePopup(e) {
    e.preventDefault();
    document.body.classList.toggle('popup-opened');
}

const popupButtons = document.querySelectorAll('.js-open-popup');
popupButtons.forEach(button => button.addEventListener('click', togglePopup));

document.querySelector('.fade').addEventListener('click', togglePopup);

/* progress */
const peogressPercentElement = document.querySelector('.js-progress-percent');
const peogressPercentCircle = document.querySelector('.js-progress-circle');
const articlesCount = articleElements.length;

function saveOpenedArticle() {
    const openedArticlesList = new Set(Array.from(localStorage.openedArticles ? localStorage.openedArticles.split(',') : ''));
    openedArticlesList.add(openedArticle.toString());

    localStorage.openedArticles = Array.from(openedArticlesList).join(',');
    showProgress();
}

function showProgress() {
    const openedArticles = localStorage.openedArticles.split(',');
    const openedArticlesCount = openedArticles.length;
    const percent = Math.round((openedArticlesCount / articlesCount) * 100);
    const CIRCLE_WIDTH = 477;

    peogressPercentElement.innerHTML = percent;
    peogressPercentCircle.style.strokeDashoffset = CIRCLE_WIDTH -((percent / 100) * CIRCLE_WIDTH);

    openedArticles.map(article => {
        document.querySelector(`.article[data-article="${article}"]`).classList.add('viewed');
    });
}

showProgress();

