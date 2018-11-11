class EhTooltip extends HTMLElement {
    constructor() {
        super();
        this.template = this.querySelector('template');
    }

    connectedCallback() {
        this.DOM = { main: this.firstElementChild };
        this.DOM.mainWidth = this.DOM.main.offsetWidth;
        this.DOM.mainHeight = this.DOM.main.offsetHeight;

        this.DOM.main.style.position = 'relative';
        this.DOM.main.style.borderBottom = '1px dashed #0099d6';
        this.DOM.main.style.paddingBottom = '2px';
        this.DOM.main.style.cursor = 'pointer';

        this.addEventListener('click', this.triggerTooltip.bind(this));
        window.addEventListener('resize', this.updatetooltipPosition.bind(this));
    }

    offset(el) {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }

    updatetooltipPosition() {
        if (!this.tooltip) return;

        this.tooltipPos = this.offset(this.DOM.main);
        this.tooltipPos.center = this.DOM.main.offsetWidth / 2;

        this.tooltip.style.top = `${this.tooltipPos.top - this.tooltip.offsetHeight - 16}px`;
        this.tooltip.style.left = `${this.tooltipPos.left}px`;
    }

    triggerTooltip() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.createTooltipOverlay();
        this.createTooltip();
    }

    closeTooltip(e) {
        e.stopPropagation();
        if (this.isAnimating) return;
        this.isAnimating = true;

        const self = this;
        this.tooltip.classList.add('removing');

        setTimeout(() => {
            self.tooltipOverlay.parentNode.removeChild(self.tooltipOverlay);
            self.tooltip.parentNode.removeChild(self.tooltip);
            this.isAnimating = false;
        }, 710);
    }

    createTooltipOverlay() {
        this.tooltipOverlay = document.createElement('div');
        this.tooltipOverlay.classList.add('eh-tooltip__overlay');

        this.tooltipOverlay.addEventListener('click', this.closeTooltip.bind(this));
        document.body.appendChild(this.tooltipOverlay);
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('eh-tooltip__tooltip');

        const tooltipTemplate = this.querySelector('template');
        this.tooltip.appendChild(tooltipTemplate.content.cloneNode(true));

        document.body.appendChild(this.tooltip);

        const setArrowPos = () => {
            if (this.tooltip.offsetWidth < this.DOM.mainWidth) {
                return this.DOM.mainWidth / 2;
            }

            return '40';
        };

        const arrowPos = setArrowPos();
        this.stylesEl = document.createElement('style');
        this.stylesEl.innerHTML = `
            @keyframes rotateInSubtle {
                0% {
                    opacity: 0;
                    transform: rotateX(-50deg) scale(.98);
                }
                50% {
                    opacity: 1;
                }
                100% {
                    opacity: 1;
                    transform: 'rotateX(0) scale(1);
                }
            }
            @keyframes rotateOutSubtle {
                0% {
                    opacity: 1;
                    transform: 'rotateX(0) scale(1);
                }
                50% {
                    opacity: 0;
                }
                100% {
                    opacity: 0;
                    transform: rotateX(-50deg) scale(.98);
                }
            }
            .eh-tooltip__overlay {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 999;
                width: 100%;
                height: 100%;
                background: transparent;
                cursor: default;
            }
            .eh-tooltip__tooltip {
                display: block;
                position: absolute;
                color: #fff;
                border-radius: 4px;
                font-size: 14px;
                padding: 8px;
                will-change: transform;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background-color: #333333;
                max-width: 350px;
                z-index: 1000;
                animation-name: rotateInSubtle;
                animation-duration: 700ms;
                animation-fill-mode: both;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            }
            .eh-tooltip__tooltip.removing {
                animation-name: rotateOutSubtle;
                animation-duration: 700ms;
                animation-fill-mode: both;
                animation-direction: normal;
            }
            .eh-tooltip__tooltip:after {
                position: absolute;
                content: "";
                top: 100%;
                left: ${arrowPos}px;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 12px 12px 0 0px;
                border-color: #333333 transparent transparent transparent;
                pointer-events: none;
            }
        `;

        this.tooltip.appendChild(this.stylesEl);
        this.updatetooltipPosition();

        this.tooltip.addEventListener('animationend', () => {
            this.isAnimating = false;
            return;
        });
    }
}

customElements.define('eh-tooltip', EhTooltip);

export default EhTooltip;
