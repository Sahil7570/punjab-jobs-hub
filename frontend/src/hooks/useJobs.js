import { useState, useEffect, useCallback } from 'react';
import { jobsApi } from '../utils/api';

const DEFAULT_FILTERS = {
  gender: 'all', qualification: 'all', category: 'all', minAge: '', maxAge: '', search: '',
};

export const useJobs = (activeOnly = false) => {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchJobs = useCallback(async (currentFilters, page = 1) => {
    setLoading(true); setError(null);
    try {
      const params = { page, limit: 12 };
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (v && v !== 'all') params[k] = v;
      });
      if (activeOnly) params.activeOnly = 'true';

      const res = await jobsApi.getAll(params);
      setJobs(res.data || []);
      setPagination(res.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => { fetchJobs(filters, 1); }, [filters, fetchJobs]);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const goToPage = (page) => fetchJobs(filters, page);

  return { jobs, loading, error, filters, pagination, updateFilter, resetFilters, goToPage };
};

export const useJobDetail = (id) => {
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    jobsApi.getById(id)
      .then((res) => setJob(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { job, loading, error };
};
