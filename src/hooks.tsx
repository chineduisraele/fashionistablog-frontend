// packages
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "react-query";

// interfaces
import { observerProps } from "./interfaces";

// functions
// const fetchData = async (
//   url: string,
//   setState: React.Dispatch<
//     React.SetStateAction<{
//       isLoading: boolean;
//       isError: boolean;
//       data: AxiosResponse | undefined;
//     }>
//   >
// ) => {
//   setState({ isLoading: true, isError: false, data: undefined });
//   try {
//     const data = await axios.get(url);
//     setState({ isLoading: false, isError: false, data });
//   } catch {
//     setState({ isLoading: false, isError: true, data: undefined });
//   }
// };

const fetchData = async (url: string) => {
  return await axios.get(url);
};

// hooks
const useObserver = ({
  ref,
  options = { rootMargin: "600px" },
}: observerProps) => {
  useEffect(() => {
    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyimg = entry.target as HTMLImageElement;
          if (lazyimg.src !== lazyimg.dataset.src) {
            lazyimg.src = lazyimg.dataset.src!;
          }
          // lazyimg.classList.remove("lazyimg");
          imgObserver.unobserve(lazyimg);
        }
      });
    }, options);

    if (ref.current) {
      ref.current
        .querySelectorAll(".lazyimg")
        .forEach((img) => imageObserver.observe(img));
    }
  });
};

const useFetch = (key: string, url: string, control: unknown) => {
  // const [fetchState, setFetchState] = useState<{
  //   isLoading: boolean;
  //   isError: boolean;
  //   data: AxiosResponse | undefined;
  // }>({ isLoading: true, isError: false, data: undefined });

  return useQuery([key, control], () => fetchData(url), { retry: false });

  // useEffect(() => {
  //   fetchData(url, setFetchState);
  // }, [control, url]);

  // return fetchState;
};

export { useObserver, useFetch };
