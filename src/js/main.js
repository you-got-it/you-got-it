const root = document.documentElement;

/* show intro */
const showIntroClassName = 'intro-playing';
setTimeout(() => {
    document.body.classList.add(showIntroClassName);
}, 300);
setTimeout(() => {
    document.body.classList.remove(showIntroClassName);
    document.body.classList.remove('content-hidden');
}, 3500);

/* navigation */
let openedArticle = 0;
const articlesElement = document.querySelector('.articles');
const articleElements = document.querySelectorAll('.article');

function setOpenedArticle(e) {
    const target = e.currentTarget;

    if (!target.classList.contains('opened')) {
        openedArticle = Number(target.dataset.article);
    
        if (document.body.classList.contains('article-opened')) {
            nextArticle();
        } else {
            openArticle();
        }
    }
}

function openArticle() {
    document.body.classList.remove('article-opened');
    document.body.classList.add('article-opening');
    articleElements.forEach(el => el.classList.remove('opened'));

    const target = document.querySelector(`.article[data-article="${openedArticle}"]`);

    root.style.setProperty('--articleTranslateDuration', '0s');
    const targetPosition = Math.round(target.getBoundingClientRect().y);
    target.classList.add('opened');

    setTimeout(() => {
        
        root.style.setProperty('--articleTranslateY', `${targetPosition - 200}px`);
        window.scrollTo(0, 0);

        document.body.classList.remove('article-opening');
        document.body.classList.add('article-opened');

        setTimeout(() => {
            root.style.setProperty('--articleTranslateDuration', '.5s');
            root.style.setProperty('--articleTranslateY', '0');
        }, 50);
    }, 350);


    saveOpenedArticle();
}

articleElements.forEach(el => el.addEventListener('click', setOpenedArticle));

function nextArticle(e) {
    if (e) {
        e.stopPropagation();
        openedArticle++;
    }

    const openedTarget = document.querySelector(`.article.opened`);
    openedTarget.classList.add('closing');
    
    
    //document.body.classList.remove('article-opened');
    //document.body.classList.add('article-opening');

    const target = document.querySelector(`.article[data-article="${openedArticle}"]`);

    root.style.setProperty('--articleTranslateDuration', '0s');
    const targetPosition = Math.round(target.getBoundingClientRect().y);
    
    setTimeout(() => {
        articleElements.forEach(el => el.classList.remove('opened'));
        target.classList.add('opened');
    }, 250);

    setTimeout(() => {
        openedTarget.classList.remove('closing');
        root.style.setProperty('--articleTranslateY', `${targetPosition - 200}px`);
        window.scrollTo(0, 0);

        //document.body.classList.remove('article-opening');
        //document.body.classList.add('article-opened');

        setTimeout(() => {
            root.style.setProperty('--articleTranslateDuration', '.5s');
            root.style.setProperty('--articleTranslateY', '0');
        }, 50);
    }, 350);


    saveOpenedArticle();
}

const nextPageElements = document.querySelectorAll('.js-next-page');
nextPageElements.forEach(el => el.addEventListener('click', nextArticle));

const closeArticleElement = document.querySelector('.js-close-article');
closeArticleElement.addEventListener('click', function closeArticle(e) {
    e.preventDefault();

    if (document.body.classList.contains('article-opened')) {
        document.body.classList.add('article-closing');
    
        setTimeout(() => {
            
            articleElements.forEach(el => el.classList.remove('opened'));
        
            openedArticle = 0;
            document.body.classList.remove('article-opened');
            document.body.classList.remove('article-closing');
    
        }, 600);
    }
});


/* popup */
function togglePopup(e) {
    if (e) {
        e.preventDefault();
    }

    document.body.classList.toggle('popup-opened');
}

const popupButtons = document.querySelectorAll('.js-open-popup');
popupButtons.forEach(button => button.addEventListener('click', togglePopup));

document.querySelector('.fade').addEventListener('click', togglePopup);

if (!localStorage.firstShow) {
    localStorage.firstShow = 1;
    togglePopup();
}

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

