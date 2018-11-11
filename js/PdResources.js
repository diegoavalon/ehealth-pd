import {html, render} from './vendor/lit-html/lit-html.js';
import {when} from './vendor/lit-html/directives/when.js';
import './common/ModalMorph.js';

class PdResources extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
        document.addEventListener('resources-loaded', this.loadResources.bind(this));
    }

    loadResources(e) {
        this.model = e.detail.model;
        this.render();
    }

    template() {
        const carrierDisclaimer = document.createRange().createContextualFragment(`<div class="pd-disclaimer">From the Carrier:</div>${this.model.carrierDisclaimer}`);
        const standardDisclaimer = document.createRange().createContextualFragment(`<div class="pd-disclaimer">eHealth:</div>${this.model.standardDisclaimer}`);

        const planAssets = this.model.planAssets.benefitItems.map(asset => {
            return html`
                <div class="grid__col-4">
                    <a href="javascript:void(0);" target="_blank" onclick="window.open('${asset.value}', 'newWin', 'width=700,height=600,resizable,scrollbars,toolbar').focus();return false;">
                        <div class="video">
                            <div class="video__screenshot">
                                <div class="video__screenshot-inner video__screenshot-inner--how-to" style="background-size: contain; background-image: url(//cdn.shopify.com/s/files/1/0051/7692/products/aba-briefs-cover-1_88874755-64aa-4b26-9aca-03e5899c000c_160x@3x.png?v=1463456001)"></div>
                            </div>
                        </div>
                        <h3 class="video-title">${asset.desc}</h3>
                    </a>
                </div>
            `;
        });

        const videoPlaylist = this.model.videos.map(video => {
            return html`
                <div class="grid__col-4">
                    <modal-morph max-width="100%" max-height="100%" theme="dark">
                        <div class="video">
                            <div class="video__screenshot">
                                <div class="video__screenshot-inner video__screenshot-inner--how-to" style="background-image: url()"></div>
                                <div class="video__time-duration">1:05</div>
                            </div>
                            <svg class="video__play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                                <g fill="none" fill-rule="evenodd" opacity=".9">
                                    <path fill="#0099d6" d="M42.678 7.323c9.763 9.762 9.763 25.59 0 35.354s-25.593 9.764-35.355 0c-9.764-9.763-9.764-25.591 0-35.354 9.762-9.764 25.59-9.764 35.355 0z"/>
                                    <path fill="#FFF" stroke="#FFF" stroke-linejoin="round" stroke-width="1.299" d="M20.755 16.038L32.075 25l-11.32 8.962z"/>
                                </g>
                            </svg>
                        </div>
                        <template>
                            <style>
                                .video-iframe {
                                    width: 100%;
                                    height: 100%;
                                }
                            </style>
                            <iframe class="video-iframe" src=${video.sourceUrl}></iframe>
                        </template>
                    </modal-morph>
                    <h3 class="video-title">${video.featureCode}</h3>
                    <p class="video-description">${video.description}</p>
                </div>
            `;
        });

        return html`
            <style>
                @-webkit-keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                :host {
                    display: block;
                    background: #f6f6f6;
                    padding-top: 30px;
                    padding-bottom: 80px;
                    -webkit-animation: fadeIn 1s cubic-bezier(.694,0,.335,1);
                    animation: fadeIn 1s cubic-bezier(.694,0,.335,1);
                }
                @media screen and (min-width: 1140px) {
                    :host {
                        padding-top: 60px;
                        padding-bottom: 120px;
                    }
                
                }
                a {
                    text-decoration: none;
                    color: inherit;
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
                .grid__col-4 {
                width: 100%;
                }
                @media screen and (min-width: 500px) {
                .grid__col-4 {
                    width: calc((100% - 30px)/2);
                    margin-right: 30px;
                }
                .grid__col-4:nth-of-type(2n),
                .grid__col-4:last-of-type {
                    margin-right: 0;
                }
                }
                @media screen and (min-width: 760px) {
                .grid__col-4 {
                    width: calc((100% - 60px)/3);
                }
                .grid__col-4:nth-of-type(2n) {
                    margin-right: 30px;
                }
                .grid__col-4:nth-of-type(3n) {
                    margin-right: 0;
                }
                }
                @media screen and (min-width: 1140px) {
                .grid__col-4 {
                    width: calc((100% - 90px)/4);
                }
                .grid__col-4:nth-of-type(2n),
                .grid__col-4:nth-of-type(3n) {
                    margin-right: 30px;
                }
                .grid__col-4:nth-of-type(4n) {
                    margin-right: 0;
                }
                }
                .pd-videos__wrapper {
                max-width: 1003px;
                margin: 0 auto;
                padding-left: 20px;
                padding-right: 20px;
                }
                @media screen and (min-width: 760px) {
                .pd-videos__wrapper {
                    padding-left: 40px;
                    padding-right: 40px;
                }
                }
                @media screen and (min-width: 1140px) {
                .pd-videos__wrapper {
                    padding-left: 100px;
                    padding-right: 100px;
                }
                }
                .pd-videos .section__title {
                font-family: 'din_medium', sans-serif;
                font-size: 1.25rem;
                line-height: 1.40625rem;
                font-weight: 600;
                }
                @media screen and (min-width: 62.5rem) {
                .pd-videos .section__title {
                    font-size: 1.5rem;
                    line-height: 1.6875rem;
                }
                }
                .pd-videos .video__screenshot {
                width: 100%;
                }
                .pd-videos .grid__col-4 {
                margin-top: 15px;
                margin-bottom: 30px;
                }
                @media screen and (min-width: 1100px) {
                .pd-videos .grid__col-4 {
                    width: calc((100% - (60px * 3))/4);
                    margin-right: 60px;
                }
                .pd-videos .grid__col-4:nth-of-type(4n) {
                    margin-right: 0;
                }
                }
                .video {
                position: relative;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                margin-bottom: 12px;
                }
                .video__play-icon {
                display: table-cell;
                position: absolute;
                top: 50%;
                left: 50%;
                width: 50px;
                height: 50px;
                margin: -25px 0 0 -25px;
                opacity: 1;
                cursor: pointer;
                z-index: 20;
                -webkit-transition: opacity 240ms cubic-bezier(0.694, 0, 0.335, 1), -webkit-transform 240ms cubic-bezier(0.694, 0, 0.335, 1);
                transition: opacity 240ms cubic-bezier(0.694, 0, 0.335, 1), -webkit-transform 240ms cubic-bezier(0.694, 0, 0.335, 1);
                -o-transition: opacity 240ms cubic-bezier(0.694, 0, 0.335, 1), transform 240ms cubic-bezier(0.694, 0, 0.335, 1);
                transition: opacity 240ms cubic-bezier(0.694, 0, 0.335, 1), transform 240ms cubic-bezier(0.694, 0, 0.335, 1);
                transition: opacity 240ms cubic-bezier(0.694, 0, 0.335, 1), transform 240ms cubic-bezier(0.694, 0, 0.335, 1), -webkit-transform 240ms cubic-bezier(0.694, 0, 0.335, 1);
                }
                .video__play-icon:hover {
                opacity: 1;
                -webkit-transform: scale(1.15);
                -ms-transform: scale(1.15);
                transform: scale(1.15);
                }
                .video-title,
                .video-description {
                margin: 0 auto;
                text-align: center;
                }
                .video-title {
                font-family: 'proxima', sans-serif;
                font-size: 1.125rem;
                line-height: 1.3;
                font-weight: 400;
                font-weight: 600;
                margin-bottom: 0;
                }
                .video-description {
                font-family: 'proxima', sans-serif;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 400;
                margin-bottom: 0;
                }
                .video__screenshot {
                position: relative;
                width: 248px;
                height: 138px;
                background: #cccccc;
                overflow: hidden;
                }
                .video__screenshot-inner {
                position: relative;
                width: 100%;
                height: 100%;
                background: #cccccc center center no-repeat;
                background-size: cover;
                -webkit-transition: -webkit-transform 3s cubic-bezier(0.694, 0, 0.335, 1);
                transition: -webkit-transform 3s cubic-bezier(0.694, 0, 0.335, 1);
                -o-transition: transform 3s cubic-bezier(0.694, 0, 0.335, 1);
                transition: transform 3s cubic-bezier(0.694, 0, 0.335, 1);
                transition: transform 3s cubic-bezier(0.694, 0, 0.335, 1), -webkit-transform 3s cubic-bezier(0.694, 0, 0.335, 1);
                -webkit-transform-origin: right bottom;
                -ms-transform-origin: right bottom;
                transform-origin: right bottom;
                }
                .video__screenshot-inner:after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.05);
                z-index: 10;
                }
                .video__screenshot-inner--how-to {
                background-image: url(../images/app-overview.png);
                }
                .video__screenshot-inner--required-docs {
                background-image: url(../images/docs-you-need.png);
                }
                .video__screenshot-inner--employees {
                background-image: url(../images/employee-app.png);
                }
                .video:hover .video__screenshot-inner {
                -webkit-transform: scale(1.2);
                -ms-transform: scale(1.2);
                transform: scale(1.2);
                }
                .video__time-duration {
                position: absolute;
                bottom: 4px;
                right: 4px;
                background: #333333;
                color: #ffffff;
                font-size: 11px;
                padding: 1px 3px;
                border-radius: 3px;
                letter-spacing: 1px;
                }
                @media screen and (min-width: 1140px) {
                .video-description,
                .video-title {
                    text-align: left;
                }
                }
                .pd-disclaimer {
                    font-family: 'din_medium', sans-serif;
                    font-size: 1rem;
                    line-height: 1.265625rem;
                    font-weight: 600;
                    margin-top: 28px;
                    margin-bottom: 12px;
                }
                .section__text {
                    font-family: 'proxima_nova_regular', sans-serif;
                    font-size: 0.875rem;
                    line-height: 1.3125rem;
                    font-weight: 400;
                }
            </style>
            <div class="pd-videos">
                <div class="pd-videos__wrapper">
                    <h2 class="section__title">Resources</h2>
                    <div class="grid">
                        
                        ${planAssets}

                        ${videoPlaylist}

                    </div>

                    <h2 class="section__title">Disclaimers</h2>

                    <div class="section__text">
                        ${this.model.standardDisclaimer.length > 0 ? standardDisclaimer : null}
                    </div>
                    
                    <div class="section__text">
                        ${this.model.carrierDisclaimer.length > 0 ? carrierDisclaimer : null}
                    </div>
                </div>
            </div>
        `;
    }

    loadingTemplate() {
        return html`
            <eh-loader 
                skeleton-height="300px"
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
            this.root);
    }
}

customElements.define('pd-resources', PdResources);

export default PdResources;
