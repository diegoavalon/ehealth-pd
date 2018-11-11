import {html, render} from './vendor/lit-html/lit-html.js';
import {when} from './vendor/lit-html/directives/when.js';
import './common/EhLoader.js';

class PdHeader extends HTMLElement {
    constructor() {
        super();
        this.modalAddedPlans = JSON.parse(sessionStorage.getItem('addedPlans')) || {};
    }

    connectedCallback() {
        this.render();
        document.addEventListener('plan-header-loaded', this.loadPlan.bind(this));
        document.addEventListener('plan-updated', this.loadUpdatedPlan.bind(this));
    }

    loadPlan(e) {
        this.model = e.detail.model;
        this.render();

        this.DOM = { desktopHeader: this };
        this.DOM.headerLeft = this.querySelector('.pd-header__left');
        this.DOM.mobileHeader = this.querySelector('.pd-header__right');
        this.desktopHeaderPos = this.DOM.desktopHeader.offsetTop;
        this.mobileHeaderPos = this.getMobileFloatingHeaderPos();

        this.setFloatingHeader();
        window.addEventListener('scroll', this.setFloatingHeader.bind(this));
        window.addEventListener('resize', this.updateFloatingHeader.bind(this));
    }

    getMobileFloatingHeaderPos() {
        return this.DOM.headerLeft.offsetHeight + 62;
    }

    updateFloatingHeader() {
        this.getMobileFloatingHeaderPos();
        this.setFloatingHeader();
    }

    setFloatingHeader() {
        if (window.innerWidth >= 760) {
            this.DOM.mobileHeader.classList.remove('sticky');
            this.styleFloatingHeader(this.desktopHeaderPos, this.DOM.desktopHeader);
        } else {
            this.DOM.desktopHeader.classList.remove('sticky');
            this.styleFloatingHeader(this.mobileHeaderPos, this.DOM.mobileHeader);
        }
        return;
    }

    styleFloatingHeader(triggerPos, el) {
        if (window.scrollY >= triggerPos) {
            document.body.style.paddingTop = `${el.offsetHeight}px`;
            el.classList.add('sticky');
        } else {
            document.body.style.paddingTop = 0;
            el.classList.remove('sticky');
        }
    }

    loadUpdatedPlan() {
        this.calculateTotalPrice();
        this.render();
    }

    calculateTotalPrice() {
        this.modalAddedPlans = JSON.parse(sessionStorage.getItem('addedPlans')) || {};
        const additionalPlansTotal = [];

        if (Object.keys(this.modalAddedPlans).length > 0) {
            for (const key in this.modalAddedPlans) {
                if (this.modalAddedPlans.hasOwnProperty(key)) {
                    additionalPlansTotal.push(parseFloat(this.modalAddedPlans[key].rate));
                }
            }

            return additionalPlansTotal.reduce((total, plan) => {
                total += plan;
                return total;
            }, parseInt(this.model.rate, 10));
        }

        return this.model.rate;
    }

    addToCart() {
        this.model.rate++;
        this.render();
    }

    renderHeaderLabel() {
        const shouldShowLabel = this.model.bestSeller || this.model.featurePlan;
        const text = this.model.bestSeller ? 'Best Seller' : (this.model.featurePlan ? 'Featured Plan' : '');

        return shouldShowLabel ? html`<div class="pd-header__label-text">${text}</div>` : '';
    }

    template() {
        let addedPlansHTML = [];
        for (const key in this.addedPlans) {
            if (this.addedPlans.hasOwnProperty(key)) {
                const snippet = html`
                    <div class="itemized__row">
                        <div class="itemized__product">${key}</div>
                        <div class="itemized__rate">+ $${this.addedPlans[key].rate}/mo.</div>
                    </div>
                `;

                addedPlansHTML.push(snippet);
            }
        }

        const shouldShowBreakdown = () => {
            const isAddedPlansEmpty = addedPlansHTML.length > 0;

            if (isAddedPlansEmpty) {
                return html`
                    <div class="itemized">
                        <div class="itemized__group">
                            <div class="itemized__row itemized__row--border">
                                <div class="itemized__header">Current Plan</div>
                                <div class="itemized__rate">$${this.calculateTotalPrice}/mo.</div>
                            </div>
                            
                            ${addedPlansHTML}
                            
                        </div>
                    </div>
                `;
            }
        };

        const totalPrice = this.calculateTotalPrice();

        return html`
            <div class="pd-header__wrapper">
                <div class="pd-header__left">
                    ${this.renderHeaderLabel()}
                    <h2 class="pd-header__company">${this.model.carrierName}</h2>
                    <h3 class="pd-header__plan">${this.model.planName}</h1>
                </div>
                <div class="pd-header__right">
                    <div class="pd-header__cta">
                        
                        ${shouldShowBreakdown()}

                        <div class="pd-header__cta-price">
                            <div class="pd-header__cta-label">Total Cost:</div>
                            <div><strong>$${totalPrice}</strong>${this.model.coverageDuration}</div>
                        </div>

                        <div class="pd-header__cta-button" @click=${this.addToCart.bind(this)}>Apply</div>
                    </div>
                </div>
            </div>
            <style>
                @-webkit-keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                pd-header {
                display: block;
                background: #ffffff;
                -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.023);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.023);
                z-index: 999;
                }
                pd-header.sticky {
                    position: fixed !important;
                    top: 0;
                    left: 0;
                    right: 0;
                }
                .pd-header__wrapper {
                position: relative;
                max-width: calc(1003px + 200px);
                margin: 0 auto;
                -webkit-animation: fadeIn 1s cubic-bezier(.694,0,.335,1);
                animation: fadeIn 1s cubic-bezier(.694,0,.335,1);
                box-sizing: border-box;
                }
                @media screen and (min-width: 760px) {
                .pd-header__wrapper {
                    padding-left: 40px;
                    padding-right: 40px;
                }
                }
                @media screen and (min-width: 1140px) {
                .pd-header__wrapper {
                    padding-left: 100px;
                    padding-right: 100px;
                }
                }
                @media screen and (min-width: 760px) {
                .pd-header__wrapper {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: justify;
                    -ms-flex-pack: justify;
                    justify-content: space-between;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    text-align: left;
                    padding-top: 28px;
                    padding-bottom: 28px;
                }
                }
                .pd-header__left,
                .pd-header__right {
                    padding: 20px;
                }
                .pd-header__left {
                    border-bottom: 1px solid #dfe3e8;
                }
                .pd-header__right {
                    text-align: right;
                }
                .pd-header__right.sticky {
                    position: fixed !important;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #ffffff;
                    -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.023);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.023);
                    z-index: 110;
                }
                .pd-header__label {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                margin-bottom: 6px;
                }
                .pd-header__label-text {
                position: relative;
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 0.875rem;
                line-height: 1.3125rem;
                font-weight: 400;
                color: #0099d6;
                margin-bottom: 8px;
                font-weight: 600;
                }
                .pd-header__label-marker {
                width: 50px;
                height: 2px;
                background: #0099d6;
                -webkit-transform: translateY(-50%);
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
                }
                @media screen and (min-width: 760px) {
                .pd-header__left,
                .pd-header__right {
                    padding: 0;
                }
                .pd-header__left {
                    border-bottom: none;
                }
                .pd-header__label {
                    -webkit-box-pack: start;
                    -ms-flex-pack: start;
                    justify-content: flex-start;
                }
                .pd-header__label-marker {
                    display: none;
                }
                }
                .pd-header__company {
                font-family: 'din_medium', sans-serif;
                font-size: 1.25rem;
                line-height: 1.40625rem;
                font-weight: 600;
                margin-top: 0px;
                margin-bottom: 8px;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-header__company {
                    font-size: 1.5rem;
                    line-height: 1.6875rem;
                    margin-top: 8px;
                    margin-bottom: 4px;
                }
                }
                .pd-header__plan {
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                margin-top: 0;
                margin-bottom: 0;
                }
                .pd-header__cta {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -ms-flex-pack: distribute;
                    justify-content: space-around;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    max-width: 360px;
                    margin: 0 auto;            
                }
                .pd-header__cta-label {
                    display: none;
                    font-family: 'proxima_nova_regular', sans-serif;
                }
                .pd-header__cta-price {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                -webkit-box-align: end;
                -ms-flex-align: end;
                align-items: flex-end;
                color: #999999;
                font-family: 'proxima_nova_regular', sans-serif;
                margin-bottom: 0;
                margin-right: 20px;
                }
                @media screen and (min-width: 760px) {
                .pd-header__cta {
                    display: block;
                    margin-top: 0;
                }
                .pd-header__cta-label {
                    display: block;
                }
                .pd-header__cta-price {
                    margin-bottom: 12px;
                    margin-right: 0;
                }
                }
                .pd-header__itemized {
                    padding-top: 12px;
                    border-top: 1px solid #dfe3e8;    
                }
                .pd-header__cta-price strong {
                font-family: 'din_medium', sans-serif;
                font-size: 1.25rem;
                line-height: 1.40625rem;
                font-weight: 600;
                margin-left: 4px;
                color: #333333;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-header__cta-price strong {
                    font-size: 1.5rem;
                    line-height: 1.6875rem;
                }
                }
                .pd-header__cta-button {
                display: inline-block;
                padding: 0 16px;
                border-radius: 5px;
                height: 40px;
                line-height: 40px;
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 16px;
                font-weight: 600;
                -webkit-font-smoothing: antialiased;
                -webkit-transition: 150ms ease;
                -o-transition: 150ms ease;
                transition: 150ms ease;
                -webkit-transition-property: background-color border-color color;
                -o-transition-property: background-color border-color color;
                transition-property: background-color border-color color;
                text-align: center;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                cursor: pointer;
                background: #f69234;
                color: #ffffff;
                border: 0 solid transparent;
                width: 168px;
                }
                .pd-header__cta-button:hover {
                background: #c3660e;
                }
                .pd-header__cta-button:active {
                background: #753e0a;
                }
                .pd-header__cta-button:disabled {
                background: #ffdbb9;
                }
                .itemized__group {
                margin-bottom: 12px;
                }
                .itemized__header {
                font-family: 'proxima_nova_semibold', sans-serif;
                font-size: 0.875rem;
                line-height: 1.3125rem;
                font-weight: normal;
                padding-bottom: 4px;
                }
                .itemized__row {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                }
                .itemized__row--border {
                    margin-bottom: 4px;
                    border-bottom: 1px solid #dfe3e8;
                }
                .itemized__product {
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 0.875rem;
                line-height: 1.3125rem;
                font-weight: 400;
                }
                .itemized__rate {
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 0.875rem;
                line-height: 1.3125rem;
                font-weight: 400;
                font-weight: 700;
                }
            </style>
        `;
    }

    loadingTemplate() {
        return html`
            <eh-loader 
                skeleton-height="135px"
                skeleton-styles="
                    -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.023);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.023);
                    z-index: 100;
                ">
            </eh-loader>
        `;
    }

    render() {
        render(
            when(this.model, this.template.bind(this), this.loadingTemplate.bind(this))
            ,
            this);
    }
}

customElements.define('pd-header', PdHeader);

export default PdHeader;
