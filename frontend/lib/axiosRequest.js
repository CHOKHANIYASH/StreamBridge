import axios from "axios";
import { toast } from "react-toastify";

export default async function axiosRequest({
  url,
  method = "get",
  headers = { "Content-Type": "application/json" },
  auth = false,
  errorMessage = "Error occurred, try again later",
  accessToken = "",
  data = null,
}) {
  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
  const axiosInstance = axios.create({ baseURL });

  if (auth) {
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await axiosInstance({
      url,
      method,
      headers,
      data,
    });
    // console.log("Axios response:", response);
    return response;
  } catch (error) {
    console.error("Axios error:", error);
    toast.error(errorMessage, { toastId: "AxiosToastId" });
    throw error; // rethrow so caller can handle if needed
  }
}
