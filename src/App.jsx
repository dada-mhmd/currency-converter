import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [amount, setAmount] = useState('');
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [rates, setRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          'https://api.exchangerate-api.com/v4/latest/' + baseCurrency
        );
        setSupportedCurrencies(Object.keys(response.data.rates));
        setRates(response.data.rates);
      } catch (error) {
        setError(error.message);
      }
    }

    if (baseCurrency) {
      fetchData();
    }
  }, [baseCurrency]);

  function convertCurrency() {
    if (amount && rates[baseCurrency] && rates[targetCurrency]) {
      const converted = (
        (amount * rates[targetCurrency]) /
        rates[baseCurrency]
      ).toFixed(2);
      setConvertedAmount(converted);
      setError(null);
    } else {
      setError(
        'Please select valid base and target currencies and enter a valid amount.'
      );
    }
  }

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-3xl font-semibold text-center mb-8'>
          Currency Converter
        </h1>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <div className='mb-4'>
          <label htmlFor='baseCurrency' className='block mb-2'>
            Base Currency:
          </label>
          <select
            id='baseCurrency'
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-gray-300'
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='targetCurrency' className='block mb-2'>
            Target Currency:
          </label>
          <select
            id='targetCurrency'
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-gray-300'
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='amount' className='block mb-2'>
            Amount:
          </label>
          <input
            type='number'
            id='amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-gray-300'
          />
        </div>
        <button
          onClick={convertCurrency}
          className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'
        >
          Convert
        </button>
        <div className='mt-4'>
          <label htmlFor='convertedAmount' className='block mb-2'>
            Converted Amount:
          </label>
          <div className='flex items-center'>
            <span className='mr-1'>
              {baseCurrency} {amount} = {targetCurrency}{' '}
              {convertedAmount ? ` ${convertedAmount}` : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
