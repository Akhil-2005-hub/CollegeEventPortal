
import React from 'react';
import { SparklesIcon } from './icons/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <span className="font-bold text-lg">Eventify</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} College Event Portal. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-primary-500 dark:hover:text-primary-400">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-primary-500 dark:hover:text-primary-400">LinkedIn</a>
            <a href="#" className="text-gray-500 hover:text-primary-500 dark:hover:text-primary-400">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
