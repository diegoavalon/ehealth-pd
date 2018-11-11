class ModalMorph extends HTMLElement {
    constructor() {
        super();
        this.isAnimating = false;
        this.theme = this.getAttribute('theme') || 'light';
    }

    connectedCallback() {
        this.themeColors = this.getThemeColors();
        this.target = this.children[0];
        this.addEventListener('click', this.morphOut);
        document.addEventListener('close-modal', this.morphIn.bind(this));
    }

    getThemeColors() {
        if (this.theme === 'dark') {
            return {
                color: '#ffffff',
                background: 'background: #232526; background: -webkit-radial-gradient(#414345, #232526); background: radial-gradient(#414345, #232526);'
            };
        }

        return {
            color: '#333333',
            background: '#ffffff'
        };
    }

    getWindowSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    isModalFullWidth() {
        if ((this.modalWidth === '100%') && (this.modalHeight === '100%')) {
            return 'overflow: hidden';
        }

        return 'overflow: auto';
    }

    setModalDimensions() {
        this.modalMaxWidth = this.getAttribute('max-width') || '1062px';
        this.modalMaxHeight = this.getAttribute('max-height') || '600px';

        window.windowSize = this.getWindowSize();

        if (window.windowSize.width <= parseInt(this.modalMaxWidth, 10)) {
            this.modalWidth = '100%';
        } else {
            this.modalWidth = this.modalMaxWidth;
        }

        if (window.windowSize.height <= parseInt(this.modalMaxHeight, 10)) {
            this.modalHeight = '100%';
        } else {
            this.modalHeight = this.modalMaxHeight;
        }

        return {
            width: `${this.modalWidth}`,
            height: `${this.modalHeight}`
        };
    }

    createModalOverlay() {
        const self = this;
        this.modalOverlay = document.createElement('div');
        this.modalOverlay.style.cssText = `
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            transition: opacity 1200ms cubic-bezier(.694,0,.335,1);
        `;

        this.modalOverlay.addEventListener('click', this.morphIn.bind(self));
        document.body.appendChild(this.modalOverlay);
    }

    createClone() {
        const closeSVG = `
            <svg class="modal__close" style="position: absolute; top: 16px; right: 16px; cursor: pointer; z-index: 10;" width="20" height="20" viewBox="0 0 29 29">
                <g stroke="${this.themeColors.color}" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1.496 1.202l26 25.806M1.593 27.104l25.806-26"/>
                </g>
            </svg>
        `;
        window.addEventListener('new-resize', this.setModalDimensions.bind(this));
        this.setModalDimensions();

        this.morphClone = document.createElement('div');
        this.morphClone.classList.add('modal');
        this.morphClone.style.cssText = `
            position: fixed;
            top: ${this.dimensions.top}px;
            left: ${this.dimensions.left}px;
            width: ${this.dimensions.width}px;
            height: ${this.dimensions.height}px;
            max-width: ${this.modalMaxWidth};
            max-height: ${this.modalMaxHeight};
            background: ${this.themeColors.background};
            color: ${this.themeColors.color};
            z-index: 1000;
            ${this.isModalFullWidth()}
        `;

        const modalTemplate = this.querySelector('template');
        this.morphClone.insertAdjacentHTML('afterbegin', closeSVG);
        this.morphClone.appendChild(modalTemplate.content.cloneNode(true));

        this.morphClone.querySelector('.modal__close').addEventListener('click', this.morphIn.bind(this));
        document.body.appendChild(this.morphClone);
    }

    morphOut() {
        if (this.isAnimating) return;

        this.isAnimating = true;

        document.body.style.overflow = 'hidden';
        this.dimensions = this.target.getBoundingClientRect();
        this.createClone();
        this.createModalOverlay();

        this.originalElAnimation = this.target.animate({
            opacity: [1, 0]
        }, {
            duration: 500,
            easing: 'cubic-bezier(.694,0,.335,1)',
            fill: 'both'
        });

        this.modalTemplateCloneAnimation = this.morphClone.lastElementChild.animate({
            opacity: [0, 1]
        }, {
            duration: 1000,
            delay: 700,
            easing: 'cubic-bezier(.694,0,.335,1)',
            fill: 'both'
        });

        this.modalOverlayAnimation = this.modalOverlay.animate({
            opacity: [0, 1]
        }, {
            duration: 1000,
            easing: 'cubic-bezier(.694,0,.335,1)',
            fill: 'both'
        });

        this.clonedElAnimation = this.morphClone.animate([
            {
                offset: 0,
                opacity: 0,
                width: `${this.morphClone.style.width}`,
                height: `${this.morphClone.style.height}`,
                top: `${this.morphClone.style.top}`,
                left: `${this.morphClone.style.left}`,
                transform: 'translate(0, 0)'
            }, {
                offset: 0.2,
                opacity: 1,
                width: `${this.morphClone.style.width}`,
                height: `${this.morphClone.style.height}`,
                top: `${this.morphClone.style.top}`,
                left: `${this.morphClone.style.left}`,
                transform: 'translate(0, 0)'

            }, {
                offset: 1,
                opacity: 1,
                width: `${this.modalWidth}`,
                height: `${this.modalHeight}`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }], {
                duration: 1000,
                easing: 'cubic-bezier(.694,0,.335,1)',
                fill: 'both'
            }
        );

        this.clonedElAnimation.onfinish = () => {
            this.isAnimating = false;
        };

        const modalTriggeredEvent = new CustomEvent('morph-modal', {
            bubbles: true
        });
        document.dispatchEvent(modalTriggeredEvent);
    }

    morphIn() {
        if (!this.modalOverlayAnimation && !this.clonedElAnimation && !this.originalElAnimation && !this.modalTemplateCloneAnimation) return;
        if (this.isAnimating) return;

        this.isAnimating = true;

        document.body.style.overflow = 'initial';

        this.modalOverlayAnimation.reverse();
        this.clonedElAnimation.reverse();
        this.modalTemplateCloneAnimation.reverse();
        this.originalElAnimation.reverse();

        this.clonedElAnimation.onfinish = e => {
            this.modalOverlayAnimation = null;
            this.clonedElAnimation = null;
            this.modalTemplateCloneAnimation = null;
            this.originalElAnimation = null;

            this.modalOverlay.parentNode.removeChild(this.modalOverlay);
            this.morphClone.parentNode.removeChild(this.morphClone);

            this.isAnimating = false;
        };
    }
}

customElements.define('modal-morph', ModalMorph);

export default ModalMorph;
