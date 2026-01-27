import React, { useState } from 'react';
import { Car, DollarSign, TrendingUp, Calendar, Percent, ChevronRight, Sparkles, Target, PieChart, ArrowRight, CheckCircle2, Search, Menu, Home, CreditCard, Calculator, TrendingUpIcon, Clock, Zap, Award } from 'lucide-react';

export default function PerfectLayout() {
  const [vehiclePrice, setVehiclePrice] = useState(25000);
  const [downPayment, setDownPayment] = useState(5000);
  const [apr, setApr] = useState(6.5);
  const [term, setTerm] = useState(5);
  const [activeCategory, setActiveCategory] = useState('Auto Loans');

  const principal = vehiclePrice - downPayment;
  const monthlyRate = apr / 100 / 12;
  const numberOfPayments = term * 12;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalInterest = (monthlyPayment * numberOfPayments) - principal;

  const categories = [
    { name: 'Math', icon: Calculator },
    { name: 'Home Loans', icon: Home },
    { name: 'Credit Cards', icon: CreditCard },
    { name: 'Auto Loans', icon: Car },
    { name: 'Investment', icon: TrendingUpIcon },
    { name: 'Time & Date', icon: Clock },
  ];

  const calculators = [
    { name: 'Car Loan Calculator', icon: Car, active: true },
    { name: 'Lease Calculator', icon: Calendar },
    { name: 'Hire Purchase', icon: TrendingUp },
    { name: 'PCP Calculator', icon: Target },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col overflow-hidden">
      
      {/* TOP BAR - Fixed Height: 72px */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl z-50 h-[72px] flex-shrink-0">
        <div className="max-w-[1800px] mx-auto px-6 py-4 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left - Logo + Premium Badge Below */}
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Menu className="w-6 h-6 text-slate-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    CalcHowMuch
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    <p className="text-xs text-blue-300 font-medium">Premium Calculator Suite</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Hero Content (SEO) */}
            <div className="text-center">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                Calculate How Much
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Smart financial decisions with instant calculations</p>
            </div>

            {/* Right - Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search calculators..."
                className="pl-12 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-80 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY NAVIGATION - Fixed Height: 60px */}
      <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-xl flex-shrink-0 h-[60px]">
        <div className="max-w-[1800px] mx-auto px-6 h-full flex items-center">
          <div className="flex items-center justify-center gap-3 flex-wrap w-full">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.name;
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`group relative overflow-hidden px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-pulse"></div>
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span className="relative z-10">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - calc(100vh - 72px - 60px - 48px - 10px) = calc(100vh - 190px) */}
      <div style={{ height: 'calc(100vh - 190px)' }} className="overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 py-6 h-full">
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* LEFT NAV - Fixed Width, Internal Scroll, overflow-hidden on parent */}
            <aside className="col-span-2 h-full overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-6 h-full flex flex-col">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2 flex-shrink-0">
                  <Car className="w-4 h-4" />
                  Auto Loans
                </h3>
                
                <nav className="space-y-2 flex-grow overflow-y-auto">
                  {calculators.map((calc, idx) => {
                    const Icon = calc.icon;
                    return (
                      <button
                        key={idx}
                        className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 flex-shrink-0 ${
                          calc.active
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50'
                            : 'bg-slate-800/50 hover:bg-slate-700/50'
                        }`}
                      >
                        {calc.active && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-pulse"></div>
                        )}
                        <div className="relative flex items-center gap-3 p-4">
                          <Icon className={`w-5 h-5 ${calc.active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                          <span className={`text-sm font-medium ${calc.active ? 'text-white' : 'text-slate-300'}`}>
                            {calc.name}
                          </span>
                          {calc.active && <ChevronRight className="w-4 h-4 text-white ml-auto" />}
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-slate-700/50 flex-shrink-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Active Users</span>
                      <span className="text-sm font-bold text-blue-400">12.4K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Calculations</span>
                      <span className="text-sm font-bold text-cyan-400">847K</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* CALCULATION PANE - 37.5% Width, Internal Scroll, overflow-hidden on parent */}
            <section className="col-span-3 h-full overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl h-full flex flex-col">
                
                {/* Header - Fixed */}
                <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 p-6 flex-shrink-0">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-0.5">Car Loan</h3>
                      <p className="text-blue-100 text-sm">Input your details</p>
                    </div>
                  </div>
                </div>

                {/* Inputs - Scrollable */}
                <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                  
                  {/* Vehicle Price */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-sm font-semibold text-slate-300">Vehicle Price</label>
                      </div>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        ${vehiclePrice.toLocaleString()}
                      </p>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="100000"
                      step="1000"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #06b6d4 ${((vehiclePrice - 10000) / 90000) * 100}%, #1e293b ${((vehiclePrice - 10000) / 90000) * 100}%, #1e293b 100%)`
                      }}
                    />
                  </div>

                  {/* Down Payment */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-sm font-semibold text-slate-300">Down Payment</label>
                      </div>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                        ${downPayment.toLocaleString()}
                      </p>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={vehiclePrice * 0.5}
                      step="500"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #059669 ${(downPayment / (vehiclePrice * 0.5)) * 100}%, #1e293b ${(downPayment / (vehiclePrice * 0.5)) * 100}%, #1e293b 100%)`
                      }}
                    />
                  </div>

                  {/* APR */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                          <Percent className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-sm font-semibold text-slate-300">Interest Rate</label>
                      </div>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                        {apr.toFixed(1)}%
                      </p>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      step="0.1"
                      value={apr}
                      onChange={(e) => setApr(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #dc2626 ${((apr - 2) / 13) * 100}%, #1e293b ${((apr - 2) / 13) * 100}%, #1e293b 100%)`
                      }}
                    />
                  </div>

                  {/* Loan Term */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-violet-500 to-indigo-500 p-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-sm font-semibold text-slate-300">Loan Term</label>
                      </div>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                        {term} years
                      </p>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      step="1"
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #6366f1 ${((term - 1) / 6) * 100}%, #1e293b ${((term - 1) / 6) * 100}%, #1e293b 100%)`
                      }}
                    />
                  </div>

                  {/* Calculate Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/50 flex items-center justify-center gap-2 group transition-all transform hover:scale-105">
                    <span>Calculate Loan</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Simple Result Display */}
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-5 shadow-xl">
                    <p className="text-blue-100 text-xs mb-1">Monthly Payment</p>
                    <p className="text-4xl font-black text-white">${Math.round(monthlyPayment).toLocaleString()}</p>
                    <p className="text-cyan-200 text-xs mt-1">for {term * 12} months</p>
                  </div>

                </div>
              </div>
            </section>

            {/* EXPLANATION PANE - 62.5% Width, Internal Scroll, overflow-hidden on parent */}
            <section className="col-span-5 h-full overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl h-full flex flex-col">
                
                {/* Header - Fixed */}
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-slate-700/50 p-6 flex-shrink-0">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-400" />
                    Detailed Analysis & Results
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">Comprehensive breakdown of your loan</p>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                  
                  {/* Summary Cards */}
                  <div>
                    <h5 className="text-lg font-bold text-white mb-4">Financial Summary</h5>
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">Amount Financed</span>
                          <span className="text-xl font-bold text-blue-400">${principal.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">Total Interest</span>
                          <span className="text-xl font-bold text-orange-400">${Math.round(totalInterest).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">Total Payable</span>
                          <span className="text-xl font-bold text-green-400">${Math.round(monthlyPayment * numberOfPayments + downPayment).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Yearly Breakdown Table */}
                  <div>
                    <h5 className="text-lg font-bold text-white mb-4">Yearly Loan Snapshot</h5>
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-700/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase">Year</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-300 uppercase">Payments</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-300 uppercase">Interest</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-300 uppercase">Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {Array.from({ length: term }, (_, i) => {
                            const yearPayments = monthlyPayment * 12;
                            const startBalance = principal - (monthlyPayment * 12 - totalInterest / term) * i;
                            const yearInterest = startBalance * (apr / 100);
                            const endBalance = Math.max(0, startBalance - (yearPayments - yearInterest));
                            
                            return (
                              <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-4 py-3 text-sm text-slate-300">{i + 1}</td>
                                <td className="px-4 py-3 text-sm text-slate-300 text-right">${yearPayments.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="px-4 py-3 text-sm text-orange-400 text-right">${yearInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="px-4 py-3 text-sm text-blue-400 text-right">${endBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <h5 className="text-lg font-bold text-white mb-4">Key Insights</h5>
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-500/20">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-slate-200">Interest Proportion</p>
                            <p className="text-xs text-slate-400 mt-1">Interest represents {Math.round((totalInterest / (monthlyPayment * numberOfPayments)) * 100)}% of your total payments.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-slate-200">Down Payment Impact</p>
                            <p className="text-xs text-slate-400 mt-1">You're putting {Math.round((downPayment / vehiclePrice) * 100)}% down.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-slate-200">Payment Ratio</p>
                            <p className="text-xs text-slate-400 mt-1">Monthly payment is {Math.round((monthlyPayment / vehiclePrice) * 100)}% of vehicle price.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Educational Content */}
                  <div>
                    <h5 className="text-lg font-bold text-white mb-4">Understanding Car Loans</h5>
                    <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
                      <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        A car loan is a secured loan where the vehicle serves as collateral. This typically results in lower interest rates compared to unsecured loans.
                      </p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Making a larger down payment reduces the amount you need to finance, which can lower your monthly payments and reduce the total interest paid over the life of the loan.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* ADSENSE PANE - Fixed Width, Internal Scroll, overflow-hidden on parent */}
            <aside className="col-span-2 h-full overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-6 h-full flex flex-col overflow-y-auto">
                
                <div className="text-center mb-4 flex-shrink-0">
                  <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-full border border-yellow-500/30 mb-3">
                    <span className="text-yellow-400 text-xs font-bold">SPONSORED</span>
                  </div>
                  <h6 className="text-slate-400 text-sm font-semibold">Premium Partners</h6>
                </div>

                {/* Ad Space 1 */}
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-6 mb-4 border border-slate-600/50 h-[250px] flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-xs">Ad Space 300x250</p>
                    <p className="text-slate-600 text-xs mt-1">Google AdSense</p>
                  </div>
                </div>

                {/* Ad Space 2 */}
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-6 mb-4 border border-slate-600/50 h-[250px] flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-400 text-xs">Ad Space 300x250</p>
                    <p className="text-slate-600 text-xs mt-1">Google AdSense</p>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-auto pt-4 border-t border-slate-700/50 flex-shrink-0">
                  <p className="text-xs text-slate-500 text-center">Trusted by 12,000+ users</p>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* FOOTER - Fixed Height: 48px with 10px gap above */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-xl flex-shrink-0 h-[48px] mt-[10px]">
        <div className="max-w-[1800px] mx-auto px-6 h-full flex items-center">
          <div className="flex items-center justify-center gap-4 w-full" style={{ fontSize: '15px' }}>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors underline">Privacy</a>
            <span className="text-slate-600">|</span>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors underline">Terms & Conditions</a>
            <span className="text-slate-600">|</span>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors underline">Contact</a>
            <span className="text-slate-600">|</span>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors underline">FAQs</a>
            <span className="text-slate-600">|</span>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors underline">Sitemap</a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">© 2026 @CalcHowMuch</span>
          </div>
        </div>
      </footer>

    </div>
  );
}