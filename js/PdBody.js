import {html, render} from './vendor/lit-html/lit-html.js';
import {when} from './vendor/lit-html/directives/when.js';
import './common/ModalMorph.js';
import './common/EhTooltip.js';
import './common/EhIcon.js';

class PdBody extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.lazyLoadedItems = null;

        this.render();
    }

    connectedCallback() {
        this.root.addEventListener('click', e => {
            if (this.shouldTriggerAccordion(e)) {
                const activeItem = e.target.closest('.accordion__item');
                const elToAnimate = activeItem.querySelector('.pd-plan__benefit-desc');

                if (!elToAnimate.getAttribute('data-height')) {
                    this.setAccordionItemHeights();
                }

                return this.toggleAccordion(e);
            }

            return false;
        });

        document.addEventListener('plan-detail-loaded', this.loadPlan.bind(this));
    }

    loadPlan(e) {
        this.data = e.detail.model;
        this.model = this.data.reduce((acc, group) => [...acc, ...group.benefitItems], []);
console.log(this.model);
        this.render();
    }

    shouldTriggerAccordion(e) {
        return e.target.closest('.accordion__toggle-wrapper');
    }

    findObjVal(array, name) {
        const match = array.find(obj => obj.desc === name);

        return match && match.value;
    }

    buildSummary() {
        // benefitProcessor.process(this.model, this.videoData);
        // console.log(this.model.benefitGroups);
        // const template = this.model.benefitGroups[0].benefitItems;
        // const value = benefit.sectionTitle ? html`${document.createRange().createContextualFragment(`<div class="pd-plan__benefit-value">${benefit.sectionTitle}</div>`)}` : '';
        const shouldRenderVideo = (benefit) => {
            if (benefit.video.hasVideo) {
                return html`
                    <modal-morph max-width="100%" max-height="100%" theme="dark">
                        <eh-icon style="cursor: pointer; color: #0099d6"
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
                            <iframe class="video-iframe" src=${benefit.video.videoURL}></iframe>
                        </template>
                    </modal-morph>
                `;
            }

            return '';
        }

        return this.model.map(benefit => {

            return html`
                <div class="accordion__item${benefit.isHidden ? ' show' : ' hide'}">
                    <div class="accordion__text-wrapper">
                        <div class="pd-plan__benefit">
                            <p class="pd-plan__benefit-title">${benefit.sectionHeadline}</p>
                            ${shouldRenderVideo(benefit)}
                        </div>
                        <div class="pd-plan__group">
                            <div class="pd-plan__benefit-value">${document.createRange().createContextualFragment(`${benefit.sectionTitle}`)}</div>
                            <div class="pd-plan__benefit-desc">
                                ${document.createRange().createContextualFragment(`${benefit.sectionDescription}`)}
                            </div>
                        </div>
                    </div>
                    <div class="accordion__toggle-wrapper">
                        <div class="accordion__toggle"></div>
                    </div>
                </div>
            `;
        });
    }

    setAccordionItemHeights() {
        const itemsArr = Array.from(this.root.querySelectorAll('.pd-plan__benefit-desc'));

        for (const item of itemsArr) {
            const elHeight = item.scrollHeight;
            item.setAttribute('data-height', elHeight);
            item.style.maxHeight = `${elHeight}px`;
        }
    }

    toggleAccordion(e) {
        const activeItem = e.target.closest('.accordion__item');
        const elToAnimate = activeItem.querySelector('.pd-plan__benefit-desc');

        activeItem.classList.toggle('accordion__item--closed');

        if (activeItem.classList.contains('accordion__item--closed')) {
            elToAnimate.style.maxHeight = null;
        } else {
            elToAnimate.style.maxHeight = `${elToAnimate.getAttribute('data-height')}px`;
        }

        return false;
    }

    showMoreDetails(e) {
        e.target.closest('.cta-link.show-more').style.display = 'none';
        const hiddenItems = this.root.querySelectorAll('.accordion__item.hide');

        hiddenItems.forEach((plan, index) => {
            plan.style.display = 'flex';
            plan.style.animation = `fadeIn 1.6s ${index * 100}ms cubic-bezier(.694,0,.335,1) forwards`;
        });
    }

    template() {
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
                .accordion__item {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                height: auto;
                overflow: hidden;
                padding-top: 20px;
                padding-bottom: 20px;
                border-bottom: 2px solid #cccccc;
                background: #ffffff;
                -webkit-transition: all 300ms cubic-bezier(.694,0,.335,1);
                -o-transition: all 300ms cubic-bezier(.694,0,.335,1);
                transition: all 300ms cubic-bezier(.694,0,.335,1);
                padding-left: 20px;
                padding-right: 20px;
                }
                @media screen and (min-width: 760px) {
                .accordion__item {
                    padding: 28px 40px;
                }
                }
                .accordion__item--complete {
                background: #eeeeee;
                }
                .accordion__item:hover:not(.accordion__item--complete) {
                background: #f8f8f8;
                }
                @media screen and (min-width: 1140px) {
                .accordion__item {
                    padding-left: 0;
                    padding-right: 0;
                }
                .accordion__item:hover:not(.accordion__item--complete) {
                background: none;
                }
                }
                .accordion__item--closed .accordion__text-body {
                opacity: 0;
                visibility: hidden;
                -webkit-transition: all 700ms cubic-bezier(.694,0,.335,1);
                -o-transition: all 700ms cubic-bezier(.694,0,.335,1);
                transition: all 700ms cubic-bezier(.694,0,.335,1);
                }
                .accordion__item--closed.accordion__item--num-list .toggle-wrapper {
                -webkit-transform: translateY(4px);
                -ms-transform: translateY(4px);
                transform: translateY(4px);
                }
                .accordion__text {
                -webkit-box-flex: 1;
                -ms-flex: 1;
                flex: 1;
                }
                .accordion__text-title,
                .accordion__num {
                font-family: 'din_medium', sans-serif;
                font-size: 1.125rem;
                line-height: 1.265625rem;
                font-weight: 600;
                margin-top: -1px;
                }
                @media screen and (min-width: 760px) {
                .accordion__text-title,
                .accordion__num {
                    margin-top: 1px;
                }
                }
                .accordion__text-body {
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                display: block;
                opacity: 1;
                visibility: visible;
                -webkit-transition: all 700ms cubic-bezier(.694,0,.335,1);
                -o-transition: all 700ms cubic-bezier(.694,0,.335,1);
                transition: all 700ms cubic-bezier(.694,0,.335,1);
                }
                .accordion__toggle {
                cursor: pointer;
                width: 24px;
                height: 24px;
                padding: 0;
                }
                .accordion__text-wrapper {
                display: block;
                overflow: visible;
                padding-right: 20px;
                -webkit-transition: height 300ms cubic-bezier(.694,0,.335,1);
                -o-transition: height 300ms cubic-bezier(.694,0,.335,1);
                transition: height 300ms cubic-bezier(.694,0,.335,1);
                }
                .accordion__item--num-list .checkbox__wrapper {
                width: 36px;
                margin-right: 0;
                }
                @media screen and (min-width: 760px) {
                .accordion__item--num-list .checkbox__wrapper {
                    margin-right: 12px;
                    width: 48px;
                }
                }
                .accordion__item--num-list .accordion__num {
                margin-right: 4px;
                }
                @media screen and (min-width: 760px) {
                .accordion__item--num-list .accordion__num {
                    margin-right: 16px;
                }
                }
                .accordion__item--num-list .toggle-wrapper {
                display: none;
                padding-left: 20px;
                padding: 1px 0 6px 6px;
                -webkit-transition: -webkit-transform 300ms cubic-bezier(.694,0,.335,1);
                transition: -webkit-transform 300ms cubic-bezier(.694,0,.335,1);
                -o-transition: transform 300ms cubic-bezier(.694,0,.335,1);
                transition: transform 300ms cubic-bezier(.694,0,.335,1);
                transition: transform 300ms cubic-bezier(.694,0,.335,1), -webkit-transform 300ms cubic-bezier(.694,0,.335,1);
                }
                @media screen and (min-width: 760px) {
                .accordion__item--num-list .toggle-wrapper {
                    display: block;
                }
                }
                .accordion__toggle {
                top: 6px;
                width: 19px;
                height: 24px;
                position: relative;
                cursor: pointer;
                }
                .accordion__toggle:after,
                .accordion__toggle:before {
                content: "";
                position: absolute;
                background-color: #0099d6;
                width: 14px;
                height: 1px;
                cursor: pointer;
                -webkit-transition: all 300ms cubic-bezier(.694,0,.335,1);
                -o-transition: all 300ms cubic-bezier(.694,0,.335,1);
                transition: all 300ms cubic-bezier(.694,0,.335,1);
                }
                .accordion__toggle:before {
                left: 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
                -webkit-transform-origin: 0 0;
                -ms-transform-origin: 0 0;
                transform-origin: 0 0;
                }
                .accordion__toggle:after {
                right: 0;
                -webkit-transform: rotate(-45deg);
                -ms-transform: rotate(-45deg);
                transform: rotate(-45deg);
                -webkit-transform-origin: 100% 0;
                -ms-transform-origin: 100% 0;
                transform-origin: 100% 0;
                }
                .accordion__item--closed .accordion__toggle:after {
                right: -1px;
                -webkit-transform: translateY(8px) rotate(45deg);
                -ms-transform: translateY(8px) rotate(45deg);
                transform: translateY(8px) rotate(45deg);
                }
                .accordion__item--closed .accordion__toggle:before {
                -webkit-transform: translateY(8px) rotate(-45deg);
                -ms-transform: translateY(8px) rotate(-45deg);
                transform: translateY(8px) rotate(-45deg);
                }

                .pd-plan {
                display: block;
                position: relative;
                -webkit-transition: height 1000ms cubic-bezier(.694,0,.335,1);
                -o-transition: height 1000ms cubic-bezier(.694,0,.335,1);
                transition: height 1000ms cubic-bezier(.694,0,.335,1);
                -webkit-animation: fadeIn 1s cubic-bezier(.694,0,.335,1);
                animation: fadeIn 1s cubic-bezier(.694,0,.335,1);
                }
                .pd-plan .section-header {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                padding-top: 40px;
                padding-bottom: 16px;
                -webkit-transition: padding 0.3s cubic-bezier(.694,0,.335,1);
                -o-transition: padding 0.3s cubic-bezier(.694,0,.335,1);
                transition: padding 0.3s cubic-bezier(.694,0,.335,1);
                padding-left: 20px;
                padding-right: 20px;
                }
                @media screen and (min-width: 760px) {
                .pd-plan .section-header {
                    padding-left: 40px;
                    padding-right: 40px;
                }
                }
                @media screen and (min-width: 1140px) {
                .pd-plan .section-header {
                    padding-left: 100px;
                    padding-right: 100px;
                }
                }
                @media screen and (min-width: 760px) {
                .pd-plan .section-header {
                    border-bottom: 1px solid #dfe3e8;
                    padding: 60px 40px 24px;
                }
                }
                @media screen and (min-width: 1140px) {
                .pd-plan .section-header {
                    padding: 60px 0 24px;
                }
                }
                .pd-plan .section-header .section__title {
                padding-top: 0;
                margin-bottom: 0;
                font-family: 'din_medium', sans-serif;
                font-size: 1.25rem;
                font-weight: 600;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-plan .section-header .section__title {
                    font-size: 1.5rem;
                    line-height: 1.6875rem;
                }
                }
                .cta-link.download {
                text-decoration: none;
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                color: #0099d6;
                }                
                .pd-plan .accordion__item {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                border-bottom: 1px solid #dfe3e8;
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                }
                .pd-plan .accordion__item.hide {
                    display: none;
                    opacity: 0;
                }
                .pd-plan .accordion__item.accordion__item--closed .pd-plan__benefit-desc {
                max-height: 0;
                margin-top: -12px;
                opacity: 0;
                }
                .pd-plan .accordion__item.active {
                -webkit-transition: all 0.3s cubic-bezier(.694,0,.335,1);
                -o-transition: all 0.3s cubic-bezier(.694,0,.335,1);
                transition: all 0.3s cubic-bezier(.694,0,.335,1);
                }
                .pd-plan .accordion__toggle:after,
                .pd-plan .accordion__toggle:before {
                background-color: #666666;
                }
                .pd-plan__benefit {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                font-family: 'din_medium', sans-serif;
                font-size: 1.125rem;
                line-height: 1.265625rem;
                font-weight: 600;
                font-weight: normal;
                margin-bottom: 12px;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-plan__benefit {
                    font-size: 1.25rem;
                    line-height: 1.40625rem;
                }
                }
                .pd-plan__benefit-title {
                    margin: 0;
                    padding-right: 8px;
                }
                .pd-plan__benefit eh-icon {
                    position: relative;
                    top: -6px;
                }
                .pd-plan__benefit-tooltip {
                display: inline-block;
                position: relative;
                width: 20px;
                height: 20px;
                top: 0;
                margin: 0 0 0 10px;
                opacity: 0.6;
                -webkit-transition: all 300ms cubic-bezier(.694,0,.335,1);
                -o-transition: all 300ms cubic-bezier(.694,0,.335,1);
                transition: all 300ms cubic-bezier(.694,0,.335,1);
                }
                .pd-plan__benefit-tooltip path {
                fill: #999999;
                }
                .pd-plan__benefit-tooltip:hover {
                opacity: 1;
                -webkit-transform: scale(1.1);
                -ms-transform: scale(1.1);
                transform: scale(1.1);
                }
                .pd-plan .video__play-icon {
                display: inline-block;
                position: relative;
                top: 0;
                left: 0;
                width: 20px;
                height: 20px;
                margin: 0 0 0 12px;
                opacity: 1;
                cursor: pointer;
                z-index: 20;
                }
                .pd-plan__benefit-value {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -ms-flex-direction: column;
                flex-direction: column;
                font-family: 'din_medium', sans-serif;
                font-size: 1.125rem;
                line-height: 1.3;
                margin-bottom: 8px;
                font-weight: 600;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-plan__benefit-value {
                    font-size: 1.25rem;
                }
                }
                .pd-plan__benefit-desc {
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                will-change: max-height;
                overflow: hidden;
                margin-top: 8px;
                -webkit-transition: all 500ms cubic-bezier(.694,0,.335,1);
                -o-transition: all 500ms cubic-bezier(.694,0,.335,1);
                transition: all 500ms cubic-bezier(.694,0,.335,1);
                opacity: 1;
                }
                .pd-plan__see-more {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                position: absolute;
                bottom: 0;
                left: 0;
                height: 80px;
                width: 100%;
                background: -webkit-gradient(linear, left bottom, left top, color-stop(40%, #ffffff), to(transparent));
                background: -webkit-linear-gradient(bottom, #ffffff 40%, transparent);
                background: -o-linear-gradient(bottom, #ffffff 40%, transparent);
                background: linear-gradient(to top, #ffffff 40%, transparent);
                padding: 20px;
                }
                .pd-plan__see-more-text {
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                margin-left: 10px;
                color: #0099d6;
                }
                @media screen and (min-width: 760px) {
                .pd-plan .accordion__text-wrapper {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    width: 100%;
                }
                .pd-plan .pd-plan__benefit {
                    -webkit-box-flex: 0;
                    -ms-flex: 0 0 40%;
                    flex: 0 0 40%;
                }
                .pd-plan .pd-plan__group {
                    -webkit-box-flex: 0;
                    -ms-flex: 0 0 60%;
                    flex: 0 0 60%;
                }
                .pd-plan .pd-plan__benefit-value {
                    -webkit-box-orient: horizontal;
                    -webkit-box-direction: normal;
                    -ms-flex-direction: row;
                    flex-direction: row;
                }
                }
                @media screen and (min-width: 1140px) {
                .pd-plan {
                    max-width: 1003px;
                    padding: 0 100px;
                    margin: 0 auto;
                }
                .pd-plan .accordion__toggle-wrapper {
                    display: none;
                }
                }
                .secondary-action {
                display: -webkit-inline-box;
                display: -ms-inline-flexbox;
                display: inline-flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                color: #0099d6;
                cursor: pointer;
                -ms-flex-item-align: start;
                align-self: flex-start;
                margin-top: 20px;
                
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
                height: 30px;
                line-height: 30px;
                }
                .secondary-action.button-outline {
                margin-top: 20px;
                }
                .secondary-action .accordion__toggle {
                margin-left: 8px;
                -webkit-transform: scale(0.85);
                -ms-transform: scale(0.85);
                transform: scale(0.85);
                }
                .secondary-action .accordion__toggle:before,
                .secondary-action .accordion__toggle:after {
                background: #0099d6;
                }
                @media screen and (min-width: 760px) {
                .secondary-action.button-outline {
                    float: left;
                    position: relative;
                    top: -2px;
                    margin-left: 30px;
                    margin-top: 0;
                }
                }
                .new-items__container .accordion__item {
                opacity: 0;
                }
                .cta-link {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                cursor: pointer;
                }
                .cta-link__icon {
                width: auto;
                height: auto;
                }
                .cta-link__text {
                margin-left: 4px;
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                color: #0099d6;
                width: 71px;
                text-align: right;
                white-space: nowrap;
                overflow: hidden;
                }
                .cta-link.show-more {
                position: relative;
                margin: 20px;
                height: 48px;
                overflow: hidden;
                -webkit-transition: -webkit-transform 1000ms;
                transition: -webkit-transform 1000ms;
                -o-transition: transform 1000ms;
                transition: transform 1000ms;
                transition: transform 1000ms, -webkit-transform 1000ms;
                }
                @media screen and (min-width: 760px) {
                    .cta-link__text {
                        width: initial;
                    }
                    .cta-link.show-more {
                        margin: 20px 40px;
                    }
                }
                @media screen and (min-width: 1140px) {
                    .cta-link.show-more {
                        margin: 28px 0 40px;
                    }  
                }
                .cta-link.show-more .accordion__toggle-wrapper {
                width: 28px;
                }
                .cta-link.show-more .accordion__toggle:before,
                .cta-link.show-more .accordion__toggle:after {
                background: #0099d6;
                }
                .cta-link.show-more .cta-link__text {
                margin-left: 12px;
                -webkit-transition: margin-left 0.3s cubic-bezier(.694,0,.335,1);
                -o-transition: margin-left 0.3s cubic-bezier(.694,0,.335,1);
                transition: margin-left 0.3s cubic-bezier(.694,0,.335,1);
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                color: #0099d6;
                width: initial;
                }
                .cta-link.show-more .show-more__loader {
                fill: #0099d6;
                width: 28px;
                height: 24px;
                margin-right: 0;
                }
                .cta-link.show-more .show-more__inner {
                width: 100%;
                height: 100%;
                -webkit-transition: -webkit-transform 300ms cubic-bezier(.694,0,.335,1);
                transition: -webkit-transform 300ms cubic-bezier(.694,0,.335,1);
                -o-transition: transform 300ms cubic-bezier(.694,0,.335,1);
                transition: transform 300ms cubic-bezier(.694,0,.335,1);
                transition: transform 300ms cubic-bezier(.694,0,.335,1), -webkit-transform 300ms cubic-bezier(.694,0,.335,1);
                }
                .cta-link.show-more .show-more__inner > div {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                padding: 12px 0;
                }
                .pd-plan.loading .show-more__inner {
                -webkit-transform: translateY(-100%);
                -ms-transform: translateY(-100%);
                transform: translateY(-100%);
                }
                .pd-plan.completed .show-more__inner {
                -webkit-transform: translateY(-200%);
                -ms-transform: translateY(-200%);
                transform: translateY(-200%);
                }
                .pd-plan .show-more__final-state .cta-link__text {
                color: #333333;
                }
                .pd-cta {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                position: fixed;
                background: #ffffff;
                z-index: 100;
                bottom: 0;
                left: 0;
                width: 100%;
                -webkit-box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.09), 0 -6px 6px rgba(0, 0, 0, 0.13);
                box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.09), 0 -6px 6px rgba(0, 0, 0, 0.13);
                -webkit-animation: fadeInUp 1s cubic-bezier(.694,0,.335,1) forwards;
                animation: fadeInUp 1s cubic-bezier(.694,0,.335,1) forwards;
                }
                .pd-cta__price,
                .pd-cta__button {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-flex: 1;
                -ms-flex: 1 1 auto;
                flex: 1 1 auto;
                padding: 12px;
                }
                .pd-cta__price {
                color: #0099d6;
                font-family: 'proxima_nova_regular', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                }
                .pd-cta__button {
                background: #f69234;
                color: #ffffff;
                }
                @media screen and (min-width: 760px) {
                .pd-cta {
                    -webkit-animation: fadeAwayDown 1s cubic-bezier(.694,0,.335,1) forwards;
                    animation: fadeAwayDown 1s cubic-bezier(.694,0,.335,1) forwards;
                    pointer-events: none;
                }
                }
            </style>

            <div class="pd-plan">
                <div class="section-header">
                    <h1 class="section__title">Plan Summary</h1>
                    <a href="javascript:void(0);" class="cta-link download" target="_blank" onclick="window.open('${this.model.coverageUrl}', 'newWin', 'width=700,height=600,resizable,scrollbars,toolbar').focus();return false;">
                        <eh-icon 
                            width="28"
                            height="28"
                            name="download">
                        </eh-icon>
                        <p class="cta-link__text">Download Plan Brochure</p>
                    </a>
                </div>
                
                ${this.buildSummary()}

                <div class="cta-link show-more" @click=${(e) => this.showMoreDetails(e)}>
                    <div class="accordion__toggle"></div>
                    <p class="cta-link__text">Show More Details</p>
                </div>
            </div>
        `;
    }

    loadingTemplate() {
        return html`
            <eh-loader 
                skeleton-height="600px"
                is-main="true">
            </eh-loader>
        `;
    }

    render() {
        render(
            when(this.model, this.template.bind(this), this.loadingTemplate.bind(this))
            ,
            this.root);
    }
}

customElements.define('pd-body', PdBody);

export default PdBody;
