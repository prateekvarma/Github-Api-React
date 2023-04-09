import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ show: false, msg: '' });

  const searchGithubUser = async (user) => {
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.error(err)
    );
    if (response) {
      setGithubUser(response.data);
    } else {
      toggleError(true, 'there is no user with that username');
    }
  };

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        //the data object has a rate object which as a remaining key
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, 'sorry, you have exceeded your hourly rate limit');
        }
      })
      .catch((err) => console.error(err));
  };

  function toggleError(show = false, msg = '') {
    setError({ show, msg });
  }

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
