
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL;

const PocketBaseSetup = () => {
  const [checks, setChecks] = useState({
    connection: 'checking',
    admin: 'pending',
    collections: 'pending',
    rules: 'pending'
  });

  useEffect(() => {
    checkPocketBaseConnection();
  }, []);

  const checkPocketBaseConnection = async () => {
    try {
      const response = await fetch(`${POCKETBASE_URL}/api/health`);
      if (response.ok) {
        setChecks(prev => ({ ...prev, connection: 'completed' }));
      } else {
        setChecks(prev => ({ ...prev, connection: 'failed' }));
      }
    } catch (error) {
      setChecks(prev => ({ ...prev, connection: 'failed' }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'checking':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const steps = [
    {
      id: 'connection',
      title: 'PocketBase Connection',
      description: 'Check if PocketBase server is running',
      status: checks.connection,
      action: checks.connection === 'failed' ? 'Run: npm run start:backend' : null
    },
    {
      id: 'admin',
      title: 'Admin Account Setup',
      description: 'Create admin account in PocketBase',
      status: checks.admin,
      link: `${POCKETBASE_URL}/_/`,
      action: 'Open PocketBase Admin Panel'
    },
    {
      id: 'collections',
      title: 'Collections Setup',
      description: 'Create users and transactions collections',
      status: checks.collections,
      action: 'Follow setup guide in backend/pocketbase-setup.md'
    },
    {
      id: 'rules',
      title: 'Authentication Rules',
      description: 'Configure collection access rules',
      status: checks.rules,
      action: 'Set up API rules as per setup guide'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">PocketBase Setup Checklist</h2>
      
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start space-x-3 p-4 border rounded-lg">
            {getStatusIcon(step.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>
              {step.action && (
                <div className="text-sm">
                  {step.link ? (
                    <a 
                      href={step.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>{step.action}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {step.action}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Quick Start:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Open <a href={`${POCKETBASE_URL}/_/`} target="_blank" rel="noopener noreferrer" className="underline">PocketBase Admin</a></li>
          <li>2. Create admin account</li>
          <li>3. Create admin account</li>
          <li>4. Set up collections per the guide</li>
        </ol>
      </div>

      <div className="mt-4 text-center">
        <button 
          onClick={checkPocketBaseConnection}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Recheck Connection
        </button>
      </div>
    </div>
  );
};

export default PocketBaseSetup;
