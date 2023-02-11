import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import { useState } from "react";
import axios from "axios";

export default function Share() {
   const { user } = useContext(AuthContext);
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
   const desc = useRef();
   const [file, setFile] = useState(null);

   const submitHandler = async (e) => {
      e.preventDefault();
      const newPost = {
         userId: user._id,
         description: desc.current.value,
      };
      if (file) {
         const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
         try {
            await axios.post("http://localhost:8800/api/upload", data);
         } catch (err) {
            console.log(err);
         }
      }

      try {
         await axios.post("http://localhost:8800/api/posts", newPost);
         window.location.reload()
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <form onSubmit={submitHandler} className="share">
         <div className="shareWrapper">
            <div className="shareTop">
               <img
                  className="shareProfileImg"
                  src={
                     user.profilePicture
                        ? PF + user.profilePicture
                        : PF + "person/noAvatar.jpeg"
                  }
                  alt=""
               />
               <input
                  ref={desc}
                  placeholder={"Какво ти е на ума, " + user.username + "?"}
                  className="shareInput"
               />
            </div>
            <hr className="shareHr" />
            {file && (
               <div className="shareImgContainer">
                  <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                  <Cancel  className="shareCancelImg" onClick={()=>{
                     document.querySelector('form').reset();
                     setFile(null)
                  }}/>
               </div>
            )}
            <div className="shareBottom">
               <div className="shareOptions">
                  <label htmlFor="file" className="shareOption">
                     <PermMedia htmlColor="tomato" className="shareIcon" />
                     <span className="shareOptionText">Снимка или Видео</span>
                     <input
                        style={{ display: "none" }}
                        type="file"
                        id="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => setFile(e.target.files[0])}
                     />
                  </label>
                  <div className="shareOption">
                     <Label htmlColor="blue" className="shareIcon" />
                     <span className="shareOptionText">Таг</span>
                  </div>
                  <div className="shareOption">
                     <Room htmlColor="green" className="shareIcon" />
                     <span className="shareOptionText">Локация</span>
                  </div>
                  <div className="shareOption">
                     <EmojiEmotions
                        htmlColor="goldenrod"
                        className="shareIcon"
                     />
                     <span className="shareOptionText">Чувства</span>
                  </div>
               </div>
               <button className="shareButton" type="submit">
                  Сподели
               </button>
            </div>
         </div>
      </form>
   );
}
