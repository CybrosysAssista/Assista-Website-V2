"use client";

import { MdArrowForward } from "react-icons/md";

export default function BillingTab() {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Subscription</h2>
        <p className="text-sm text-gray-600 mb-6">
          Manage your Assista Wiki plan, track usage, and update payment details as your team scales.
        </p>
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase font-semibold text-blue-600 mb-2">Current Plan</p>
            <p className="text-2xl font-semibold text-gray-900">Pro (Trial)</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>Billed Monthly</p>
            <p>10 projects • 50 documentation requests</p>
          </div>
          <button
            type="button"
            className="md:col-span-2 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition"
          >
            Update Billing Details
            <MdArrowForward className="text-lg" />
          </button>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Payment History</h2>
        <p className="text-sm text-gray-600 mb-6">
          View your recent invoices and payment history.
        </p>
        <div className="space-y-3">
          {[
            { date: "Nov 1, 2025", amount: "$20.00", status: "Paid" },
            { date: "Oct 1, 2025", amount: "$20.00", status: "Paid" },
            { date: "Sep 1, 2025", amount: "$20.00", status: "Paid" },
          ].map((invoice, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="text-gray-900 font-medium">{invoice.date}</p>
                <p className="text-xs text-gray-600">Pro Plan - Monthly</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-semibold">{invoice.amount}</span>
                <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

