import { Octokit } from '@octokit/core';
import { useEffect, useState } from 'react';
import './App.css';
import IssueList from './components/IssueList';
import Pagination from './Pagination';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [issues, setIssues] = useState([]);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(100);
  const [paginationVisible, setPaginationVisible] = useState(false);
  const [url, setUrl] = useState('');

  const handlePageChange = async (page) => {
    const octokit = new Octokit({
      auth: process.env.REACT_APP_GH_ACCESS_TOKEN,
    });

    const res = await octokit.request(`GET ${url}${page}`, {});
    setCurrentPage(page);
    if (res?.data) {
      setIssues(res.data);
    }
  };

  const getIssues = async (page) => {
    const octokit = new Octokit({
      auth: process.env.REACT_APP_GH_ACCESS_TOKEN,
    });
    const res = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner: 'python',
      repo: 'cpython',
      //   per_page: pageSize,
    });
    const linkHeader = res.headers.link;
    if (res?.data) {
      setPaginationVisible(true);

      let nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
      let tempUrl = linkHeader.match(nextPattern)[0];
      tempUrl = tempUrl.slice(0, tempUrl.lastIndexOf('=') + 1);
      setUrl(tempUrl);

      let lastPattern = /(?<=<)([\S]*)(?=>; rel="Last")/i;
      let lasturl = linkHeader.match(lastPattern)[0];

      let totalPages = Number(lasturl.slice(lasturl.lastIndexOf('=') + 1));
      setTotalPages(totalPages);
      setIssues(res.data);
    }
    //   console.log(res);
  };

  useEffect(() => {
    getIssues();
  }, []);

  return (
    <div className="app">
      <IssueList issues={issues} />
      {paginationVisible && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(page) => handlePageChange(page)}
        />
      )}
    </div>
  );
}

export default App;
