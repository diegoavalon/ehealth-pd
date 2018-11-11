class PdCrossSellModal extends HTMLElement {
    constructor() {
        super();
        this.DOM = {
            addPlanBtn: this.querySelector('#addPlan'),
            cancelPlanBtn: this.querySelector('#cancelPlan'),
            viewMoreBtn: this.querySelector('#viewMore')
        };
        this.currentCategory = this.DOM.cancelPlanBtn.getAttribute('data-category-name');
    }

    connectedCallback() {
        this.modalAddedPlans = JSON.parse(sessionStorage.getItem('addedPlans')) || {};
        this.DOM.cancelPlanBtn.addEventListener('click', this.cancelPlan.bind(this));
        this.DOM.addPlanBtn.addEventListener('click', this.addPlan.bind(this));
        this.DOM.viewMoreBtn.addEventListener('click', this.viewMorePlans.bind(this));
        this.addEventListener('change', this.selectPlan.bind(this));

        // Initialize state of modal
        if (this.modalAddedPlans[this.currentCategory]) {
            const currentCategoryData = this.modalAddedPlans[this.currentCategory];
            const inputs = this.querySelectorAll('input');

            inputs.forEach(input => {
                if (currentCategoryData.id === input.id) {
                    input.checked = true;
                    input.closest('.plan').classList.add('selected');
                }
            });
        } else {
            this.DOM.addPlanBtn.disabled = true;
        }
    }

    viewMorePlans() {
        this.DOM.viewMoreBtn.style.display = 'none';
        const hiddenPlans = this.querySelectorAll('.plan.secondary');

        hiddenPlans.forEach((plan, index) => {
            plan.style.display = 'flex';
            plan.style.animation = `fadeIn 1.6s ${index * 100}ms cubic-bezier(.694,0,.335,1) forwards`;
        });
    }

    selectPlan(e) {
        this.DOM.addPlanBtn.disabled = false;
        const plans = this.querySelectorAll('.plan');

        plans.forEach(plan => plan.classList.remove('selected'));
        e.target.parentNode.classList.add('selected');
    }

    addPlan() {
        const match = this.querySelector('input:checked');

        this.modalAddedPlans[match.name] = {
            id: match.id,
            name: match.name,
            rate: match.value
        };

        sessionStorage.setItem('addedPlans', JSON.stringify(this.modalAddedPlans));
        this.dispatchAddPlan();
        this.dispatchCloseModal();
    }

    cancelPlan() {
        this.dispatchCloseModal();
    }

    dispatchCloseModal() {
        document.dispatchEvent(
            new CustomEvent('close-modal', {
                bubbles: true
            })
        );
    }

    dispatchAddPlan() {
        document.dispatchEvent(
            new CustomEvent('plan-updated', {
                detail: {
                    toastType: 'Success',
                    toastMessage: 'You added more coverage'
                },
                bubbles: true
            })
        );
    }

}

customElements.define('additional-coverage-modal', PdCrossSellModal);

export default PdCrossSellModal;
