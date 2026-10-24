import { useEffect } from "react";

const APP_NAME = "Bank of CLI";

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`;
  }, [title]);
};