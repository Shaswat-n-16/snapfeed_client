// import React, { useState } from "react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loading from "../layout/Loading";
import axios from "../utils/axios";

const Comment = ({ comment }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-2 overflow-hidden md:max-w-full md:flex">
      <div className=" md:flex-shrink-0 flex items-center rounded">
        <div
          className="
          w-10
          h-10
          bg-red-500
          rounded-full
          flex
          items-center
          justify-center
          font-bold
          text-white
        "
        >
          {comment.userinitials}
        </div>
      </div>
      <div className="p-4 md:w-1/2 md:flex-grow">
        <div className="tracking-wide text-sm text-indigo-500 font-semibold">
          {comment.author}
        </div>
        <p className="mt-2 text-gray-600">{comment.content}</p>
        <button
          className="flex items-center focus:outline-none"
          onClick={handleLike}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 mr-1 ${
              liked ? "text-red-500 animate-like" : "text-gray-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                liked
                  ? "M5 12h14M12 5l7 7-7 7"
                  : "M12 4.5c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2 4.5l4 3.5 4-3.5c1.2-1.1 2-2.7 2-4.5 0-3.3-2.7-6-6-6zm0 10.5l-3.5 3-1.5-1.5 5-4.5 5 4.5-1.5 1.5-3.5-3z"
              }
            />
          </svg>
          <p className="text-gray-600 text-sm">{liked ? "Liked" : "Like"}</p>
        </button>
      </div>
    </div>
  );
};

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [isliked, setIsLiked] = useState(false);
  const [likedBy, setLikedBy] = useState([]);
  const [likecount, setLikecount] = useState(null);
  const [user, setUser] = useState("");
  const [userid, setUserid] = useState("");
  const [postid, setPostid] = useState("");
  const [intials, setInitials] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [creation, setCreate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleComment = async () => {
    try {
      if (auth.loaded && auth.token) {
        const response = await axios.post(`/comment/${id}`, {
          user: auth.user.id,
          comment: comment,
        });
        toast.success(response.message);
        getPost();
      } else {
        toast.error("Not allowed");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPost = async () => {
    try {
      setIsLoading(true);
      const data = await axios.get(`/post/${id}`);
      const timestamp = new Date(`${data.data.postData.createdAt}`);
      const options = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
      };
      const formattedDate = timestamp.toLocaleDateString("en-US", options);

      setUser(data.data.user.fullName);
      setUserid(data.data.user.id);
      setPostid(data.data.postData.id);

      setInitials(data.data.user.initials);
      setTitle(data.data.postData.title);
      setDescription(data.data.postData.description);
      setImage(data.data.postData.image);
      setLikedBy(data.data.postData.likedBy);
      // setIsLiked(data.data.alreadyLiked);
      setLikecount(data.data.postData.like);
      setCreate(formattedDate);
      setComments(data.data.comments.comments);
      // console.log("Post Liked by", data.data.postData.likedBy);
      console.log(likedBy);
      // console.log("If already Liked", data.data.alreadyLiked);
    } catch (error) {
      console.log(error);
      toast.error("Please Login");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };
  const handleLike = async () => {
    if (!auth.token) {
      toast.error("Not allowed");
      navigate("/login");
    } else {
      setIsLiked(!isliked);
      if (isliked) {
        const response = await axios.post(`/post/${id}/unlike`, {
          user: auth.user.id,
        });
        console.log(response);
        setLikecount(likecount - 1);
      } else {
        await axios.post(`/post/${id}/like`, {
          user: auth.user.id,
        });
        setLikecount(likecount + 1);
      }
    }
  };
  useEffect(() => {
    if (auth) {
      const checkLiked = async () => {
        try {
          const response = await axios.get(
            `/post/${id}/is-liked/${auth.user.id}`
          );
          console.log("from checkLIked", response.success);
          setIsLiked(response.success);
        } catch (error) {
          console.error("Error", error);
        }
      };
      checkLiked();
    }
  }, [auth.user]);
  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="max-w-full mx-auto bg-white rounded-md shadow-md overflow-hidden min-h-screen">
          <div className="md:flex gap-4">
            <div className="md:flex items-start justify-center">
              <img
                src={image}
                alt="Post"
                className="w-full object-cover mx-auto "
                style={{ margin: "10px" }}
              />
            </div>
            <div className="md:w-1/2 p-4 flex flex-col justify-center ">
              <div className="flex items-center mb-4">
                <button
                  className="max-w-xs bg-gray-800 mr-5 rounded-full flex items-center text-sm focus:outline-none focus:shadow-solid"
                  id="user-menu"
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <span className="bg-yellow-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white font-medium">{intials}</span>
                  </span>
                </button>
                <div>
                  <h2 className="text-lg font-semibold">{user}</h2>
                  <p className="text-gray-600 text-sm">Created at {creation}</p>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
              <div className="flex-item items-center mb-4">
                <p className="text-gray-600 text-sm">{likecount} Likes</p>

                <button
                  className="flex items-center focus:outline-none"
                  onClick={handleLike}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 mr-1 ${
                      isliked ? "text-red-500 animate-like" : "text-gray-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isliked
                          ? "M5 12h14M12 5l7 7-7 7"
                          : "M12 4.5c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2 4.5l4 3.5 4-3.5c1.2-1.1 2-2.7 2-4.5 0-3.3-2.7-6-6-6zm0 10.5l-3.5 3-1.5-1.5 5-4.5 5 4.5-1.5 1.5-3.5-3z"
                      }
                    />
                  </svg>
                  <p className="text-gray-600 text-sm">
                    {isliked ? "Liked" : "Like"}
                  </p>
                </button>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <div class="flex border rounded-md px-4 py-2">
                  <textarea
                    class="flex-grow resize-none focus:outline-none"
                    rows="3"
                    placeholder="Write your comment..."
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <button
                    class="ml-2 text-blue-500 hover:text-blue-700"
                    onClick={handleComment}
                  >
                    Post Comment
                  </button>
                </div>

                {comments &&
                  comments.map((comment, index) => (
                    <Comment
                      key={comment._id} // Use unique identifier for key
                      comment={{
                        userinitials: `${comment.userinitials}`,
                        author: `${comment.userfullName}`,
                        content: `${comment.commentText}`,
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostView;
