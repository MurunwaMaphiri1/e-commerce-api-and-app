import { useState, useEffect } from "react";

function PaymentUnsuccessful() {

    return (
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <div class="w-full max-w-2xl p-4 bg-white shadow-2xl dark:bg-gray-900 sm:p-10 sm:rounded-3xl">
                <div class="text-center">
                    <div class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full dark:bg-red-700">
                        <svg class="h-12 w-12 text-red-600 dark:text-red-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 class="text-4xl font-extrabold text-red-600 dark:text-red-500">Payment Unsuccessful</h1>
                    <p class="mt-4 text-lg text-gray-800 dark:text-gray-300">
                        We encountered an issue processing your payment. Please try again.
                    </p>
                </div>
                <div class="mt-8 text-center">
                    <a href="/"
                        class="inline-block px-6 py-2 text-lg font-medium text-white transition-transform rounded-full shadow-lg bg-red-600 hover:scale-105 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}

export default PaymentUnsuccessful;
