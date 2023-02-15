import { Octokit } from '@octokit/core';
import { useEffect, useState } from 'react';
import IssueList from '../components/IssueList';
import Pagination from '../Pagination';
import './Home.css';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [issues, setIssues] = useState([]);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(100);
  const [paginationVisible, setPaginationVisible] = useState(false);
  const [url, setUrl] = useState('');
  const [reponame, setReponame] = useState('cpython');
  const [repoowner, setRepoowner] = useState('python');

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
      owner: repoowner,
      repo: reponame,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    getIssues();
  };

  return (
    <div className="home">
      <form
        className="form"
        action=""
        onSubmit={handleSubmit}>
        <div className="input-container">
          <label
            className="label"
            htmlFor="owner">
            Repo Owner:{' '}
          </label>
          <input
            className="input"
            type="text"
            id="owner"
            value={repoowner}
            onChange={(e) => setRepoowner(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label
            className="label"
            htmlFor="name">
            Repo Name:{' '}
          </label>
          <input
            type="text"
            id="name"
            className="input"
            value={reponame}
            onChange={(e) => setReponame(e.target.value)}
          />
        </div>
        <button className="btn">Get issues</button>
      </form>
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
};

export default Home;
