// script.js
const apiKey = 'fca_live_cFWtsp1H3Rkx2LF5dJeaOCS0Lf3NPhUyV7nN7cJn';
const apiURL = 'https://api.freecurrencyapi.com/v1/latest';
const historicalURL = 'https://api.freecurrencyapi.com/v1/historical';

document.addEventListener('DOMContentLoaded', () => {
    const baseCurrencySelect = document.getElementById('base-currency');
    const targetCurrencySelect = document.getElementById('target-currency');
    const amountInput = document.getElementById('amount');
    const convertedAmountSpan = document.getElementById('converted-amount');
    const historicalRatesBtn = document.getElementById('historical-rates');
    const historicalRatesContainer = document.getElementById('historical-rates-container');
    const saveFavoriteBtn = document.getElementById('save-favorite');
    const favoriteCurrencyPairsContainer = document.getElementById('favorite-currency-pairs');

    let currencies = [];

    const fetchCurrencies = async () => {
        try {
            let myHeaders = new Headers();
            myHeaders.append("apikey", apiKey);

            let requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: myHeaders
            };

            const response = await fetch(apiURL, requestOptions);
            const result = await response.json();
            currencies = Object.keys(result.data);

            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                baseCurrencySelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = currency;
                targetCurrencySelect.appendChild(option2);
            });
        } catch (error) {
            console.error('Error fetching currencies:', error);
        }
    };

    const convertCurrency = async () => {
        try {
            const baseCurrency = baseCurrencySelect.value;
            const targetCurrency = targetCurrencySelect.value;
            const amount = amountInput.value;

            if (baseCurrency && targetCurrency && amount > 0) {
                let myHeaders = new Headers();
                myHeaders.append("apikey", apiKey);

                let requestOptions = {
                    method: 'GET',
                    redirect: 'follow',
                    headers: myHeaders
                };

                const response = await fetch(`${apiURL}?base_currency=${baseCurrency}&currencies=${targetCurrency}`, requestOptions);
                const result = await response.json();
                const exchangeRate = result.data[targetCurrency];

                const convertedAmount = amount * exchangeRate;
                convertedAmountSpan.textContent = `${convertedAmount.toFixed(2)} ${targetCurrency}`;
            }
        } catch (error) {
            console.error('Error converting currency:', error);
        }
    };

    const fetchHistoricalRates = async () => {
        try {
            const baseCurrency = baseCurrencySelect.value;
            const targetCurrency = targetCurrencySelect.value;
    
            if (!baseCurrency || !targetCurrency) {
                historicalRatesContainer.textContent = 'Please select both currencies';
                return;
            }
    
            let myHeaders = new Headers();
            myHeaders.append("apikey", apiKey);
    
            let requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: myHeaders
            };
            const date ='2022-01-01'
    
            const url = `${historicalURL}?base_currency=${baseCurrency}&currencies=${targetCurrency}&date=${date}`;

        console.log('Request URL:', url); // Log the request URL for debugging
        console.log('Request Headers:', requestOptions.headers); // Log headers for debugging

        const response = await fetch(url, requestOptions);

        if (response.status === 403) {
            throw new Error('Access forbidden. Please check your API key and permissions.');
        }
        const result = await response.json();

        if (!result.data || Object.keys(result.data).length === 0) {
            throw new Error('No historical data found for the selected currencies and date range.');
        }


        const historicalRate = result.data[date][targetCurrency];
        historicalRatesContainer.textContent = `Historical exchange rate on 2022-01-01: 1 ${baseCurrency} = ${historicalRate.toFixed(4)} ${targetCurrency}`;
    } catch (error) {
        console.error('Error fetching historical rates:', error);
        historicalRatesContainer.textContent = `Error: ${error.message}`;
    }
};

const saveFavoritePair = () => {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;

    if (!baseCurrency || !targetCurrency) {
        alert('Please select both currencies');
        return;
    }

    const favoritePairs = JSON.parse(localStorage.getItem('favoritePairs')) || [];
    const newPair = `${baseCurrency}/${targetCurrency}`;

    if (!favoritePairs.includes(newPair)) {
        favoritePairs.push(newPair);
        localStorage.setItem('favoritePairs', JSON.stringify(favoritePairs));
        displayFavoritePairs(favoritePairs);
    }
};

const fetchFavoritePairs = () => {
    const favoritePairs = JSON.parse(localStorage.getItem('favoritePairs')) || [];
    displayFavoritePairs(favoritePairs);
};

const displayFavoritePairs = (favorites) => {
    favoriteCurrencyPairsContainer.innerHTML = '';
    favorites.forEach(pair => {
        const [baseCurrency, targetCurrency] = pair.split('/');
        const button = document.createElement('button');
        button.textContent = `${baseCurrency}/${targetCurrency}`;
        button.addEventListener('click', () => {
            baseCurrencySelect.value = baseCurrency;
            targetCurrencySelect.value = targetCurrency;
            convertCurrency();
        });
        favoriteCurrencyPairsContainer.appendChild(button);
    });
};

    fetchCurrencies();
    amountInput.addEventListener('input', convertCurrency);
    baseCurrencySelect.addEventListener('change', convertCurrency);
    targetCurrencySelect.addEventListener('change', convertCurrency);
    historicalRatesBtn.addEventListener('click', fetchHistoricalRates);
    saveFavoriteBtn.addEventListener('click', saveFavoritePair);
    //fetchFavoritePairs();
});
displayFavoritePairs();

