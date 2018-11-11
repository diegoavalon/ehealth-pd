import { planHeader, planSummary, crossSell, resources } from './_model.js';

class PdPlan extends HTMLElement {
    constructor() {
        super();
        sessionStorage.removeItem('addedPlans');
    }
    connectedCallback() {
        this.childComponents = {
            header: this.querySelector('pd-header'),
            body: this.querySelector('pd-body'),
            crossSell: this.querySelector('pd-additional-coverage'),
            resources: this.querySelector('pd-resources')
        };

        for (const key in this.childComponents) {
            if (this.childComponents.hasOwnProperty(key)) {
                this.childComponents[key].model = false;
            }
        }

        this.getPlan();
    }

    getPlan() {
        this.loadHeaderData();
        this.loadPlanBodyData();
        this.loadCrossSell();
        this.loadResources();
    }

    loadHeaderData() {
        setTimeout(() => {
            document.dispatchEvent(
                new CustomEvent('plan-header-loaded', {
                    detail: {
                        model: planHeader
                    },
                    bubbles: true
                })
            );
        }, 1000);
    }

    loadPlanBodyData() {
        setTimeout(() => {
            document.dispatchEvent(
                new CustomEvent('plan-detail-loaded', {
                    detail: {
                        model: planSummary
                    },
                    bubbles: true
                })
            );
        }, 1000);
    }

    loadCrossSell() {
        setTimeout(() => {
            document.dispatchEvent(
                new CustomEvent('cross-sell-loaded', {
                    detail: {
                        model: crossSell
                    },
                    bubbles: true
                })
            );
        }, 1000);
    }

    loadResources() {
        setTimeout(() => {
            document.dispatchEvent(
                new CustomEvent('resources-loaded', {
                    detail: {
                        model: resources
                    },
                    bubbles: true
                })
            );
        }, 1000);
    }
}

customElements.define('pd-plan', PdPlan);

export default PdPlan;
