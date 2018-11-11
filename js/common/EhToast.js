import {html, render} from './../vendor/lit-html/lit-html.js';

class EhToast extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.isActive = false;
    }

    connectedCallback() {
        this.render();

        document.addEventListener('plan-updated', this.triggerToast.bind(this));
    }
    
    triggerToast(e) {
        this.isActive = true;
        this.message = e.detail.toastMessage;
        this.type = e.detail.toastType;
        this.render();

        setTimeout(() => {
            this.isActive = false;
            this.render();
        }, 5000);
    }

    template() {
        return html`
            <style>
                .eh-toast {
                    display: -ms-flexbox;
                    display: flex;
                    position: fixed;
                    bottom: 0;
                    left: 50%;
                    -ms-flex-align: center;
                    align-items: center;
                    -ms-flex-pack: start;
                    justify-content: flex-start;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    padding-right: 24px;
                    padding-left: 24px;
                    -webkit-transform: translate(-50%,100%);
                    -ms-transform: translate(-50%,100%);
                    transform: translate(-50%,100%);
                    -webkit-transition: -webkit-transform .25s cubic-bezier(.4,0,1,1) 0ms;
                    transition: -webkit-transform .25s cubic-bezier(.4,0,1,1) 0ms;
                    -o-transition: transform .25s 0ms cubic-bezier(.4,0,1,1);
                    transition: transform .25s cubic-bezier(.4,0,1,1) 0ms;
                    transition: transform .25s cubic-bezier(.4,0,1,1) 0ms,-webkit-transform .25s cubic-bezier(.4,0,1,1) 0ms;
                    background-color: #333333;
                    pointer-events: none;
                    will-change: transform;
                    z-index: 110;
                }
                .eh-toast.active {
                    -webkit-transform: translate(-50%, 0);
                    -ms-transform: translate(-50%, 0);
                    transform: translate(-50%, 0);
                    -webkit-transition: -webkit-transform .25s cubic-bezier(0,0,.2,1) 0ms;
                    transition: -webkit-transform .25s cubic-bezier(0,0,.2,1) 0ms;
                    -o-transition: transform .25s 0ms cubic-bezier(0,0,.2,1);
                    transition: transform .25s cubic-bezier(0,0,.2,1) 0ms;
                    transition: transform .25s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .25s cubic-bezier(0,0,.2,1) 0ms;
                    pointer-events: auto;
                }
                .eh-toast__text {
                    font-family: 'proxima_nova_regular', sans-serif;
                    -moz-osx-font-smoothing: grayscale;
                    -webkit-font-smoothing: antialiased;
                    font-size: 1rem;
                    line-height: 1.5rem;
                    font-weight: 600;
                    letter-spacing: .03125em;
                    text-decoration: inherit;
                    text-transform: inherit;
                    margin-left: 0;
                    margin-right: auto;
                    display: -ms-flexbox;
                    display: flex;
                    -ms-flex-align: center;
                    align-items: center;
                    height: 48px;
                    -webkit-transition: opacity .3s cubic-bezier(.4,0,1,1) 0ms;
                    -o-transition: opacity .3s 0ms cubic-bezier(.4,0,1,1);
                    transition: opacity .3s cubic-bezier(.4,0,1,1) 0ms;
                    opacity: 0;
                    color: #fff;
                }
                .eh-toast.active .eh-toast__text {
                    -webkit-transition: opacity .3s cubic-bezier(.4,0,1,1) 0ms;
                    -o-transition: opacity .3s 0ms cubic-bezier(.4,0,1,1);
                    transition: opacity .3s cubic-bezier(.4,0,1,1) 0ms;
                    opacity: 1;
                }
                .eh-toast__action-wrapper {
                    padding-left: 24px;
                    padding-right: 0;
                }
                .eh-toast__action-button {
                    font-family: 'proxima_nova_regular', sans-serif;
                    -moz-osx-font-smoothing: grayscale;
                    -webkit-font-smoothing: antialiased;
                    font-size: .875rem;
                    line-height: 2.25rem;
                    font-weight: 600;
                    letter-spacing: .08929em;
                    text-decoration: none;
                    text-transform: uppercase;
                    color: #11e437;
                    padding: 0;
                    -webkit-transition: opacity .3s cubic-bezier(.4,0,1,1) 0ms;
                    -o-transition: opacity .3s 0ms cubic-bezier(.4,0,1,1);
                    transition: opacity .3s cubic-bezier(.4,0,1,1) 0ms;
                    border: none;
                    outline: none;
                    background-color: transparent;
                    opacity: 0;
                }
                .eh-toast.active .eh-toast__action-button {
                    -webkit-transition: opacity .3s cubic-bezier(.4,0,1,1) 0ms;
                    -o-transition: opacity .3s 0ms cubic-bezier(.4,0,1,1);
                    transition: opacity .3s cubic-bezier(.4,0,1,1) 0ms;
                    opacity: 1;
                }
            </style>
            <div class="eh-toast${this.isActive ? ' active' : ''}">
                <div class="eh-toast__text">${this.message}</div>
                <div class="eh-toast__action-wrapper">
                    <button type="button" class="eh-toast__action-button">${this.type}</button>
                </div>
            </div>
        `;
    }

    render() {
        render(this.template(), this.root);
    }
}

customElements.define('eh-toast', EhToast);

export default EhToast;