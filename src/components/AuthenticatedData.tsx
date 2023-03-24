import React, { useState, useEffect } from 'react';

interface Data {
  [key: string]: any;
}

const AuthenticatedData: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:3001/api/protected-data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const responseData: Data = await response.json();

        if (response.status === 200) {
          setData(responseData);
        } else {
          setError(responseData.error);
        }
      } catch (error: any) {
        setError(error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        <div>
          <h2>Protected Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AuthenticatedData;
