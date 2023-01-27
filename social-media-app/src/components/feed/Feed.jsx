import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  
  const axiosLink = "http://localhost:8800/api/posts/timeline/63c2b140100d3ab36351137a"

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(axiosLink);
      setPosts(res.data)
    };
    fetchPosts();
  });

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share/>
          {posts.map((p)=>(
            <Post key={p.id} post={p}/>
          ))}
      </div>
    </div>
  );
}
