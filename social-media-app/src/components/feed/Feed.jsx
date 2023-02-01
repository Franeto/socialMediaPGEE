import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Feed({username}) {
  const [posts, setPosts] = useState([]);
  
  const timelineLink = "http://localhost:8800/api/posts/timeline/63c2b140100d3ab36351137a"
  const profileLink = "http://localhost:8800/api/posts/profile/"+username;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username 
      ? await axios.get(profileLink) 
      : await axios.get(timelineLink);
      setPosts(res.data)
    };
    fetchPosts();
  });

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share/>
          {posts.map((p)=>(
            <Post key={p._id} post={p}/>
          ))}
      </div>
    </div>
  );
}
