import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../../utils/axios";
import privateRoute from "../../hoc/privateRoute";
import { useNavigate, useParams } from "react-router";

const DeletePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [confirm, setConfirm] = useState("");
  const [description, setDescription] = useState("");
  // const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPost = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/post/${id}`);
      // console.log(image);
      setTitle(response.data.postData.title);
      setDescription(response.data.postData.description);
      setImagePreview(response.data.postData.image);
    } catch (error) {
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const handleDelete = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      // if (!title || !description) throw new Error("Please fill all the fields");
      if (confirm === "Delete this post") {
        const data = await axios.delete(`/post/${id}`);
        console.log(data);
        if (data) {
          toast.success(data.message);
          navigate("/");
        } else {
          toast.error("Error");
        }
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleDelete}
      className="mx-auto w-full sm:w-3/4 py-2 px-3 sm:py-5 sm:px-0 "
    >
      <h2 class="text-4xl font-extrabold my-3">
        Are you sure to delete this post ?
      </h2>

      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4 text-2xl font-bold">{title}</div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {description}
              </label>
            </div>
            <div className="col-span-full">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:cursor-not-allowed">
                <div className="text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full opacity-75"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="italic text-sm font-medium leading-6 text-gray-900"
              >
                Please type "Delete this post" to proceed:
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    onChange={(e) => setConfirm(e.target.value)}
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="title"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Delete this post"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className=" flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Delete
          {isLoading && (
            <svg
              className="animate-spin ml-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default privateRoute(DeletePost);
