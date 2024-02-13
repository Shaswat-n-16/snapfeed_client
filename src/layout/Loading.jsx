import React from "react";

const Loading = () => {
  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="wrapper">
        <p class="text-lg font-medium text-gray-900 dark:text-white">
          Loading ...
        </p>
        <img
          class="animate-spin h-16 w-16 border-t-8 border-blue-500 border-solid rounded-full"
          src="https://yourloadingimageurl.com/yourimage.gif"
          alt=""
        />
      </div>
    </div>
  );
};

export default Loading;
