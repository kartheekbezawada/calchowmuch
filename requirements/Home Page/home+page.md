<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CalcHowMuch - Premium Calculator Suite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
        }
        .card-hover {
            transition: all 0.3s ease;
        }
        .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
        }
        
        /* Particle Canvas */
        #particleCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .content-wrapper {
            position: relative;
            z-index: 10;
        }
        
        /* Floating action button */
        .fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
        }
        
        /* Collection modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            align-items: center;
            justify-content: center;
        }
        .modal.active {
            display: flex;
        }
        
        /* Tooltip */
        .tooltip {
            position: relative;
        }
        .tooltip:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            margin-bottom: 8px;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen overflow-x-hidden">
    
    <!-- Particle Canvas -->
    <canvas id="particleCanvas"></canvas>
    
    <!-- Collection Modal -->
    <div id="collectionModal" class="modal">
        <div class="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full mx-4">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold">Create Your Calculator Collection</h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <p class="text-slate-300 mb-6">Group calculators into collections for your financial goals. Examples: "First Home Buyer", "Debt Freedom", "Investment Strategy"</p>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold mb-2">Collection Name</label>
                    <input type="text" placeholder="e.g., First Home Journey" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500">
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-2">Choose Calculators</label>
                    <div class="grid grid-cols-2 gap-3">
                        <label class="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                            <input type="checkbox" class="w-4 h-4">
                            <span class="text-sm">Mortgage Calculator</span>
                        </label>
                        <label class="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                            <input type="checkbox" class="w-4 h-4">
                            <span class="text-sm">Affordability Calculator</span>
                        </label>
                        <label class="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                            <input type="checkbox" class="w-4 h-4">
                            <span class="text-sm">Savings Calculator</span>
                        </label>
                        <label class="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                            <input type="checkbox" class="w-4 h-4">
                            <span class="text-sm">Credit Card Payoff</span>
                        </label>
                    </div>
                </div>
                <button class="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:scale-105 transition-transform">
                    Create Collection
                </button>
            </div>
        </div>
    </div>
    
    <div class="content-wrapper">
        <!-- Header -->
        <header class="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold">CalcHowMuch</h1>
                        <p class="text-xs text-slate-400">Premium Calculator Suite</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <input type="text" placeholder="Search calculators..." class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors w-64">
                </div>
            </div>
        </header>

        <div class="max-w-7xl mx-auto px-6 py-12">
            
            <!-- Hero Section -->
            <div class="text-center mb-16">
                <h2 class="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Calculate How Much
                </h2>
                <p class="text-xl text-slate-300 max-w-2xl mx-auto">
                    Quick calculations for everyday numbers. Fast, focused tools for common finance and math questions.
                </p>
            </div>

            <!-- Interactive Demo Collections -->
            <div class="mb-12">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold flex items-center gap-2">
                        <span class="text-cyan-400">📱</span> Popular Calculator Journeys
                    </h3>
                    <button onclick="openModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-semibold transition-colors">
                        + Create Your Own
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <!-- Collection 1 -->
                    <div class="group bg-gradient-to-br from-purple-900/30 to-slate-800 border border-purple-500/30 rounded-2xl p-6 card-hover cursor-pointer">
                        <div class="flex items-start justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                            </div>
                            <span class="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">3 calculators</span>
                        </div>
                        <h4 class="text-xl font-bold mb-2">First Home Buyer</h4>
                        <p class="text-slate-400 text-sm mb-3">Perfect for first-time home buyers planning their purchase</p>
                        <div class="space-y-2 text-sm text-slate-300">
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                Mortgage Calculator
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                Home Affordability
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                Savings Goal Tracker
                            </div>
                        </div>
                        <div class="mt-4 flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:text-purple-300">
                            Start Journey →
                        </div>
                    </div>

                    <!-- Collection 2 -->
                    <div class="group bg-gradient-to-br from-green-900/30 to-slate-800 border border-green-500/30 rounded-2xl p-6 card-hover cursor-pointer">
                        <div class="flex items-start justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                            </div>
                            <span class="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">4 calculators</span>
                        </div>
                        <h4 class="text-xl font-bold mb-2">Debt Freedom Plan</h4>
                        <p class="text-slate-400 text-sm mb-3">Strategic tools to eliminate debt and build wealth</p>
                        <div class="space-y-2 text-sm text-slate-300">
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                Credit Card Payoff
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                Debt Consolidation
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                Budget Planner
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                Snowball vs Avalanche
                            </div>
                        </div>
                        <div class="mt-4 flex items-center gap-2 text-green-400 text-sm font-medium group-hover:text-green-300">
                            Start Journey →
                        </div>
                    </div>

                    <!-- Collection 3 -->
                    <div class="group bg-gradient-to-br from-orange-900/30 to-slate-800 border border-orange-500/30 rounded-2xl p-6 card-hover cursor-pointer">
                        <div class="flex items-start justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                            <span class="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">3 calculators</span>
                        </div>
                        <h4 class="text-xl font-bold mb-2">Investment Strategy</h4>
                        <p class="text-slate-400 text-sm mb-3">Build long-term wealth with smart investment planning</p>
                        <div class="space-y-2 text-sm text-slate-300">
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                Compound Interest
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                Retirement Calculator
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                ROI Calculator
                            </div>
                        </div>
                        <div class="mt-4 flex items-center gap-2 text-orange-400 text-sm font-medium group-hover:text-orange-300">
                            Start Journey →
                        </div>
                    </div>

                </div>
            </div>

            <!-- All Calculators by Category -->
            <div class="mb-12">
                <h3 class="text-2xl font-bold mb-6">All Calculators</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <!-- Math Category -->
                    <div class="group card-hover relative overflow-hidden bg-slate-800 border border-slate-700 rounded-2xl p-6 cursor-pointer hover:shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h4 class="text-xl font-bold mb-3">Math</h4>
                            <ul class="space-y-2">
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                    Basic Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                    Percentage Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                    Fraction Calculator
                                </li>
                            </ul>
                            <div class="mt-4 flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                                <span class="text-sm font-medium">Explore</span>
                                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Home Loan Category -->
                    <div class="group card-hover relative overflow-hidden bg-slate-800 border border-slate-700 rounded-2xl p-6 cursor-pointer hover:shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                            </div>
                            <h4 class="text-xl font-bold mb-3">Home Loan</h4>
                            <ul class="space-y-2">
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                    Mortgage Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                    Refinance Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                    Affordability Calculator
                                </li>
                            </ul>
                            <div class="mt-4 flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                                <span class="text-sm font-medium">Explore</span>
                                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Credit Cards Category -->
                    <div class="group card-hover relative overflow-hidden bg-slate-800 border border-slate-700 rounded-2xl p-6 cursor-pointer hover:shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                            </div>
                            <h4 class="text-xl font-bold mb-3">Credit Cards</h4>
                            <ul class="space-y-2">
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                                    Payment Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                                    Payoff Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                                    Balance Transfer
                                </li>
                            </ul>
                            <div class="mt-4 flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                                <span class="text-sm font-medium">Explore</span>
                                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Auto Loans Category -->
                    <div class="group card-hover relative overflow-hidden bg-slate-800 border border-slate-700 rounded-2xl p-6 cursor-pointer hover:shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <h4 class="text-xl font-bold mb-3">Auto Loans</h4>
                            <ul class="space-y-2">
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                    Auto Loan Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                    Lease Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                    Trade-in Value
                                </li>
                            </ul>
                            <div class="mt-4 flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                                <span class="text-sm font-medium">Explore</span>
                                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Finance Category -->
                    <div class="group card-hover relative overflow-hidden bg-slate-800 border border-slate-700 rounded-2xl p-6 cursor-pointer hover:shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 class="text-xl font-bold mb-3">Finance</h4>
                            <ul class="space-y-2">
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                                    Investment Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                                    Savings Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                                    Retirement Planning
                                </li>
                            </ul>
                            <div class="mt-4 flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                                <span class="text-sm font-medium">Explore</span>
                                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Time & Date Category -->
                    <div class="group card-hover relative overflow-hidden bg-slate-800 border border-slate-700 rounded-2xl p-6 cursor-pointer hover:shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 class="text-xl font-bold mb-3">Time & Date</h4>
                            <ul class="space-y-2">
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                    Date Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                    Time Calculator
                                </li>
                                <li class="text-slate-400 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                    Age Calculator
                                </li>
                            </ul>
                            <div class="mt-4 flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
                                <span class="text-sm font-medium">Explore</span>
                                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Info Panel -->
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8">
                <div class="max-w-3xl">
                    <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span class="text-cyan-400">💡</span> How to Use CalcHowMuch
                    </h3>
                    <p class="text-slate-300 mb-4">
                        Choose a pre-built calculator journey above, or browse by category to find the perfect tool for your needs. Each calculator is designed to be fast, accurate, and easy to use.
                    </p>
                    <div class="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                        <p class="text-sm text-slate-400">
                            <span class="text-yellow-400 font-semibold">⚠️ Note:</span> Results are estimates for planning purposes only. Always verify details with your lender, advisor, or official documentation.
                        </p>
                    </div>
                </div>
            </div>

        </div>

        <!-- Footer -->
        <footer class="border-t border-slate-700/50 mt-16 py-8 text-center text-slate-400 text-sm">
            <p>© 2026 CalcHowMuch - Premium Calculator Suite</p>
        </footer>
    </div>

    <!-- Floating Action Button -->
    <button onclick="openModal()" class="fab group" data-tooltip="Create Collection">
        <div class="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </div>
    </button>

    <script>
        // Modal Functions
        function openModal() {
            document.getElementById('collectionModal').classList.add('active');
        }
        
        function closeModal() {
            document.getElementById('collectionModal').classList.remove('active');
        }
        
        // Close modal on outside click
        document.getElementById('collectionModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Particle Animation System
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        let particles = [];
        let mouseX = 0;
        let mouseY = 0;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function init() {
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });
        
        init();
        animate();
    </script>

</body>
</html>

---

# Homepage SEO Layout Brief

Date logged: 2026-03-18

## Goal

Create a pixel-clean, Apple-style homepage layout for CalcHowMuch that keeps the minimal UI while adding SEO depth, internal linking, and clearer conversion flow.

## Layout Structure

Top to bottom:

1. Sticky minimal header
2. Hero section
3. Search bar
4. Popular calculators block
5. Cluster cards grid
6. Category sections with contextual links
7. Why Use CalcHowMuch section
8. FAQ section
9. Footer

## Hero Section

Recommended structure:

```html
<section class="hero">
  <h1>All Calculators — Finance, Loan, Mortgage & Math Tools</h1>
  <p>
    Explore mortgage, loan, credit card, finance, percentage, and time calculators.
    Get instant results with simple and accurate tools.
  </p>

  <input type="text" placeholder="Search calculators…" />
</section>
```

Design direction:

- Large clean whitespace
- Center aligned content
- Strong typography
- H1 size: 40px to 48px
- Body text: 16px to 18px
- Max width: 680px
- Padding: 80px top and bottom
- No clutter above the fold

## Popular Calculators Block

Purpose:

- Highest impact addition for SEO and CTR
- Adds strong internal linking near the top of the page

Recommended structure:

```html
<section class="popular">
  <h2>Popular Calculators</h2>
  <ul>
    <li><a href="/mortgage-calculator/">Mortgage Calculator</a></li>
    <li><a href="/loan-calculator/">Loan Calculator</a></li>
    <li><a href="/credit-card-calculator/">Credit Card Calculator</a></li>
    <li><a href="/compound-interest-calculator/">Compound Interest Calculator</a></li>
    <li><a href="/percentage-calculator/">Percentage Calculator</a></li>
  </ul>
</section>
```

UI guidance:

- Inline horizontal chips or a minimal list
- Soft grey background
- Slight hover animation

## Cluster Cards Grid

Keep the existing card/grid concept.

Recommended refinements:

- Equal height cards
- Border radius: 12px to 16px
- Subtle shadow
- Hover scale: `scale(1.02)`
- Apple-style restraint, no visual noise

## Category SEO Blocks

Purpose:

- Primary ranking layer for homepage SEO
- Adds contextual keyword coverage and internal links

Recommended example:

```html
<section>
  <h2>Mortgage & Loan Calculators</h2>
  <p>
    Estimate monthly payments and total interest using our
    <a href="/mortgage-calculator/">mortgage calculator</a>,
    compare borrowing costs with the
    <a href="/loan-calculator/">loan calculator</a>,
    or analyse rate changes using the
    <a href="/interest-rate-change-calculator/">interest rate change calculator</a>.
  </p>
</section>
```

Repeat similar text-link blocks for:

- Credit cards
- Finance
- Percentage
- Time

Design guidance:

- Max width: 700px
- Line height: 1.6 to 1.8
- Clean text blocks
- No heavy containers

## Why Use CalcHowMuch

Purpose:

- Trust
- Engagement
- Better topical clarity

Recommended structure:

```html
<section class="why">
  <h2>Why Use CalcHowMuch</h2>
  <p>
    CalcHowMuch helps you make better financial and everyday decisions by providing
    simple, fast, and accurate calculators. Each tool is designed to give clear
    results, including breakdowns, formulas, and insights so you can compare scenarios
    and understand outcomes.
  </p>
</section>
```

## FAQ Section

Purpose:

- Important for SEO
- Supports SERP visibility
- Expands keyword and intent coverage

Recommended structure:

```html
<section class="faq">
  <h2>Frequently Asked Questions</h2>

  <h3>What calculators are available?</h3>
  <p>We offer mortgage, loan, credit card, finance, percentage, and time calculators.</p>

  <h3>Are these calculators free?</h3>
  <p>Yes, all calculators on CalcHowMuch are free and easy to use.</p>

  <h3>Are the results accurate?</h3>
  <p>Calculations are based on standard formulas and provide reliable estimates.</p>
</section>
```

## Design System

Colors:

- Background: `#ffffff`
- Text: `#111111`
- Secondary text: `#666666`
- Accent: `#2563eb`

Spacing:

- Section padding: 80px
- Between blocks: 48px
- Text spacing: 16px to 24px

Typography:

- Inter or system font
- Clean hierarchy
- Avoid excessive boldness

Cards:

- Border: `1px solid #eee`
- Very light shadow
- Subtle hover treatment

## SEO Impact Summary

| Section | Benefit |
| --- | --- |
| Hero | Keyword clarity |
| Popular calculators | Internal linking boost |
| Cards | Better UX |
| Category text | Ranking power |
| FAQ | SERP impression lift |
| Why section | Better engagement |

## What Not To Do

- Do not add too much text above the fold
- Do not clutter the UI
- Do not remove cards
- Do not keyword stuff

## Expected Outcome

After implementing this direction:

- Homepage becomes a stronger authority hub
- Internal linking improves significantly
- Google understands the content structure more clearly
- Impressions improve
- CTR improves
