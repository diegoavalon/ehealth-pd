class EhLoader extends HTMLElement {
    constructor() {
        super();
        this.theme = this.getAttribute('theme') || 'light';
        this.isMain = this.getAttribute('is-main') || 'false';
        this.skeletonHeight = this.getAttribute('skeleton-height') || '400px';
        this.skeletonStyles = this.getAttribute('skeleton-styles');
    }

    connectedCallback() {
        const color = this.theme === 'dark' ? '#f8f8f8' : '#cccccc';

        if (this.isMain === 'true') {
            this.size = {
                width: '64',
                height: '64'
            };
        } else {
            this.size = { 
                width: '36',
                height: '36'
            };
        }

        this.innerHTML = `
            <style>
                @-webkit-keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .skeleton {
                    position: relative;
                    width: 100%;
                    height: ${this.skeletonHeight};
                    ${this.skeletonStyles}
                }
                .skeleton__loader {
                    position: relative;
                    top: 50%;
                    left: 50%;
                    padding: 4px;
                    -webkit-transform: translate3d(-50%, -50%, 0);
                        transform: translate3d(-50%, -50%, 0);
                    animation: fadeIn 1s cubic-bezier(.694,0,.335,1);                    
                }
            </style>
            <div class="skeleton">
                <svg class="skeleton__loader" width=${this.size.width} height=${this.size.height} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                            <stop stop-color=${color} stop-opacity="0" offset="0%"/>
                            <stop stop-color=${color} stop-opacity=".631" offset="63.146%"/>
                            <stop stop-color=${color} offset="100%"/>
                        </linearGradient>
                    </defs>
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)">
                            <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="4">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="0.9s"
                                    repeatCount="indefinite" />
                            </path>
                            <circle fill=${color} cx="36" cy="18" r="2">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="0.9s"
                                    repeatCount="indefinite" />
                            </circle>
                        </g>
                    </g>
                </svg>
            </div>    
        `;
    }
}

customElements.define('eh-loader', EhLoader);

export default EhLoader;