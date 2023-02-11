import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  const timelineLink = "http://localhost:8800/api/posts/timeline/" + user._id;
  const profileLink = "http://localhost:8800/api/posts/profile/" + username;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(profileLink)
        : await axios.get(timelineLink);
      setPosts(res.data.sort((p1,p2)=>{
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      }));
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
