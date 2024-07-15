document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'fca_live_cFWtsp1H3Rkx2LF5dJeaOCS0Lf3NPhUyV7nN7cJn';
    const apiURL = 'https://api.freecurrencyapi.com/v1/latest';
    const historicalURL = 'https://api.freecurrencyapi.com/v1/historical'; // Example, adjust according to API docs
    const baseCurrencySelect = document.getElementById('base-currency');
    const targetCurrencySelect = document.getElementById('target-currency');
    const amountInput = document.getElementById('amount');
    const convertedAmountDisplay = document.getElementById('converted-amount');
    const historicalRatesButton = document.getElementById('historical-rates');
    const historicalRatesContainer = document.getElementById('historical-rates-container');
    const saveFavoriteButton = document.getElementById('save-favorite');
    const favoriteCurrencyPairsContainer = document.getElementById('favorite-currency-pairs');

    let myHeaders = new Headers();
    myHeaders.append("apikey", apiKey);

    let requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    // Fetch available currencies and populate dropdowns
    fetch(apiURL, requestOptions)
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.data);
            populateDropdown(baseCurrencySelect, currencies);
            populateDropdown(targetCurrencySelect, currencies);
        })
        .catch(error => console.error('Error fetching currencies:', error));

    // Populate dropdown with currency options
    function populateDropdown(dropdown, currencies) {
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            dropdown.appendChild(option);
        });
    }

    // Event listener for currency conversion
    document.querySelectorAll('#base-currency, #target-currency, #amount').forEach(element => {
        element.addEventListener('input', convertCurrency);
    });

    // Fetch and display converted amount
    function convertCurrency() {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const amount = parseFloat(amountInput.value);

        if (!baseCurrency || !targetCurrency || isNaN(amount) || amount <= 0) {
            convertedAmountDisplay.textContent = 'Invalid input';
            return;
        }

        fetch(`${apiURL}?base_currency=${baseCurrency}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const rate = data.data[targetCurrency];
                const convertedAmount = (amount * rate).toFixed(2);
                convertedAmountDisplay.textContent = `${amount} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`;
            })
            .catch(error => console.error('Error fetching exchange rate:', error));
    }

    // Event listener for fetching historical rates
    historicalRatesButton.addEventListener('click', fetchHistoricalRates);

    function fetchHistoricalRates() {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const date = '2021-01-01'; 
        
        if (!baseCurrency || !targetCurrency) {
            historicalRatesContainer.textContent = 'Please select both currencies';
            return;
        }

        fetch(`${historicalURL}?date=${date}&base_currency=${baseCurrency}&target_currency=${targetCurrency}`, requestOptions)
            .then(response => response.json())
            .then(data => {
             
            const dateKey = Object.keys(data.data)[0];
            if (data.data && data.data[dateKey] && data.data[dateKey][targetCurrency]) {
                const rate = data.data[dateKey][targetCurrency];
                historicalRatesContainer.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
                  //converterContainer.classList.add('expanded'); // Expand the container
            } else {
                historicalRatesContainer.textContent = 'Historical exchange rate not available';
            }
        })    

        .catch(error => console.error('Error fetching historical rates:', error));
    }

    // Event listener for saving favorite currency pairs
    saveFavoriteButton.addEventListener('click', saveFavoriteCurrencyPair);

    function saveFavoriteCurrencyPair() {
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
            displayFavoriteCurrencyPairs();
        }
    }

    // Display favorite currency pairs
    function displayFavoriteCurrencyPairs() {
        const favoritePairs = JSON.parse(localStorage.getItem('favoritePairs')) || [];
        favoriteCurrencyPairsContainer.innerHTML = '';

        favoritePairs.forEach(pair => {
            const pairButton = document.createElement('button');
            pairButton.textContent = pair;
            pairButton.addEventListener('click', () => {
                const [base, target] = pair.split('/');
                baseCurrencySelect.value = base;
                targetCurrencySelect.value = target;
                convertCurrency();
            });
            favoriteCurrencyPairsContainer.appendChild(pairButton);
        });
    }

    // Initial load of favorite currency pairs
    displayFavoriteCurrencyPairs();
});