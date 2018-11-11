import {html, render} from './vendor/lit-html/lit-html.js';
import {when} from './vendor/lit-html/directives/when.js';
import './PdCrossSellModal.js'; // <==== <additional-coverage-modal></additional-coverage-modal>
import './common/EhLoader.js';
import './common/ModalMorph.js';
import './common/EhIcon.js';

class PdAdditionalCoverage extends HTMLElement {
    constructor() {
        super();
        this.modalAddedPlans = JSON.parse(sessionStorage.getItem('addedPlans')) || {};
    }

    connectedCallback() {
        this.render();
        document.addEventListener('plan-updated', this.loadUpdatedPlan.bind(this));
        document.addEventListener('cross-sell-loaded', this.loadPlan.bind(this));
    }

    loadPlan(e) {
        this.model = e.detail.model;
        this.render();
    }

    loadUpdatedPlan() {
        this.modalAddedPlans = JSON.parse(sessionStorage.getItem('addedPlans'));
        this.render();
    }

    removePlan(category, e) {
        e.stopPropagation();
        delete this.modalAddedPlans[category.categoryName];

        sessionStorage.setItem('addedPlans', JSON.stringify(this.modalAddedPlans));
        document.dispatchEvent(
            new CustomEvent('plan-updated', {
                detail: {
                    toastType: 'Success',
                    toastMessage: 'Plan has been removed'
                },
                bubbles: true
            })
        );

        this.render();
    }

    template() {
        const shouldShowVideo = (category) => {
            if (!category.video) return;

            return html`
                <modal-morph max-width="100%" max-height="100%" theme="dark">
                    <eh-icon style="cursor: pointer; color: #0099d6; margin-top: -7px;"
                        name="play"
                        width="32"
                        height="32">
                    </eh-icon>
                    <template>
                        <style>
                            .video-iframe {
                                width: 100%;
                                height: 100%;
                            }
                        </style>
                        <iframe class="video-iframe" src=${category.video.videoUrl}></iframe>                    </template>
                </modal-morph>
            `;
        }
        const getModal = category => {
            return html`
                <style>
                    @-webkit-keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    a {
                        color: #0099d6;
                        text-decoration: none;
                        font-family: 'proxima_nova_regular', sans-serif;
                        font-size: 0.875rem;
                        line-height: 1.3125rem;
                        font-weight: 400;
                    }
                    button[disabled] {
                        cursor: not-allowed;
                        opacity: 0.5;
                    }
                    .v-center {
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-box-align: center;
                        -ms-flex-align: center;
                        align-items: center;
                    }
                    .additional-coverage {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-orient: vertical;
                    -webkit-box-direction: normal;
                    -ms-flex-direction: column;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    -webkit-animation: fadeIn 1s 500ms cubic-bezier(.694,0,.335,1) both;
                    animation: fadeIn 1s 500ms cubic-bezier(.694,0,.335,1) both;
                    }
                    .plan__wrapper {
                    -webkit-box-flex: 1;
                    -ms-flex: 1;
                    flex: 1;
                    overflow: auto;
                    }
                    .modal-section {
                        padding: 20px;
                        border-bottom: 1px solid #dfe3e8;
                        -webkit-box-shadow: 2px 2px 3px 0 rgba(218, 218, 218, 0.5);
                        box-shadow: 2px 2px 3px 0 rgba(218, 218, 218, 0.5);
                    }
                    .modal-heading {
                    font-family: 'din_medium', sans-serif;
                    font-size: 1.125rem;
                    line-height: 1.265625rem;
                    font-weight: 600;
                    margin-bottom: 4px;
                    margin-right: 8px;
                    }
                    @media screen and (min-width: 62.5rem) {
                    .modal-heading {
                        font-size: 1.25rem;
                        line-height: 1.40625rem;
                    }
                    }
                    .modal-subheading {
                    font-family: 'proxima_nova_regular', sans-serif;
                    font-size: 1rem;
                    line-height: 1.5rem;
                    font-weight: 400;
                    color: #666666;
                    margin: 5px 0;
                    }
                    .plan {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    position: relative;
                    padding: 20px;
                    border-bottom: 1px solid #dfe3e8;
                    cursor: pointer;
                    -webkit-transition: background 300ms cubic-bezier(.694,0,.335,1);
                    -o-transition: background 300ms cubic-bezier(.694,0,.335,1);
                    transition: background 300ms cubic-bezier(.694,0,.335,1);
                    }
                    .plan:hover {
                        background: #f8f8f8;
                    }
                    .plan.selected {
                        background: #eeeeee;
                    }
                    .plan.secondary {
                        display: none;
                        opacity: 0;
                    }
                    .plan__label {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                        z-index: 10;
                        margin: 0;
                    }
                    input[type="radio"].plan__option {
                        position: relative;
                        bottom: -1px;
                        margin-right: 12px;
                    }
                    .plan__left {
                        flex: 1;
                    }
                    .plan__right {
                        margin-left: auto;
                        z-index: 10;
                        text-align: right;
                    }
                    .plan__special {
                    background: #f69234;
                    color: #ffffff;
                    text-transform: uppercase;
                    font-family: 'din_medium', sans-serif;
                    font-size: 10px;
                    line-height: 1.265625rem;
                    font-weight: 300;
                    display: inline-block;
                    padding: 0 4px 1px 7px;
                    border-radius: 5px;
                    letter-spacing: 2px;
                    position: relative;
                    top: -5px;
                    }
                    .plan__special.Recommended {
                        background: #0099d6;
                    }
                    .plan__name {
                    display: inline-block;
                    font-family: 'din_medium', sans-serif;
                    font-size: 1.125rem;
                    line-height: 1.265625rem;
                    font-weight: 600;
                    margin-right: 12px;
                    margin-bottom: 4px;
                    }
                    .plan__price {
                    margin-left: auto;
                    margin-bottom: 2px;
                    font-family: 'proxima_nova_regular', sans-serif;
                    font-size: 1rem;
                    line-height: 1.5rem;
                    font-weight: 400;
                    }
                    .plan__price-number {
                    margin-left: 4px;
                    font-family: 'din_medium', sans-serif;
                    font-size: 1.125rem;
                    line-height: 1.265625rem;
                    font-weight: 600;
                    }
                    .plan__carrier {
                        font-family: 'proxima_nova_regular', sans-serif;
                        font-size: 0.875rem;
                        line-height: 1.3125rem;
                        font-weight: 400;
                    }
                    .modal-footer {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    justify-content: center;
                    padding: 16px 20px;
                    width: 100%;
                    background: #ffffff;
                    border-top: 1px solid #dfe3e8;
                    -webkit-box-shadow: 2px -2px 3px 0 rgba(218, 218, 218, 0.5);
                    box-shadow: 2px -2px 3px 0 rgba(218, 218, 218, 0.5);
                    box-sizing: border-box;
                    }
                    @media screen and (min-width: 760px) {
                    .modal-footer {
                        -webkit-box-pack: end;
                        -ms-flex-pack: end;
                        justify-content: flex-end;
                    }
                    }
                    .modal-footer button:not(:first-child) {
                    margin-left: 20px;
                    }
                    .button-outline {
                    display: inline-block;
                    padding: 0 16px;
                    border-radius: 5px;
                    height: 40px;
                    line-height: 40px;
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
                    border: solid 1px #0099d6;
                    background: #ffffff;
                    color: #0099d6;
                    }
                    .button-outline:hover {
                    background: #0099d6;
                    color: #ffffff;
                    }
                    .button-outline:active {
                    background: #0a749e;
                    color: #ffffff;
                    }
                    .button-outline:disabled {
                    background: #ffffff;
                    border-color: #b3e0f2;
                    color: #b3e0f2;
                    }
                    .button {
                    display: inline-block;
                    padding: 0 16px;
                    border-radius: 5px;
                    height: 40px;
                    line-height: 40px;
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
                    }
                    .button-outline.button-text {
                        margin-right: auto;
                        border: none;
                        white-space: nowrap;
                        padding: 0;
                        overflow: hidden;
                        width: 100%;
                    }
                    @media screen and (min-width: 400px) {
                        .button-outline.button-text {
                            width: auto;
                            padding: 0 16px;
                        }
                    }
                </style>
                <div class="additional-coverage">
                    <div class="modal-section">
                        <div class="v-center">
                            <h2 class="modal-heading">Add ${category.categoryName}</h2>

                            ${shouldShowVideo(category)}
                            
                        </div>
                        <p class="modal-subheading">${category.description}</p>
                    </div>
                    <div class="plan__wrapper" data-category=${category.productLine}>
                        ${category.riders.map((plan, index) => {
                            const planName = document.createRange().createContextualFragment(`${plan.name}`);
                            const shouldShowMarketingLabel = plan.bestSeller || plan.recommended;
                            const marketingLabelText = plan.bestSeller ? 'Best Seller' : (plan.recommended ? 'Recommended' : '');
                            const marketingLabel = shouldShowMarketingLabel ? html`<div class="plan__special ${marketingLabelText}">${marketingLabelText}</div>` : '';

                            return html`
                                <div class="plan${index > 2 ? ' secondary' : ''}">
                                    <label for=${index} class="plan__label"></label>
                                    <input id=${index} class="plan__option" type="radio" value=${plan.rate} name=${category.categoryName}>
                                    <div class="plan__left">
                                        <h4 class="plan__name">${planName}</h4>
                                        
                                        ${marketingLabel}

                                        <div class="plan__carrier">(${plan.carrierName})</div>
                                        

                                    </div>
                                    <div class="plan__right">
                                        <p class="plan__price">+<span class="plan__price-number">$${plan.rate.toFixed(2)}</span>/mo.</p>
                                        <a href="javascript:void(0);" target="_blank" onclick="window.open('${plan.coverageUrl}', 'newWin', 'width=700,height=600,resizable,scrollbars,toolbar').focus();return false;">
                                            View Details
                                        </a>
                                    </div>
                                </div>
                            `;
                        })}
                    </div>
                    <div class="modal-footer">
                        <button id="viewMore" class="button-outline button-text">View More Plans</button>
                        <button id="cancelPlan" data-category-name=${category.categoryName} class="button-outline">Cancel</button>  
                        <button id="addPlan" class="button">Add Plan</button>
                    </div>
                </div>
            `;
        };

        const getAddedPlan = category => {
            const addedPlan = this.modalAddedPlans[category.categoryName] || null;
            if (!addedPlan) return;

            return html`
                <div class="pd-category__current-plan"><strong>+ $${addedPlan.rate}</strong>/mo</div>
            `;
        };

        const options = this.model.riderCategories.map(category => {
            const getIconName = () => category.categoryName.split(' ')[0].toLowerCase();
            const hasPlan = () => this.modalAddedPlans[category.categoryName];
            const productPrice = hasPlan() ? html`<span @click=${e => this.removePlan(category, e)}>Remove</span>` : html`Starting from: <span class="pd-category__price">$${category.riders[0].rate.toFixed(2)}</span>/mo`;

            return html`
                <div class="grid__col-3">
                    <modal-morph max-width="960px" max-height="600px">
                        <div class="pd-category__card${hasPlan() ? ' active' : ''}">
                            ${getAddedPlan(category)}
                            <div class="pd-category__description-wrapper">
                                <eh-icon class="pd-category__icon" height="80" width="80" name=${getIconName()}></eh-icon>
                                <h3 class="pd-category__name">${category.categoryName}</h3>
                                <p class="pd-category__price-label">${productPrice}</p>
                            </div>    
                            <div class="pd-category__cta-wrapper">
                                <button id="${category.productLine}" class="button-outline text--ellipsis">Add ${category.categoryName}</button>
                            </div>
                        </div>
                        <template>
                            <additional-coverage-modal>
                                
                                ${getModal(category)}

                            </additional-coverage-modal>
                        </template>
                    </modal-morph>
                </div>
            `;
        });

        return html`
            <style>
                html, body, div, span, applet, object, iframe,
                h1, h2, h3, h4, h5, h6, p, blockquote, pre,
                a, abbr, acronym, address, big, cite, code,
                del, dfn, em, img, ins, kbd, q, s, samp,
                small, strike, strong, sub, sup, tt, var,
                b, u, i, center,
                dl, dt, dd, ol, ul, li,
                fieldset, form, label, legend,
                table, caption, tbody, tfoot, thead, tr, th, td,
                article, aside, canvas, details, embed, 
                figure, figcaption, footer, header, hgroup, 
                menu, nav, output, ruby, section, summary,
                time, mark, audio, video {
                    margin: 0;
                    padding: 0;
                    border: 0;
                    font-size: 100%;
                    font: inherit;
                    vertical-align: baseline;
                }
                @-webkit-keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .grid {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                }
                .grid__col-3 {
                width: 100%;
                }
                @media screen and (min-width: 760px) {
                .grid__col-3 {
                    width: calc((100% - 30px)/2);
                    margin-right: 30px;
                }
                .grid__col-3:nth-of-type(2n),
                .grid__col-3:last-of-type {
                    margin-right: 0;
                }
                }
                @media screen and (min-width: 1140px) {
                .grid__col-3 {
                    width: calc((100% - 60px)/3);
                }
                .grid__col-3:nth-of-type(2n) {
                    margin-right: 30px;
                }
                .grid__col-3:nth-of-type(3n) {
                    margin-right: 0;
                }
                }
                .wrapper {
                max-width: 1003px;
                margin: 0 auto;
                padding-left: 20px;
                padding-right: 20px;
                }
                @media screen and (min-width: 760px) {
                .wrapper {
                    padding-left: 40px;
                    padding-right: 40px;
                }
                }
                @media screen and (min-width: 1140px) {
                .wrapper {
                    padding-left: 100px;
                    padding-right: 100px;
                }
                }
                .button-outline {
                display: inline-block;
                padding: 0 16px;
                border-radius: 5px;
                height: 40px;
                line-height: 40px;
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
                border: solid 1px #0099d6;
                background: #ffffff;
                color: #0099d6;
                }
                .button-outline:hover {
                background: #0099d6;
                color: #ffffff;
                }
                .button-outline:active {
                background: #0a749e;
                color: #ffffff;
                }
                .button-outline:disabled {
                background: #ffffff;
                border-color: #b3e0f2;
                color: #b3e0f2;
                }
                .pd-additional-coverage {
                    padding: 50px 0;
                    -webkit-animation: fadeIn 1s cubic-bezier(.694,0,.335,1);
                    animation: fadeIn 1s cubic-bezier(.694,0,.335,1);
                }
                @media screen and (min-width: 62.5rem) {
                    .pd-additional-coverage {
                        padding: 50px 0 120px;
                    }
                }
                .pd-additional-coverage .section__title {
                font-family: 'din_medium', sans-serif;
                font-size: 1.25rem;
                line-height: 1.40625rem;
                font-weight: 600;
                margin-bottom: 20px;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-additional-coverage .section__title {
                    font-size: 1.5rem;
                    line-height: 1.6875rem;
                }
                }
                .pd-additional-coverage .grid__col-3 {
                margin-top: 15px;
                margin-bottom: 15px;
                }
                .pd-category__card {
                position: relative;
                border-radius: 5px;
                background: #ffffff;
                -webkit-box-shadow: 2px 2px 3px 0 rgba(218, 218, 218, 0.5);
                box-shadow: 2px 2px 3px 0 rgba(218, 218, 218, 0.5);
                border: solid 1px #dadada;
                overflow: hidden;
                padding-bottom: 65px;
                cursor: pointer;
                -webkit-transition: box-shadow 300ms cubic-bezier(.694,0,.335,1);
                    -o-transition: box-shadow 300ms cubic-bezier(.694,0,.335,1);
                    transition: box-shadow 300ms cubic-bezier(.694,0,.335,1);
                }
                .pd-category__card.active {
                    border-color: #0099d6;
                }
                .pd-category__card.active .pd-category__price-label {
                    display: inline-block;
                    color: #0099d6;
                    font-size: 16px;
                    cursor: pointer;
                }
                .pd-category__card:hover {
                    box-shadow: none;
                }
                @media screen and (min-width: 200px) and (max-width: 760px) {
                .pd-category__card {
                    height: auto !important;
                }
                }
                .pd-category__current-plan {
                position: absolute;
                left: 50%;
                text-align: center;
                color: #ffffff;
                background: #0099d6;
                padding: 2px 20px;
                border-radius: 0 0 5px 5px;
                white-space: nowrap;
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 18px;
                font-weight: 400;
                -webkit-transform: translate(-50%, 0);
                -ms-transform: translate(-50%, 0);
                transform: translate(-50%, 0);
                }
                .pd-category__current-plan-text {
                    position: relative;
                    bottom: -3px;
                }
                .pd-category__current-plan-remove {
                position: absolute;
                top: 4px;
                left: 4px;
                width: 20px;
                height: 20px;
                cursor: pointer;
                }
                .pd-category__description-wrapper {
                text-align: center;
                padding: 20px;
                overflow: hidden;
                max-height: 240px;
                opacity: 1;
                -webkit-transition: opacity 1000ms, max-height 100ms;
                -o-transition: opacity 1000ms, max-height 100ms;
                transition: opacity 1000ms, max-height 100ms;
                }
                .pd-category__cta-wrapper {
                background: #ffffff;
                padding: 12px;
                text-align: center;
                border-top: 1px solid #cccccc;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                }
                .pd-category__icon {
                margin: 20px auto 0;
                color: #666666;
                }
                .pd-category__name {
                font-family: 'din_medium', sans-serif;
                font-size: 1.125rem;
                line-height: 1.265625rem;
                font-weight: 600;
                margin-top: 4px;
                margin-bottom: 16px;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-category__name {
                    font-size: 1.25rem;
                    line-height: 1.40625rem;
                }
                }
                .pd-category__price-label {
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: lighter;
                margin-top: 0;
                margin-bottom: 28px;
                color: #666666;
                font-size: 1.125rem;
                line-height: 1.265625rem;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-category__price-label {
                    font-size: 1.25rem;
                    line-height: 1.40625rem;
                }
                }
                .pd-category__price {
                color: #333333;
                font-weight: 600;
                }
            </style>
            <section class="pd-additional-coverage">
                <div class="wrapper">
                    <h2 class="section__title">Additional Coverage Options</h2>
                    <div class="grid">
                        ${options}
                    </div>
                </div>
            </section>
        `;
    }

    loadingTemplate() {
        return html`
            <eh-loader 
                skeleton-height="300px">
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

customElements.define('pd-additional-coverage', PdAdditionalCoverage);

export default PdAdditionalCoverage;