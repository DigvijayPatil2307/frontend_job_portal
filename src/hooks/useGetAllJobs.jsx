import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Debounce: wait 400ms after last keystroke before fetching
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchedQuery && searchedQuery.trim()) {
          params.append("keyword", searchedQuery.trim());
        }

        const queryString = params.toString();
        const url = queryString 
          ? `${JOB_API_ENDPOINT}/get?${queryString}` 
          : `${JOB_API_ENDPOINT}/get`;

        const res = await axios.get(url, { withCredentials: true });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Fetch jobs error:", error);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [dispatch, searchedQuery]); // Fixed: added searchedQuery to dependency array
};

export default useGetAllJobs;
