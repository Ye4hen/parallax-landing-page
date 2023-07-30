import './style.css'

// Slider
const slideBtns = document.querySelectorAll('[data-slideBtn]');
const slideContainer = document.querySelector('[data-slideContainer]');
const slides = [...document.querySelectorAll('[data-slide]')];
let currentIndex = 0;
let isMoving = false;
// console.log(slideBtns, slideContainer, slides);

// Button handle function
function handleSlideBtnClick(e) {
	if (isMoving) return;
	isMoving = true;
	// Todo: see if slider is already moving
	e.currentTarget.id === "prev" ? currentIndex-- : currentIndex++;
	slideContainer.dispatchEvent(new Event("sliderMove"));
	// console.log("handleSlideBtnClick", currentIndex);
}

// Remove/Add attributes function
const removeDisableAttribure = (els) => els.forEach(el => el.removeAttribute('disabled'));
const addDisableAttribure = (els) => els.forEach(el => el.setAttribute('disabled', 'true'));

// Event listeners
slideBtns.forEach(slideBtn => slideBtn.addEventListener('click', handleSlideBtnClick));

slideContainer.addEventListener("sliderMove", () => {
	// console.log('moved');	
	// Todo: 1.translate the container to the right/left; 2.Remove "disable" attributes from the btns; 3.Reanable btn if needed.
	slideContainer.style.transform = `translateX(-${currentIndex * slides[0].clientWidth}px)`;
	removeDisableAttribure(slideBtns);
	currentIndex === 0 && addDisableAttribure([slideBtns[0]]);
});

slideContainer.addEventListener('transitionend', () => isMoving = false);

document.querySelectorAll('[data-slide] img').forEach(img => img.ondragstart = () => false);

const slideObserver = new IntersectionObserver((slide) => {
	// console.log(slide[0].isIntersecting);
	if (slide[0].isIntersecting) {
		addDisableAttribure([slideBtns[1]]);
	}
}, { threshold: .75 });

slideObserver.observe(slides[slides.length - 1]);

// -------------------Form Handle-------------------

const contactForm = document.querySelector('#contact-form');
const contactButton = document.querySelector('#contact-button');
const contactInput = document.querySelector('#email');

function postEmailToDatabase(email) {
	console.info(`Your email is ${email}`);
	return new Promise(resolve => setTimeout(resolve, 2000));
}

const contactButtonOptions = {
	pending: `
		<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
		<span class="uppercase tracking-wide animate-pulse">
			Sending...
		</span>
	`,
	success: `
	<span class="uppercase tracking-wide">
			Thank you!
		</span>
		<span class="uppercase tracking-wide">
			❤️
		</span>`,
}

async function handleFormSubmit(e) {
	e.preventDefault();
	// console.log('prevented');
	addDisableAttribure([contactForm, contactButton]);
	contactButton.innerHTML = contactButtonOptions.pending;
	const userEmail = contactInput.value;
	contactInput.style.display = "none";
	await postEmailToDatabase(userEmail);
	contactButton.innerHTML = contactButtonOptions.success;
}

contactForm.addEventListener('submit', handleFormSubmit);

// -------------------Animations-------------------

function fadeUpObserverCallback(elsToWatch) {
	elsToWatch.forEach((el) => {
		if (el.isIntersecting) {
			el.target.classList.add('faded');
			fadeUpObserver.unobserve(el.target);
			// Delete classes
			el.target.addEventListener("transitioned", () => {
				el.target.classList.remove('fade-up', 'faded');
			}, { once: true });
		}
		console.log("Lola");
	})
}

const fadeUpObserverOptions = {
	threshold: .6,
}

const fadeUpObserver = new IntersectionObserver(fadeUpObserverCallback, fadeUpObserverOptions);

document.querySelectorAll(".fade-up").forEach((item) => {
	fadeUpObserver.observe(item);
});