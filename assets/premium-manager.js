// Updated Premium Manager for R99 Pricing
class PremiumManager {
    constructor() {
        this.userTier = 'explorer';
        this.featureFlags = new Map();
        this.pricing = window.zarPricing;
        this.init();
    }

    init() {
        this.loadUserSubscription();
        this.setupFeatureFlags();
        this.updateUIForTier();
        console.log('🎯 Premium Manager Initialized - Tier: ' + this.userTier);
    }

    showGrowthUpsell() {
        const growthTier = this.pricing.getTier('growth');
        const monthlyCost = growthTier.monthly;
        const yearlyCost = growthTier.yearly;
        const yearlySavings = growthTier.savings;

        const upsellHTML = `
            <div class="premium-upsell growth-tier" style="
                background: linear-gradient(135deg, #8B5FBF, #6B46C1);
                color: white;
                padding: 1.5rem;
                border-radius: 15px;
                margin: 1.5rem 0;
                text-align: center;
                border: 3px solid #20c997;
                position: relative;
            ">
                <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); 
                           background: #20c997; color: white; padding: 0.25rem 1rem; 
                           border-radius: 15px; font-size: 0.8rem; font-weight: bold;">
                    MOST POPULAR
                </div>
                
                <h4 style="margin: 0.5rem 0;">🚀 Transform Your Child's Learning Journey!</h4>
                <p style="margin: 0.5rem 0; opacity: 0.9;">Upgrade to <strong>Growth Tier</strong> and unlock their full potential</p>
                
                <div style="display: flex; justify-content: center; gap: 2rem; margin: 1rem 0; flex-wrap: wrap;">
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold;">R${monthlyCost}</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">per month</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold;">R${yearlyCost}</div>
                        <div style="font-size: 0.9rem; opacity: 0.8;">
                            per year 
                            <div style="color: #20c997; font-weight: bold;">Save R${yearlySavings}</div>
                        </div>
                    </div>
                </div>

                <div style="text-align: left; background: rgba(255,255,255,0.1); 
                           padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                    <div style="font-weight: bold; margin-bottom: 0.5rem;">You'll get:</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem;">
                        <div>🎙️ Voice AI Companion</div>
                        <div>⏰ Smart Routines</div>
                        <div>😊 Mood Tracking</div>
                        <div>🎯 Brain Breaks</div>
                        <div>📚 CAPS Content</div>
                        <div>🏆 Enhanced Rewards</div>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.premiumManager.upgradeToGrowth('monthly')" style="
                        background: white;
                        color: #8B5FBF;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 25px;
                        font-weight: bold;
                        cursor: pointer;
                        min-width: 140px;
                    ">Monthly - R${monthlyCost}</button>
                    
                    <button onclick="window.premiumManager.upgradeToGrowth('yearly')" style="
                        background: #20c997;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 25px;
                        font-weight: bold;
                        cursor: pointer;
                        min-width: 140px;
                    ">Yearly - R${yearlyCost}</button>
                </div>

                <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.8;">
                    <strong>Better value than:</strong> Tutoring (R200/hr) • Extra Murals (R400/month) • Educational Toys (R150+)
                </div>
            </div>
        `;

        // Insert upsell in strategic locations
        const targetElements = document.querySelectorAll('.upsell-location, .premium-feature-locked');
        targetElements.forEach(element => {
            if (!element.querySelector('.premium-upsell')) {
                element.innerHTML = upsellHTML + element.innerHTML;
            }
        });
    }

    async upgradeToGrowth(billingCycle = 'monthly') {
        try {
            console.log(`🔄 Upgrading to Growth tier (${billingCycle})...`);
            
            const growthTier = this.pricing.getTier('growth');
            const amount = billingCycle === 'yearly' ? growthTier.yearly : growthTier.monthly;
            
            // Show payment processing
            this.showPaymentProcessing(amount, billingCycle);
            
            // Simulate payment processing
            const success = await this.processPayment(amount, billingCycle);
            
            if (success) {
                this.userTier = 'growth';
                localStorage.setItem('user-tier', 'growth');
                localStorage.setItem('billing-cycle', billingCycle);
                this.setupFeatureFlags();
                this.updateUIForTier();
                
                this.showUpgradeSuccess(growthTier, billingCycle);
                this.initializePremiumFeatures();
            }
        } catch (error) {
            console.error('❌ Upgrade failed:', error);
            this.showUpgradeError();
        }
    }

    showPaymentProcessing(amount, billingCycle) {
        const processingHTML = `
            <div class="payment-processing" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div style="text-align: center; background: white; color: #333; padding: 2rem; border-radius: 15px; max-width: 400px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                    <h3>Processing Your Upgrade</h3>
                    <p>Setting up your <strong>Growth Tier</strong> subscription...</p>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                        <strong>Amount:</strong> R${amount}<br>
                        <strong>Billing:</strong> ${billingCycle === 'yearly' ? 'Yearly (Save R189)' : 'Monthly'}
                    </div>
                    <div class="loading-dots"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', processingHTML);
    }

    showUpgradeSuccess(tier, billingCycle) {
        document.querySelector('.payment-processing')?.remove();
        
        alert(`🎉 WELCOME TO GROWTH TIER!
        
You now have access to:
• Advanced Voice AI Companion
• Smart Routines & Daily Structure  
• Mood Tracking & Emotional Insights
• Brain Breaks & Enhanced Rewards
• CAPS-Aligned Content Library

Thank you for investing in your child's future!`);
        
        // Track conversion
        this.trackConversion('growth', billingCycle);
    }

    trackConversion(tier, billingCycle) {
        console.log(`📊 Conversion tracked: ${tier} tier, ${billingCycle} billing`);
        // In production: Send to analytics platform
    }

    // Enhanced value demonstration methods
    showValueComparison() {
        const comparisons = this.pricing.getValueComparisons();
        let comparisonHTML = '<div style="text-align: left; margin: 1rem 0;">';
        
        comparisons.forEach(comp => {
            comparisonHTML += `
                <div style="display: flex; justify-content: space-between; margin: 0.5rem 0; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 5px;">
                    <span>${comp.item}</span>
                    <span style="font-weight: bold;">R${comp.cost}</span>
                </div>
                <div style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 1rem;">${comp.comparison}</div>
            `;
        });
        
        comparisonHTML += '</div>';
        return comparisonHTML;
    }
}

window.premiumManager = new PremiumManager();